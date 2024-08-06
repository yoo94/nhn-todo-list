import { TodoApp } from './TodoApp';

class DragDrop {
    private app: TodoApp;
    private draggingElement: HTMLElement | null = null;
    private mouseOffsetX: number = 0;
    private mouseOffsetY: number = 0;
    private draggingElementLocator: HTMLElement | null = null;
    private previewTimeout: number | null = null;
    private containerId: string;

    constructor(app: TodoApp, containerId: string) {
        this.app = app;
        this.containerId = containerId;
        this.bindDragDropEvents();
    }

    bindDragDropEvents() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.addEventListener('mousedown', this.dragStart.bind(this));
            container.addEventListener('mousemove', this.dragging.bind(this));
            container.addEventListener('mouseup', this.dragEnd.bind(this));
            container.addEventListener('keydown', this.handleKeyDown.bind(this));
        }
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
            const rect = dragTodoItem?.getBoundingClientRect();
            this.mouseOffsetX = event.clientX - rect.left;
            this.mouseOffsetY = event.clientY - rect.top;

            dragTodoItem.style.width = `${rect.width}px`;
            dragTodoItem.style.height = `${rect.height}px`;

            dragTodoItem.classList.add('dragging');
            this.setDraggingElementLocator();
        }
    }

    setDraggingElementLocator() {
        this.draggingElementLocator = document.createElement('li');
        this.draggingElementLocator.className = 'draggingElementLocator';
        if (this.draggingElement?.nextSibling) {
            this.draggingElement.parentNode?.insertBefore(this.draggingElementLocator, this.draggingElement.nextSibling);
        } else {
            this.draggingElement?.parentNode?.appendChild(this.draggingElementLocator);
        }
    }

    dragging(event: MouseEvent) {
        if (this.draggingElement && !this.draggingElement.querySelector('.todo-text')?.classList.contains('completed')) {
            this.draggingElement.style.position = 'absolute';
            this.draggingElement.style.top = `${event.clientY - this.mouseOffsetY}px`;
            this.draggingElement.style.left = `${event.clientX - this.mouseOffsetX}px`;

            const elements = Array.from(document.querySelectorAll(`#${this.containerId} .todo-item:not(.dragging)`));
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
            const todoList = document.getElementById(`todo-list-${this.app.toDoListId}`) as HTMLUListElement;
            const todoListRect = todoList.getBoundingClientRect();
            if (
                !(event) ||
                event.clientX < todoListRect.left ||
                event.clientX > todoListRect.right ||
                event.clientY < todoListRect.top ||
                event.clientY > todoListRect.bottom
            ) {
                this.draggingElement.classList.remove('dragging');
                this.draggingElement.style.position = '';
                this.draggingElement.style.top = '';
                this.draggingElement.style.left = '';
                this.draggingElement.style.width = '';
                this.draggingElement.style.height = '';
                this.draggingElement.style.display = '';
                this.draggingElement = null;

                if (this.draggingElementLocator) {
                    this.draggingElementLocator.remove();
                    this.draggingElementLocator = null;
                }
                return;
            }
            if (this.draggingElementLocator && this.draggingElementLocator.parentNode) {
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
        const elements = Array.from(document.querySelectorAll(`#${this.containerId} .todo-item`));
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
                dragging.style.display = 'none';
                const todoList = document.getElementById(`todo-list-${this.app.toDoListId}`) as HTMLElement;
                if (dragging && todoList) {
                    const clonedElement = dragging.cloneNode(true) as HTMLElement;
                    const rect = dragging?.getBoundingClientRect();
                    clonedElement.style.width = `${rect.width}px`;
                    clonedElement.style.height = `${rect.height}px`;
                    this.draggingElementLocator.innerHTML = clonedElement.innerHTML;
                }
            }
        }
    }
}

export default DragDrop;
