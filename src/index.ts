import { TodoApp } from './script/TodoApp';

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp('todo-container-1', { enableDragDrop: true });
    new TodoApp('todo-container-2', { enableDragDrop: false });
});