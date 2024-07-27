import { TodoApp } from '../script/TodoApp';

describe('TodoApp', () => {
    let todoApp: TodoApp;

    beforeEach(() => {
        // 테스트 환경에서 필요한 DOM 요소를 설정
        document.body.innerHTML = `
            <div class="todo-app">
                <input type="text" id="new-todo" class="new-todo" placeholder="What needs to be done?" autofocus>
                <ul id="todo-list" class="todo-list"></ul>
                <div class="footer">
                    <span id="todo-count" class="todo-count"></span>
                    <button id="clear-completed" class="clear-completed">Clear Completed (<span id="completed-count">0</span>)</button>
                </div>
            </div>
        `;
        todoApp = new TodoApp();
    });


    test('todo 아이템 추가 테스트', () => {
        todoApp.createTodo('old Test Todo');
        todoApp.createTodo('new Test Todo');

        expect(todoApp.todos.length).toBe(2);
        expect(todoApp.todos[0].text).toBe('new Test Todo');
        expect(todoApp.todos[1].text).toBe('old Test Todo')
    });

    test('todo 아이템 삭제 테스트', () => {
        todoApp.createTodo('old Test Todo');
        todoApp.createTodo('new Test Todo');

        expect(todoApp.todos.length).toBe(2);

        const todoToDelete = todoApp.todos[1].id;
        todoApp.deleteTodo(todoToDelete);

        expect(todoApp.todos.length).toBe(1);
        expect(todoApp.todos[0].text).toBe('new Test Todo');
    });

    test('todo 아이템 토글 상태변경 테스트', () => {
        // 상태변경에 대한 반복적인 테스트 구현
        todoApp.createTodo('Test Todo');

        const todoItem = todoApp.todos[0];
        expect(todoItem.completed).toBe(false);

        todoItem.toggleCompletion();
        expect(todoItem.completed).toBe(true);

        todoItem.toggleCompletion();
        expect(todoItem.completed).toBe(false);
    });
});
