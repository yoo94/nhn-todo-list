import '../style/main.css';
import {TodoItem} from './TodoItem';

export class TodoApp {
    allTodos: TodoItem[];
    activeTodos: TodoItem[];
    completedTodos: TodoItem[];
    filter: 'all' | 'active' | 'completed';

    constructor() {
        this.allTodos = [];
        this.activeTodos = [];
        this.completedTodos = [];
        this.filter = 'all';
        this.bindEvents();
        this.initRender();
    }

    createTodo(text: string) {
        const newTodo = new TodoItem(text,this);
        this.allTodos.unshift(newTodo);
        this.activeTodos.unshift(newTodo);
        this.initRender();
    }
    deleteCompletedTodo = () => {
        this.completedTodos = [];
        this.allTodos = this.allTodos.filter(todo => !todo.completed);
        this.initRender();
    };
    deleteTodo = (id: number) => {
        this.allTodos = this.allTodos.filter(todo => todo.id !== id);
        this.activeTodos = this.activeTodos.filter(todo => todo.id !== id);
        this.completedTodos = this.completedTodos.filter(todo => todo.id !== id);
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
    }
    renderNewItem(todo: TodoItem) {
        const todoList = document.getElementById('todo-list') as HTMLUListElement;
        const clearCompletedButton = document.getElementById('clear-completed') as HTMLUListElement;

        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = String(todo.id);
        li.innerHTML = `
            <input type="checkbox" class="toggle" ${todo.completed ? 'checked' : ''} style="display:none;">
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button class="delete">삭제</button>
        `;
        todoList.appendChild(li);
        li.querySelector('.delete')?.addEventListener('click', () => {
            this.deleteTodo(todo.id);
        });
        li.querySelector('.todo-text')?.addEventListener('click', () => {
            this.setItemToggleState(todo);
        });
        clearCompletedButton?.addEventListener('click', () => {
            this.deleteCompletedTodo();
        });
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
}
