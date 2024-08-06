import '../style/main.css';
import { TodoItem } from './TodoItem';
import DragDrop from './DragAndDrop';

interface TodoAppOptions {
    enableDragDrop?: boolean;
}

export class TodoApp {
    allTodos: TodoItem[];
    activeTodos: TodoItem[];
    completedTodos: TodoItem[];
    filter: 'all' | 'active' | 'completed';
    dragDrop: DragDrop | null;
    toDoListId: string;
    container: HTMLElement;

    constructor(containerId: string, options: TodoAppOptions = {}) {
        this.toDoListId = containerId;
        this.allTodos = [];
        this.activeTodos = [];
        this.completedTodos = [];
        this.filter = 'all';
        this.container = document.getElementById(containerId) as HTMLElement;
        this.renderContainer();
        this.bindEvents();
        this.initRender();
        this.dragDrop = options.enableDragDrop ? new DragDrop(this, containerId) : null;
    }

    renderContainer() {
        this.container.innerHTML = `
            <div class="todo-app-${this.toDoListId}">
                <input type="text" id="new-todo-${this.toDoListId}" class="new-todo" placeholder="What needs to be done?" autofocus>
                <ul id="todo-list-${this.toDoListId}" class="todo-list"></ul>
                <div class="footer">
                    <span id="todo-count-${this.toDoListId}" class="todo-count"></span>
                    <nav class="filters">
                        <button class="action-button push" data-filter="all" id="all-${this.toDoListId}">All</button>
                        <button class="action-button" data-filter="active" id="active-${this.toDoListId}">Active</button>
                        <button class="action-button" data-filter="completed" id="completed-${this.toDoListId}">Completed</button>
                    </nav>
                    <button id="clear-completed-${this.toDoListId}" class="clear-completed">Clear Completed (<span id="completed-count-${this.toDoListId}">0</span>)</button>
                </div>
            </div>
        `;
    }

    createTodo(text: string) {
        const newTodo = new TodoItem(text);
        this.allTodos.unshift(newTodo);
        this.activeTodos.unshift(newTodo);
        this.initRender();
    }

    deleteCompletedTodo = () => {
        this.completedTodos = [];
        this.allTodos = this.allTodos.filter(t => !t.completed);
        this.initRender();
    };

    deleteTodo = (id: number) => {
        this.allTodos = this.allTodos.filter(t => t.id !== id);
        this.activeTodos = this.activeTodos.filter(t => t.id !== id);
        this.completedTodos = this.completedTodos.filter(t => t.id !== id);
        this.initRender();
    };

    setItemToggleState = (todo: TodoItem) => {
        if (todo.completed) {
            this.completedTodos = this.completedTodos.filter(t => t.id !== todo.id);
            this.insertByTimestamp(this.activeTodos, todo);
        } else {
            this.activeTodos = this.activeTodos.filter(t => t.id !== todo.id);
            this.insertByTimestamp(this.completedTodos, todo);
        }
        todo.toggleCompletion();
        this.initRender();
    };

    insertByTimestamp(array: TodoItem[], item: TodoItem) {
        const index = array.findIndex(t => t.id < item.id);
        if (index === -1) {
            array.push(item);
        } else {
            array.splice(index, 0, item);
        }
    }

    updateCounts() {
        const todoCount = document.getElementById(`todo-count-${this.toDoListId}`) as HTMLSpanElement;
        const completedTodoCount = document.getElementById(`completed-count-${this.toDoListId}`) as HTMLSpanElement;
        let count: number;
        switch (this.filter) {
            case 'active':
                count = this.activeTodos.length;
                break;
            case 'completed':
                count = this.completedTodos.length;
                break;
            default:
                count = this.allTodos.length;
                break;
        }
        todoCount.textContent = `${count} items left`;
        completedTodoCount.textContent = `${this.completedTodos.length}`;
    }

    renderNewItem(todo: TodoItem) {
        const todoList = document.getElementById(`todo-list-${this.toDoListId}`) as HTMLUListElement;

        const li = this.createTodoLiItem(todo);
        todoList.appendChild(li);

        li.querySelector('.delete')?.addEventListener('click', () => this.deleteTodo(todo.id));
        li.querySelector('.todo-text')?.addEventListener('click', () => this.setItemToggleState(todo));
    }

    createTodoLiItem(todoData: TodoItem): HTMLElement {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = String(todoData.id);
        li.innerHTML = `
            <input type="checkbox" class="toggle" ${todoData.completed ? 'checked' : ''} style="display:none;">
            <span class="todo-text ${todoData.completed ? 'completed' : ''}">${todoData.text}</span>
            <button class="delete">삭제</button>
        `;
        return li;
    }

    getFilteredItems() {
        switch (this.filter) {
            case 'active':
                return this.activeTodos;
            case 'completed':
                return this.completedTodos;
            default:
                return [...this.activeTodos, ...this.completedTodos];
        }
    }

    initRender() {
        const todoList = document.getElementById(`todo-list-${this.toDoListId}`) as HTMLUListElement;
        todoList.innerHTML = '';

        const filteredTodos = this.getFilteredItems();
        filteredTodos.forEach(todoData => {
            this.renderNewItem(todoData);
        });

        this.updateCounts();
    }

    bindEvents() {
        document.getElementById(`new-todo-${this.toDoListId}`)?.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const input = event.target as HTMLInputElement;
                if (input.value.trim() !== '') {
                    this.createTodo(input.value);
                    input.value = '';
                }
            }
        });
        document.getElementById(`all-${this.toDoListId}`)?.addEventListener('click', () => {
            document.querySelectorAll(`.todo-app-${this.toDoListId} .action-button`).forEach(btn => btn.classList.remove('push'));
            document.getElementById(`all-${this.toDoListId}`)?.classList.add('push');
            this.filter = 'all';
            this.initRender();
        });

        document.getElementById(`active-${this.toDoListId}`)?.addEventListener('click', () => {
            document.querySelectorAll(`.todo-app-${this.toDoListId} .action-button`).forEach(btn => btn.classList.remove('push'));
            document.getElementById(`active-${this.toDoListId}`)?.classList.add('push');
            this.filter = 'active';
            this.initRender();
        });

        document.getElementById(`completed-${this.toDoListId}`)?.addEventListener('click', () => {
            document.querySelectorAll(`.todo-app-${this.toDoListId} .action-button`).forEach(btn => btn.classList.remove('push'));
            document.getElementById(`completed-${this.toDoListId}`)?.classList.add('push');
            this.filter = 'completed';
            this.initRender();
        });

        document.getElementById(`clear-completed-${this.toDoListId}`)?.addEventListener('click', this.deleteCompletedTodo);

    }
}
