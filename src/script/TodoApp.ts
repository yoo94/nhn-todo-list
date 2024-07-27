import '../style/main.css';
import { TodoItem } from './TodoItem';

export class TodoApp {
    todos: TodoItem[];

    constructor() {
        this.todos = [];
        this.bindEvents();
        this.render();
    }

    createTodo(text: string) {
        const newTodo = new TodoItem(text);
        this.todos.unshift(newTodo);
        this.render();
    }

    updateCounts() {
        const todoCount = document.getElementById('todo-count') as HTMLSpanElement;
        todoCount.textContent = `${this.todos.length} items left`;
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
    }
    renderNewItem(todo: TodoItem) {
        const todoList = document.getElementById('todo-list') as HTMLUListElement;

        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <button class="delete">삭제</button>
        `;
        todoList.append(li);
    }

    render() {
        const todoList = document.getElementById('todo-list') as HTMLUListElement;
        todoList.innerHTML = '';

        this.todos.forEach(todoData => {
            this.renderNewItem(todoData);
        });

        this.updateCounts();
    }
}
