import { TodoApp } from './TodoApp';

export class TodoItem {
    id: number;
    text: string;
    completed: boolean;
    app: TodoApp;

    constructor(text: string, app: TodoApp) {
        this.id = Date.now();
        this.text = text;
        this.completed = false;
        this.app = app;
    }

    toggleCompletion() {
        this.completed = !this.completed;
        this.app.initRender();
    }
}
