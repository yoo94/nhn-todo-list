import { TodoApp } from './TodoApp';
import DragDropPreviewManager from './DragDropPreviewManager';

class DragDrop {
    private app: TodoApp;
    private draggingElement: HTMLElement | null = null;
    private mouseOffsetX: number = 0;
    private mouseOffsetY: number = 0;
    private draggingElementLocator: HTMLElement | null = null;
    private dragDropPreviewManager: DragDropPreviewManager;

    constructor(app: TodoApp) {
        this.app = app; // TodoApp 인스턴스
        this.bindDragDropEvents(); // 바인딩하는 메서드
        this.dragDropPreviewManager = new DragDropPreviewManager(); //preview 생성
    }

    bindDragDropEvents() {
        document.addEventListener('mousedown', this.dragStart.bind(this));
        document.addEventListener('mousemove', this.dragging.bind(this));
        document.addEventListener('mouseup', this.dragEnd.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    dragStart(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const dragTodoItem = target.closest('.todo-item') as HTMLElement;
        //삭제버튼, 완료기능 클릭 시 드레그 x 검증 함수
        if (this.isDragAvailable(target, dragTodoItem)) return;
        if (dragTodoItem) {
            //선택한 todo아이템 draggingElement에 세팅 및 class 와 위치정보 세팅 함수
            this.setDraggingElement(dragTodoItem,event);
            //드래그한 아이템 가이드 라인 생성
            this.setDraggingElementLocator();
        }
    }
    //dragStart 관련 함수
    isDragAvailable(target: HTMLElement, dragTodoItem: HTMLElement | null): boolean {
        return !!(dragTodoItem &&
            (target.classList.contains('delete') ||
                target.classList.contains('todo-text') ||
                dragTodoItem.querySelector('.todo-text')?.classList.contains('completed')));
    }
    setDraggingElement(dragTodoItem: HTMLElement, event: MouseEvent) {
        this.draggingElement = dragTodoItem;
        //선택한 아이템의 크기와 위치
        const rect = dragTodoItem?.getBoundingClientRect();
        //마우스 위치 - 선택한 요소의 위치를 계산하여 초기 위치 저장
        this.mouseOffsetX = event.clientX - rect.left;
        this.mouseOffsetY = event.clientY - rect.top;

        //드래그하는 아이템의 크기 유지
        this.draggingElement.style.width = `${rect.width}px`;
        this.draggingElement.style.height = `${rect.height}px`;

        this.draggingElement.classList.add('dragging');
    }
    setDraggingElementLocator() {
        this.draggingElementLocator = document.createElement('li');
        this.draggingElementLocator.className = 'draggingElementLocator';

        const parentNode = this.draggingElement?.parentNode;
        const nextSibling = this.draggingElement?.nextSibling;
        if (parentNode) {
            if (nextSibling) {
                parentNode.insertBefore(this.draggingElementLocator, nextSibling);
            } else {
                parentNode.appendChild(this.draggingElementLocator);
            }
        }
    }

    dragging(event: MouseEvent) {
        if (this.draggingElement && !this.draggingElement.querySelector('.todo-text')?.classList.contains('completed')) {
            this.setDraggingItemOnMouse(event);
            // draggingElementLocator 위치 업데이트 함수
            this.updateDraggingElementLocatorPosition(event);
        }
    }

    setDraggingItemOnMouse(event: MouseEvent) {
        //선택한 요소 position 변경하여 마우스 따라오게
        const draggingNode = this.draggingElement;
        const draggingNodeStyle = draggingNode?.style;
        if (draggingNode) {
            if (draggingNodeStyle) {
                draggingNodeStyle.position = 'absolute';
                // 현재 마우스 좌표 - 초기offset => 현재 drag하고있는 위치
                draggingNodeStyle.top = `${event.clientY - this.mouseOffsetY}px`;
                draggingNodeStyle.left = `${event.clientX - this.mouseOffsetX}px`;
            }
        }
    }
    updateDraggingElementLocatorPosition(event: MouseEvent) {
        const elements = Array.from(document.querySelectorAll('.todo-item:not(.dragging)'));
        for (const element of elements) {
            const rect = element.getBoundingClientRect();
            const topBoundary = rect.top - 10;
            const bottomBoundary = rect.bottom + 10;

            if (event.clientY > topBoundary && event.clientY < bottomBoundary) {
                if (event.clientY < rect.top + rect.height / 2) {
                    element.parentNode?.insertBefore(this.draggingElementLocator!, element);
                } else {
                    element.parentNode?.insertBefore(this.draggingElementLocator!, element.nextSibling);
                }
                this.dragDropPreviewManager.setDraggingElements(this.draggingElement, this.draggingElementLocator);
                this.dragDropPreviewManager.schedulePreview();
                break;
            }
        }
    }

    dragEnd(event?: MouseEvent) {
        if (this.draggingElement) {
            if (this.isEscapeRange(event)) {
                this.initDraggingItem();
                return;
            }else {
                this.insertDraggingItem();
            }
        }
    }
    isEscapeRange(event?: MouseEvent): boolean {
        // 리스트 요소보다 밖으로 나가서 end하거나 esc 누르면 취소
        const todoList = document.getElementById('todo-list') as HTMLUListElement;
        const todoListRect = todoList.getBoundingClientRect();
        return !(event) ||// esc를 눌럿을떄
            // 마우스 좌표가 list를 넘어설때
            event.clientX < todoListRect.left ||
            event.clientX > todoListRect.right ||
            event.clientY < todoListRect.top ||
            event.clientY > todoListRect.bottom;
    }

    initDraggingItem() {
        this.initDraggingStyles();
        if (this.draggingElementLocator) {
            this.draggingElementLocator.remove();
            this.draggingElementLocator = null;
        }
    }

    insertDraggingItem() {
        const draggingElementLocator = this.draggingElementLocator;
        if (draggingElementLocator && draggingElementLocator.parentNode) {
            const parentNode = draggingElementLocator.parentNode;
            if (parentNode) {
                //draggingElementLocator 앞에 삽입 후 가이드라인 삭제
                parentNode.insertBefore(this.draggingElement!, draggingElementLocator);
                draggingElementLocator.remove();
                this.draggingElementLocator = null;
            }
        }
        this.updateTodosList();
        this.draggingElement = null;
    }

    initDraggingStyles() {
        if (this.draggingElement) {
            this.draggingElement.classList.remove('dragging');
            this.draggingElement.style.position = '';
            this.draggingElement.style.top = '';
            this.draggingElement.style.left = '';
            this.draggingElement.style.width = '';
            this.draggingElement.style.height = '';
            this.draggingElement.style.display = '';
            this.draggingElement = null;
        }
        this.dragDropPreviewManager.clearPreviewTimeout();
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.dragEnd();
        }
    }

    updateTodosList() {
        const elements = Array.from(document.querySelectorAll('.todo-item'));
        const newOrder = elements.map(element => {
            const id = parseInt(element.getAttribute('data-id')!, 10);
            return this.app.allTodos.find(todo => todo.id === id)!;
        });

        this.app.allTodos = newOrder;
        this.app.activeTodos = newOrder.filter(todo => !todo.completed);
        this.app.initRender();
    }
}

export default DragDrop;
