import { FC } from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from '../app/store';
import { isListEmpty } from '../utils';
import TodoItem from './TodoItem';
import styles from '../styles/modules/app.module.scss';
import { TodoItem as TodoItemType } from '../utils/types';

const taskFilterMode = {
  all: taskStatusFilter('all'),
  complete: taskStatusFilter('complete'),
  incomplete: taskStatusFilter('incomplete'),
};

function taskStatusFilter(status: 'all' | 'complete' | 'incomplete') {
  return function compareStatus(todos: Array<TodoItemType>) {
    if (status === 'all') return todos;
    return todos.filter((todo) => todo.status === status);
  };
}

const AppContent: FC = () => {
  const { todos: todoList, todoStatus } = useSelector(
    (state: StoreState) => state.todo
  );

  console.log(todoStatus);

  return todoList && !isListEmpty(todoList) ? (
    <div className={styles.content__wrapper}>
      {taskFilterMode[todoStatus](todoList).map((todo) => (
        <TodoItem item={todo} key={todo.id} />
      ))}
    </div>
  ) : (
    <div>'no todo found'</div>
  );
};

export default AppContent;
