import { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import styles from '../styles/modules/modal.module.scss';
import { MdOutlineClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import Button from './Button';
import { TaskStatus, TodoItem } from '../utils/types';
import { useDispatch } from 'react-redux';
import { addTodo, editTodo } from '../app/slices/todoSlice';
import { createTodo, updateTodo } from '../utils';

type TodoModalProps = (TodoModalAddProps | TodoModalUpdateProps) & {
  isModalOpen: boolean;
  setModalStatus: (status: boolean) => void;
};

interface TodoModalAddProps {
  type: 'Add';
}

interface TodoModalUpdateProps {
  type: 'Update';
  item: TodoItem;
  isEditingMode: boolean;
  setEditingMode: (status: boolean) => void;
}

const TodoModal: FC<TodoModalProps> = (props) => {
  const { type, isModalOpen, setModalStatus } = props;

  let [title, setTitle] = useState('');
  let [status, setStatus] = useState<TaskStatus>('incomplete');
  const [editingMode, setEditingMode] = useState(false);
  const dispatch = useDispatch<typeof addTodo>();

  function submitHandler(e: FormEvent) {
    e.preventDefault();

    if (title === '') {
      toast.error('Sorry!!! 😟️, You forget to name your task.');
    } else {
      if (type === 'Add') {
        _addNewTodo();
      } else if (type === 'Update') {
        _updateTodo();
      }
      clearForm();
      setModalStatus(false);
    }

    function clearForm() {
      setTitle('');
      setStatus('incomplete');
    }

    function _addNewTodo() {
      dispatch(addTodo(createTodo(title, status)));
      toast.success('Task added succesfully');
    }

    function _updateTodo() {
      if (props.type === 'Update') {
        dispatch(editTodo(updateTodo(props.item, { title, status })));
        toast.success('Todo update successfully');
      }
    }
  }

  if (isModalOpen && type === 'Update' && !editingMode) {
    setTitle(props.item.title);
    setStatus(props.item.status);
    setEditingMode(true);
  }

  useEffect(() => {
    if (props.isModalOpen) {
      setEditingMode(false);
    }
  }, [props.isModalOpen]);

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
          <h1 className={styles.formTitle}>{type} Task</h1>
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
                const selectedElement = target as HTMLSelectElement;
                setStatus(
                  selectedElement.selectedOptions[0].value as TaskStatus
                );
              }}
              value={status}
            >
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className={styles.buttonContainer}>
            <Button type="submit">{type} Task</Button>
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
