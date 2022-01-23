import { FC, FormEvent, useState } from 'react';
import styles from '../styles/modules/modal.module.scss';
import { MdOutlineClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import Button from './Button';
import { TaskStatus } from '../utils/types';
import { useDispatch } from 'react-redux';
import { addTodo } from '../app/slices/todoSlice';
import { createTodo } from '../utils';

interface TodoModalProps {
  isModalOpen: boolean;
  setModalStatus: (status: boolean) => void;
}

const TodoModal: FC<TodoModalProps> = ({ isModalOpen, setModalStatus }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('incomplete');
  const dispatch = useDispatch<typeof addTodo>();

  function submitHandler(e: FormEvent) {
    e.preventDefault();

    if (title !== '') {
      dispatch(addTodo(createTodo(title, status)));
      toast.success('Task added succesfully');
      setModalStatus(false);
    } else {
      toast.error('Sorry!!! 😟️, You forget to name your task.');
    }

    clearForm();
    function clearForm() {
      setTitle('');
      setStatus('incomplete');
    }
  }

  return (
    <div
      className={styles.wrapper}
      style={{ display: isModalOpen ? 'inherit' : 'none' }}
    >
      <div className={styles.container}>
        <div
          className={styles.closeButton}
          onClick={() => setModalStatus(false)}
          tabIndex={0}
          role="button"
        >
          <MdOutlineClose />
        </div>
        <form className={styles.form} onSubmit={submitHandler}>
          <h1 className={styles.formTitle}>Add Task</h1>
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={({ target: { value } }) => {
                setTitle(value);
              }}
            />
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <select
              name="status"
              id="status"
              onChange={({ target }) => {
                setStatus(
                  (target as HTMLSelectElement).selectedOptions[0]
                    .value as TaskStatus
                );
              }}
              defaultValue={status}
            >
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className={styles.buttonContainer}>
            <Button type="submit">Add Task</Button>
            <Button variant="secondary" onClick={() => setModalStatus(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
