import { FC } from 'react';
import { TaskStatus, TodoItem as TodoItemData } from '../utils/types';
import styles from '../styles/modules/todoItem.module.scss';
import { createClass } from '../utils';

const statusStyleName: Partial<Record<TaskStatus, string>> = {
  complete: 'todoText--completed',
};

const TodoItem: FC<{ item: TodoItemData }> = ({ item }) => {
  const status = statusStyleName[item.status] ?? '';
  return (
    <div className={styles.item}>
      <div className={styles.todoDetails}>
        <div className={styles.texts}>
          <p className={createClass([styles.todoText, styles[status] ?? ''])}>
            {item.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
