import { createSlice } from '@reduxjs/toolkit';
import {
  deleteTodos,
  findTaskInTodo,
  getFromLocalStorage,
  isItemInList,
  syncStateWithLocalStorage,
  updateTodos,
} from '../../utils';
import { TodoItem } from '../../utils/types';

interface InitialTodoData {
  todos: TodoList;
  todoStatus: 'all' | 'complete' | 'incomplete';
}

const todosLocalStorageKey = 'todos';

function _initTodos() {
  const { data: todos, type } = getFromLocalStorage(
    todosLocalStorageKey,
    [] as TodoList
  );

  if (type == 'fallback') {
    _setInitialLocalState();
  }

  function _setInitialLocalState() {
    syncStateWithLocalStorage(todosLocalStorageKey, {
      data: todos,
      overridePersist: true,
    });
  }

  return todos;
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
      state.todos.push(action.payload);
      syncStateWithLocalStorage(todosLocalStorageKey, {
        data: state.todos,
        overridePersist: true,
      });
    },

    deleteTodo(state, action) {
      const todoPosition = findTaskInTodo(state.todos, action.payload);

      if (isItemInList(todoPosition, state.todos.length)) {
        state.todos = deleteTodos(todoPosition, state.todos);
        syncStateWithLocalStorage(todosLocalStorageKey, {
          data: state.todos,
          overridePersist: true,
        });
      }
    },

    editTodo(state, action) {
      const todoPosition = findTaskInTodo(state.todos, action.payload.id);
      if (isItemInList(todoPosition, state.todos.length)) {
        state.todos = updateTodos(todoPosition, action.payload, state.todos);
        syncStateWithLocalStorage(todosLocalStorageKey, {
          data: state.todos,
          overridePersist: true,
        });
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
