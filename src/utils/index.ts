import { TaskStatus, TodoItem } from './types';
//@ts-ignore
import { v4 as uuid } from 'uuid';

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

function safelyParseJson<ProcessDataForm>(
  rawData: string | null,
  fallback: ProcessDataForm
): ProcessDataForm {
  let data: ProcessDataForm;
  if (rawData === null) return fallback;
  try {
    data = JSON.parse(rawData);
  } finally {
    if (data! === undefined) {
      return fallback;
    }
    return data;
  }
}

export function syncStateWithLocalStorage<ParseData = any>(
  key: string,
  fallBackOption: {
    data: any;
    dataSyncResolver: (data: ParseData) => ParseData;
  }
) {
  const cacheLocalStorage = getFromLocalStorage(key, fallBackOption.data);
  persistToLocalStorage(
    fallBackOption.dataSyncResolver(cacheLocalStorage),
    key
  );
}

export function createTodo(title: string, status: TaskStatus): TodoItem {
  return {
    id: uuid(),
    title,
    status,
    date: new Date().toLocaleString(),
  };
}

export function isListEmpty(list: Array<any>) {
  return list.length === 0;
}
