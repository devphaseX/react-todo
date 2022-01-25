import { createSlice } from '@reduxjs/toolkit';
import {
  deleteTodos,
  findTaskInTodo,
  getFromLocalStorage,
  isItemInList,
  sortTodosByModifyDate,
  syncStateWithLocalStorage,
  updateTodos,
} from '../../utils';
import { TaskStatus, TodoItem } from '../../utils/types';

interface InitialTodoData {
  todos: TodoList;
  todoStatus: TaskStatus;
}

const todosLocalStorageKey = 'todos';

function _initTodos() {
  let { data: todos, type } = getFromLocalStorage(
    todosLocalStorageKey,
    [] as TodoList
  );

  todos = sortTodosByModifyDate(todos);

  if (type == 'fallback') {
    _setInitialLocalState();
  }

  function _setInitialLocalState() {
    nonRetrivableLocalStorageSync(todos);
  }

  return todos;
}

function nonRetrivableLocalStorageSync(todoList: Array<TodoItem>) {
  return void syncStateWithLocalStorage(todosLocalStorageKey, {
    data: todoList,
    overridePersist: true,
  });
}

type TodoList = Array<TodoItem>;
const initialState: InitialTodoData = {
  todos: _initTodos(),
  todoStatus: 'all',
};

const todo = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo(state, action) {
      state.todos = sortTodosByModifyDate([...state.todos, action.payload]);
      nonRetrivableLocalStorageSync(state.todos);
    },

    deleteTodo(state, action) {
      const todoPosition = findTaskInTodo(state.todos, action.payload);

      if (isItemInList(todoPosition, state.todos.length)) {
        state.todos = sortTodosByModifyDate(
          deleteTodos(todoPosition, state.todos)
        );
        nonRetrivableLocalStorageSync(state.todos);
      }
    },

    editTodo(state, action) {
      const todoPosition = findTaskInTodo(state.todos, action.payload.id);
      if (isItemInList(todoPosition, state.todos.length)) {
        state.todos = sortTodosByModifyDate(
          updateTodos(todoPosition, action.payload, state.todos)
        );
        nonRetrivableLocalStorageSync(state.todos);
      }
    },

    setTodoTaskStatus(state, action) {
      state.todoStatus = action.payload;
    },
  },
});

export const { addTodo, deleteTodo, editTodo, setTodoTaskStatus } =
  todo.actions;

export default todo.reducer;
