export class TodoItem {
    id: number;
    text: string;
    completed: boolean;

    constructor(text: string) {
        this.id = Date.now();
        this.text = text;
        this.completed = false;
    }

    toggleCompletion() {
        this.completed = !this.completed;
    }
}
