import { TaskStatus, TodoItem } from './types';
//@ts-ignore
import { v4 as uuid } from 'uuid';
//@ts-ignore
import { format } from 'date-fns/esm';

export const createClass = (names: Array<string>) =>
  names.filter((name) => name.trim() !== '').join(' ');

export const getFromLocalStorage = <Fallback>(
  key: string,
  fallback: Fallback
) => {
  function getItem(key: string) {
    return window.localStorage.getItem(key);
  }
  if (window) {
    return safelyParseJson(getItem(key), fallback);
  } else {
    throw new TypeError(
      `LocalStorage does not work in a non browser environment.`
    );
  }
};

export const persistToLocalStorage = (data: any, key: string) => {
  function persist(data: any) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }
  if (window) {
    persist(data);
  } else {
    throw new TypeError(
      `LocalStorage does not work in a non browser environment.`
    );
  }
};

type SafeParseResult<D> = SafeFallbackResult<D> | RetrieveResult<D>;

type SafeFallbackResult<D> = { type: 'fallback'; data: D };
type RetrieveResult<D> = { type: 'retrieve'; data: D };

function safelyParseJson<ProcessDataForm>(
  rawData: string | null,
  fallback: ProcessDataForm
): SafeParseResult<ProcessDataForm> {
  let data: ProcessDataForm;
  if (rawData === null) return _createFallbackResult(fallback);

  function _createFallbackResult(
    data: ProcessDataForm
  ): SafeFallbackResult<ProcessDataForm> {
    return { data: fallback, type: 'fallback' };
  }

  function _createRetrieveResult(
    data: ProcessDataForm
  ): RetrieveResult<ProcessDataForm> {
    return { type: 'retrieve', data };
  }

  try {
    data = JSON.parse(rawData);
  } finally {
    if (data! === undefined) {
      return _createFallbackResult(fallback);
    }
    return _createRetrieveResult(data);
  }
}

export function syncStateWithLocalStorage<ParseData = any>(
  key: string,
  fallBackOption: {
    data: any;
    overridePersist?: boolean;
    dataSyncResolver?: (data: ParseData) => ParseData;
  }
) {
  const { data, overridePersist, dataSyncResolver } = fallBackOption;

  if (overridePersist) {
    persistToLocalStorage(data, key);
  } else {
    const cacheLocalStorage = getFromLocalStorage(key, fallBackOption.data);
    let newLocalState = cacheLocalStorage.data;

    if (dataSyncResolver) {
      newLocalState = dataSyncResolver(newLocalState);
    }
    persistToLocalStorage(newLocalState, key);
  }
}

export function createTodo(title: string, status: TaskStatus): TodoItem {
  return {
    id: uuid(),
    title,
    status,
    date: new Date().toLocaleString(),
  };
}

export function updateTodo(
  todo: TodoItem,
  update: Partial<TodoItem>
): TodoItem {
  return { ...todo, ...update, date: new Date().toLocaleString() };
}

export function updateTodos(
  position: number,
  item: TodoItem,
  todos: Array<TodoItem>
) {
  const updatedTodos = [...todos];
  updatedTodos.splice(position, 1, item);
  return updatedTodos;
}

export function deleteTodos(position: number, todos: Array<TodoItem>) {
  const remainTodos = [...todos];
  remainTodos.splice(position, 1);
  return remainTodos;
}

export function isListEmpty(list: Array<any>) {
  return list.length === 0;
}

export function formatTimeForTask(date: string) {
  return date;
}

export function isItemInList(index: number, limit: number) {
  return index > -1 && index < limit;
}

export function findTaskInTodo(todos: Array<TodoItem>, todoId: string) {
  return todos.findIndex((todo) => todo.id === todoId);
}

let getCurrentStatusTodos: (
  todoStatus: TaskStatus,
  todoList: Array<TodoItem>
) => Array<TodoItem>;

{
  const taskFilterMode = {
    all: taskStatusFilter('all'),
    complete: taskStatusFilter('complete'),
    incomplete: taskStatusFilter('incomplete'),
  };

  function taskStatusFilter(status: 'all' | 'complete' | 'incomplete') {
    return function compareStatus(todos: Array<TodoItem>) {
      if (status === 'all') return todos;
      return todos.filter((todo) => todo.status === status);
    };
  }

  getCurrentStatusTodos = function getCurrentStatusTodos(todoStatus, todoList) {
    return taskFilterMode[todoStatus](todoList);
  };
}

export { getCurrentStatusTodos };
