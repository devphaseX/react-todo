import { TaskStatus, TodoItem } from './types';
//@ts-ignore
import { v4 as uuid } from 'uuid';

export const createClass = (names: Array<string>) =>
  names.filter((name) => name.trim() !== '').join(' ');

export const getFromLocalStorage = <Fallback>(
  key: string,
  fallback?: Fallback
) => {
  function getItem(key: string) {
    return window.localStorage.getItem(key);
  }

  try {
    if (!window) {
      throw `LocalStorage does not work in a non browser environment.`;
    }
    let cached: string | null;
    try {
      cached = getItem(key);
    } catch (e) {
      if (fallback === undefined) throw e;
      cached = null;
    }
    return safelyParseJson(cached, fallback);
  } catch (e) {
    throw typeof e === 'string' ? new Error(e) : e;
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

function _markReturnResult<ProcessDataForm>(
  data,
  fallback: true
): SafeFallbackResult<ProcessDataForm>;
function _markReturnResult<ProcessDataForm>(
  data,
  fallback?: false
): RetrieveResult<ProcessDataForm>;

function _markReturnResult<ProcessDataForm>(
  data,
  isFallback?: boolean
): SafeFallbackResult<ProcessDataForm> | RetrieveResult<ProcessDataForm> {
  return { type: isFallback ? 'fallback' : 'retrieve', data };
}

function safelyParseJson<ProcessDataForm>(
  rawData: string | null,
  fallback?: ProcessDataForm
): SafeParseResult<ProcessDataForm> {
  let data: ProcessDataForm;

  if (rawData === null) return _markReturnResult(fallback, true);

  try {
    data = JSON.parse(rawData);
  } catch {
    if (fallback == null) {
      throw new TypeError(
        'Erroring during json parsing, try providing a fallback to safely exit error phase.'
      );
    }
  }

  if ([null, undefined].includes(data)) {
    return _markReturnResult(fallback, true);
  }
  return _markReturnResult(data);
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
    let newLocalState;
    {
      const cacheLocalStorage = getFromLocalStorage(key, fallBackOption.data);
      newLocalState = cacheLocalStorage.data;
    }

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
    date: new Date().toISOString(),
  };
}

export function updateTodo(
  todo: TodoItem,
  update: Partial<TodoItem>
): TodoItem {
  return { ...todo, ...update, date: new Date().toISOString() };
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
  return new Date(date).toLocaleString();
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

export function sortTodosByModifyDate(todos: Array<TodoItem>) {
  function _modifiedDate(todoOne: TodoItem, todoTwo: TodoItem) {
    return parseDateInMilli(todoOne.date) > parseDateInMilli(todoTwo.date)
      ? -1
      : 1;
  }
  return todos.slice(0).sort(_modifiedDate);
}

function parseDateInMilli(date: string | Date) {
  return new Date(date).getTime();
}

export { getCurrentStatusTodos };
