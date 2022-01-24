import { FC, useEffect, useState } from 'react';
import { TaskStatus, TodoItem as TodoItemData } from '../utils/types';
import styles from '../styles/modules/todoItem.module.scss';
import { createClass, formatTimeForTask, updateTodo } from '../utils';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { deleteTodo, editTodo } from '../app/slices/todoSlice';
import toast from 'react-hot-toast';
import TodoModal from './TodoModal';
import CheckButton from './CheckButton';

const statusStyleName: Partial<Record<TaskStatus, string>> = {
  complete: 'todoText--completed',
};

const TodoItem: FC<{ item: TodoItemData }> = ({ item }) => {
  const dispatch = useDispatch<typeof deleteTodo | typeof editTodo>();
  const [updateModalOpen, setUpdateModalStatus] = useState(false);
  const [isEditingOn, setEditingMode] = useState(false);
  const [isChecked, setCheckedStatus] = useState(item.status === 'complete');
  const [isFirstMount, setFirstMount] = useState(true);

  function handleDelete() {
    dispatch(deleteTodo(item.id));
    toast.success('Todo deleted successfully');
  }

  function handleEdit() {
    setUpdateModalStatus(true);
  }

  useEffect(() => {
    if (isFirstMount) {
      setFirstMount(false);
    } else {
      dispatch(
        editTodo(
          updateTodo(item, { status: isChecked ? 'complete' : 'incomplete' })
        )
      );
    }
  }, [isChecked]);

  const statusStyleClass = statusStyleName[item.status] ?? '';

  return (
    <div className={styles.item}>
      <CheckButton
        isChecked={isChecked || item.status === 'complete'}
        setCheckedStatus={setCheckedStatus}
      />
      <div className={styles.todoDetails}>
        <div className={styles.texts}>
          <p
            className={createClass([
              styles.todoText,
              styles[statusStyleClass] ?? '',
            ])}
          >
            {item.title}
          </p>
          <p className={styles.time}>{formatTimeForTask(item.date)}</p>
        </div>
      </div>
      <div className={styles.todoActions}>
        <div
          className={styles.icon}
          onClick={handleDelete}
          role="button"
          tabIndex={0}
        >
          <MdDelete />
        </div>
        <div
          className={styles.icon}
          onClick={handleEdit}
          role="button"
          tabIndex={0}
        >
          <MdEdit />
        </div>
      </div>
      <TodoModal
        isModalOpen={updateModalOpen}
        item={item}
        isEditingMode={isEditingOn}
        setEditingMode={setEditingMode}
        type="Update"
        setModalStatus={setUpdateModalStatus}
      />
    </div>
  );
};

export default TodoItem;
