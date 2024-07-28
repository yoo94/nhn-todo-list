import { TodoApp } from './TodoApp';

class DragDrop {
    private app: TodoApp;
    private draggingElement: HTMLElement | null = null;
    private mouseOffsetX: number = 0;
    private mouseOffsetY: number = 0;
    private draggingElementLocator: HTMLElement | null = null;
    private previewTimeout: number | null = null;
    constructor(app: TodoApp) {
        this.app = app; // TodoApp 인스턴스
        this.bindDragDropEvents(); // 바인딩하는 메서드
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

        if (
            dragTodoItem &&
            (target.classList.contains('delete') ||
                target.classList.contains('todo-text') ||
                dragTodoItem.querySelector('.todo-text')?.classList.contains('completed'))
        ) {
            return;
        }
        if (dragTodoItem) {
            this.draggingElement = dragTodoItem;
            //선택한 dom요소의 크기와 위치
            const rect = dragTodoItem?.getBoundingClientRect();
            //마우스 위치 - 선택한 요소의 위치를 계산하여 초기 위치 저장
            this.mouseOffsetX = event.clientX - rect.left;
            this.mouseOffsetY = event.clientY - rect.top;

            dragTodoItem.style.width = `${rect.width}px`;
            dragTodoItem.style.height = `${rect.height}px`;

            dragTodoItem.classList.add('dragging');
            this.draggingElementLocator = document.createElement('li');
            this.draggingElementLocator.className = 'draggingElementLocator';
            dragTodoItem.parentNode?.insertBefore(this.draggingElementLocator!, dragTodoItem.nextSibling);
        }
    }

    dragging(event: MouseEvent) {
        if (this.draggingElement && !this.draggingElement.querySelector('.todo-text')?.classList.contains('completed')) {
            //선택한 요소 position 변경하여 마우스 따라오게
            this.draggingElement.style.position = 'absolute';
            // 현재 마우스 좌표 - 초기offset => 현재 drag하고있는 위치
            this.draggingElement.style.top = `${event.clientY - this.mouseOffsetY}px`;
            this.draggingElement.style.left = `${event.clientX - this.mouseOffsetX}px`;
            // draggingElementLocator 위치 업데이트
            const elements = Array.from(document.querySelectorAll('.todo-item:not(.dragging)'));
            for (const element of elements) {
                const rect = element.getBoundingClientRect();
                const topBoundary = rect.top - 10; // 상단 경계를 10픽셀 늘림
                const bottomBoundary = rect.bottom + 10; // 하단 경계를 10픽셀 늘림

                if (event.clientY > topBoundary && event.clientY < bottomBoundary) {
                    if (event.clientY < rect.top + rect.height / 2) {
                        element.parentNode?.insertBefore(this.draggingElementLocator!, element);
                    } else {
                        element.parentNode?.insertBefore(this.draggingElementLocator!, element.nextSibling);
                    }

                    if (this.previewTimeout) {
                        clearTimeout(this.previewTimeout);
                    }
                    this.previewTimeout = window.setTimeout(() => {
                        this.setPreview();
                    }, 2000);

                    break;
                }
            }
        }
    }

    dragEnd(event?: MouseEvent) {
        if (this.draggingElement) {
            // 리스트 요소보다 밖으로 나가서 end하면 취소
            const todoList = document.getElementById('todo-list') as HTMLUListElement;
            const todoListRect = todoList.getBoundingClientRect();
            if (!(event) // esc를 눌럿을떄
                || event.clientX < todoListRect.left // 마우스 좌표가 list를 넘어설때
                || event.clientX > todoListRect.right
                || event.clientY < todoListRect.top
                || event.clientY > todoListRect.bottom
            ) {
                this.draggingElement.classList.remove('dragging');
                this.draggingElement.style.position = '';
                this.draggingElement.style.top = '';
                this.draggingElement.style.left = '';
                this.draggingElement.style.width = '';
                this.draggingElement.style.height = '';
                this.draggingElement.style.display='';
                this.draggingElement = null;

                if (this.draggingElementLocator) {
                    this.draggingElementLocator.remove();
                    this.draggingElementLocator = null;
                }
                return;
            }
            if (this.draggingElementLocator && this.draggingElementLocator.parentNode) {
                //draggingElementLocator(빨간줄) 앞에 삽입
                this.draggingElementLocator.parentNode.insertBefore(this.draggingElement, this.draggingElementLocator);
                this.draggingElementLocator.remove();
                this.draggingElementLocator = null;
                this.updateTodosList();
            }

            this.draggingElement = null;
        }
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

    setPreview() {
        if (this.draggingElement) {
            if (this.draggingElementLocator && this.draggingElementLocator.parentNode) {
                const dragging = this.draggingElement;
                dragging.style.display='none';
                const todoList = document.getElementById('todo-list') as HTMLElement;
                if (dragging && todoList) {
                    const clonedElement = dragging.cloneNode(true) as HTMLElement;
                    // 원래 요소의 스타일을 복제하여 적용
                    const rect = dragging?.getBoundingClientRect();
                    //마우스 위치 - 선택한 요소의 위치를 계산하여 초기 위치 저장
                    clonedElement.style.width = `${rect.width}px`;
                    clonedElement.style.height = `${rect.height}px`;
                    // 기존의 draggingElementLocator 내용을 대체
                    this.draggingElementLocator.innerHTML = clonedElement.innerHTML;
                }
            }
        }

    }
}

export default DragDrop;
