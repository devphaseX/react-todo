import { createSlice } from '@reduxjs/toolkit';
import {
  getFromLocalStorage,
  persistToLocalStorage,
  syncStateWithLocalStorage,
} from '../../utils';
import { TodoItem } from '../../utils/types';

interface InitialTodoData {
  todos: TodoList;
}

const todosLocalStorageKey = 'todos';

function _initTodos() {
  const todos = getFromLocalStorage<TodoList>(todosLocalStorageKey, []);
  if (todos.length === 0) {
    queueMicrotask(() => {
      persistToLocalStorage(todos, todosLocalStorageKey);
    });
  }

  return todos;
}

type TodoList = Array<TodoItem>;
const initialState: InitialTodoData = {
  todos: _initTodos(),
};

const todo = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo(state, action) {
      state.todos.push(action.payload);
      syncStateWithLocalStorage(todosLocalStorageKey, {
        data: [],
        dataSyncResolver: (localState: TodoList) => {
          return [action.payload, ...localState];
        },
      });
    },
  },
});

export const addTodo = todo.actions.addTodo;

export default todo.reducer;
