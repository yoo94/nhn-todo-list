import { TodoApp } from '../script/TodoApp';

describe('TodoApp', () => {
    let todoApp: TodoApp;

    beforeEach(() => {
        // 테스트 환경에서 필요한 DOM 요소를 설정
        document.body.innerHTML = `
            <div class="todo-app">
                <input type="text" id="new-todo1" class="new-todo" placeholder="What needs to be done?" autofocus>
                <ul id="todo-list1" class="todo-list"></ul>
                <div class="footer">
                    <span id="todo-count1" class="todo-count"></span>
                    <button id="clear-completed1" class="clear-completed">Clear Completed (<span id="completed-count1">0</span>)</button>
                </div>
            </div>
        `;
        todoApp = new TodoApp('1');
    });

    test('todo 아이템 추가 테스트', () => {
        todoApp.createTodo('old Test Todo');
        todoApp.createTodo('new Test Todo');

        expect(todoApp.allTodos.length).toBe(2);
        expect(todoApp.allTodos[0].text).toBe('new Test Todo');
        expect(todoApp.allTodos[1].text).toBe('old Test Todo');
    });

    test('todo 아이템 삭제 테스트', () => {
        todoApp.createTodo('old Test Todo');
        todoApp.createTodo('new Test Todo');

        expect(todoApp.allTodos.length).toBe(2);

        const todoToDelete = todoApp.allTodos[1].id;
        todoApp.deleteTodo(todoToDelete);

        expect(todoApp.allTodos.length).toBe(1);
        expect(todoApp.allTodos[0].text).toBe('new Test Todo');
    });

    test('todo 아이템 토글 상태변경 테스트', () => {
        // 상태변경에 대한 반복적인 테스트 구현
        todoApp.createTodo('Test Todo');

        const todoItem = todoApp.allTodos[0];
        expect(todoItem.completed).toBe(false);

        todoApp.setItemToggleState(todoApp.allTodos[0]);
        expect(todoItem.completed).toBe(true);

        todoApp.setItemToggleState(todoApp.allTodos[0]);
        expect(todoItem.completed).toBe(false);
    });

    test('todo 완료된 아이템 전체 삭제 테스트', () => {
        // 상태변경에 대한 반복적인 테스트 구현
        todoApp.createTodo('Test Todo');
        todoApp.createTodo('Test Todo2');
        todoApp.createTodo('Test Todo3');
        todoApp.createTodo('Test Todo4');

        todoApp.setItemToggleState(todoApp.allTodos[0]);
        todoApp.setItemToggleState(todoApp.allTodos[1]);
        todoApp.setItemToggleState(todoApp.allTodos[2]);

        expect(todoApp.allTodos[0].completed).toBe(true);
        expect(todoApp.allTodos[1].completed).toBe(true);
        expect(todoApp.allTodos[2].completed).toBe(true);
        expect(todoApp.completedTodos.length).toBe(3);

        todoApp.deleteCompletedTodo();

        expect(todoApp.completedTodos.length).toBe(0);
        expect(todoApp.allTodos.length).toBe(1);
    });
});
