import '../style/main.css';
import {TodoItem} from './TodoItem';

export class TodoApp {
    todos: TodoItem[];
    filter: 'all' | 'active' | 'completed';

    constructor() {
        this.todos = [];
        this.filter = 'all';
        this.bindEvents();
        this.initRender();
    }

    createTodo(text: string) {
        const newTodo = new TodoItem(text,this);
        this.todos.push(newTodo);
        this.renderNewItem(newTodo);
        this.updateCounts();
    }

    deleteTodo = (id: number) => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        const todoList = document.getElementById('todo-list') as HTMLUListElement;
        const itemToRemove = todoList.querySelector(`li[data-id="${id}"]`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
        this.updateCounts();
    };

    updateTodoItem(todo: TodoItem) {
        const todoList = document.getElementById('todo-list') as HTMLUListElement;
        const itemToUpdate = todoList.querySelector(`li[data-id="${todo.id}"] .todo-text`);
        if (itemToUpdate) {
            itemToUpdate.classList.toggle('completed', todo.completed);
        }
    }

    updateCounts(count?:number) {
        const todoCount = document.getElementById('todo-count') as HTMLSpanElement;
        todoCount.textContent = `${count ?? this.todos.length} items left`;
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

        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = String(todo.id);
        li.innerHTML = `
            <input type="checkbox" class="toggle" ${todo.completed ? 'checked' : ''} style="display:none;">
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button class="delete">삭제</button>
        `;
        todoList.prepend(li); // 새 항목을 리스트 맨 위에 추가
        li.querySelector('.delete')?.addEventListener('click', () => {
            this.deleteTodo(todo.id);
        });
        li.querySelector('.todo-text')?.addEventListener('click', () => {
            todo.toggleCompletion();
        });
    }
    getFilteredItem() {
        const todoList = document.getElementById('todo-list') as HTMLUListElement;
        todoList.innerHTML = '';

        return this.todos.filter(todo => {
            if (this.filter === 'active') return !todo.completed;
            if (this.filter === 'completed') return todo.completed;
            return true;
        });
    }

    initRender() {
        const filteredTodos = this.getFilteredItem();
        filteredTodos.forEach(todoData => {
            this.renderNewItem(todoData);
            this.updateTodoItem(todoData);
        });
        this.updateCounts(filteredTodos.length);
    }
}