import { TodoApp } from './TodoApp';

class DragDrop {
    private app: TodoApp;
    private draggingElement: HTMLElement | null = null;
    private mouseOffsetX: number = 0;
    private mouseOffsetY: number = 0;

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

        //토글 이벤트가 걸리는 부분 return & 완료처리 아이템 제외
        if (dragTodoItem && !dragTodoItem.querySelector('.todo-text')?.classList.contains('completed')) {
            this.draggingElement = dragTodoItem;
            //선택한 dom요소의 크기와 위치
            const rect = dragTodoItem.getBoundingClientRect();
            //마우스 위치 - 선택한 요소의 위치를 계산하여 초기 위치 저장
            this.mouseOffsetX = event.clientX - rect.left;
            this.mouseOffsetY = event.clientY - rect.top;

            dragTodoItem.classList.add('dragging');
        }
    }

    dragging(event: MouseEvent) {
        if (this.draggingElement && !this.draggingElement.querySelector('.todo-text')?.classList.contains('completed')) {
            //선택한 요소 position 변경하여 마우스 따라오게
            this.draggingElement.style.position = 'absolute';
            // 현재 마우스 좌표 - 초기offset => 현재 drag하고있는 위치
            this.draggingElement.style.top = `${event.clientY - this.mouseOffsetY}px`;
            this.draggingElement.style.left = `${event.clientX - this.mouseOffsetX}px`;
        }
    }

    dragEnd() {
        if (this.draggingElement) {
            this.draggingElement.classList.remove('dragging');
            this.draggingElement.style.position = '';
            this.draggingElement.style.top = '';
            this.draggingElement.style.left = '';
            this.draggingElement = null;
        }
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.dragEnd();
        }
    }
}

export default DragDrop;
