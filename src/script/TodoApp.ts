import '../style/main.css';
import {TodoItem} from './TodoItem';
import DragDrop from './DragAndDrop';

export class TodoApp {
    allTodos: TodoItem[];
    activeTodos: TodoItem[];
    completedTodos: TodoItem[];
    filter: 'all' | 'active' | 'completed';
    dragDrop: DragDrop;
    constructor() {
        this.allTodos = [];
        this.activeTodos = [];
        this.completedTodos = [];
        this.filter = 'all';
        this.bindEvents();
        this.initRender();
        this.dragDrop = new DragDrop(this);
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
        this.allTodos = this.allTodos.filter(t  => t.id !== id);
        this.activeTodos = this.activeTodos.filter(t  => t.id !== id);
        this.completedTodos = this.completedTodos.filter(t  => t.id !== id);
        this.initRender();
    };


    setItemToggleState= (todo: TodoItem) => {
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
        const todoCount = document.getElementById('todo-count') as HTMLSpanElement;
        const completedTodoCount = document.getElementById('completed-count') as HTMLSpanElement;
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
        const todoList = document.getElementById('todo-list') as HTMLUListElement;

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
        const todoList = document.getElementById('todo-list') as HTMLUListElement;
        todoList.innerHTML = '';

        const filteredTodos = this.getFilteredItems();
        filteredTodos.forEach(todoData => {
            this.renderNewItem(todoData);
        });

        this.updateCounts();
    }

    bindEvents() {
        document.getElementById('new-todo')?.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const input = event.target as HTMLInputElement;
                //공백만 입력 방지
                if (input.value.trim() !== '') {
                    this.createTodo(input.value);
                    input.value = '';
                }
            }
        });
        document.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', () => {
                this.filter = button.getAttribute('data-filter') as 'all' | 'active' | 'completed';
                document.querySelectorAll('.action-button').forEach(btn => btn.classList.remove('push'));
                button.classList.add('push');
                this.initRender();
            });
        });
        document.getElementById('clear-completed')?.addEventListener('click', this.deleteCompletedTodo);
    }
}
