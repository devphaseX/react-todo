import { FC, useState } from 'react';
import Button, { SelectButton } from './Button';
import styles from '../styles/modules/app.module.scss';
import TodoModal from './TodoModal';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../app/store';
import { setTodoTaskStatus } from '../app/slices/todoSlice';

const AppHeader: FC = () => {
  const [modal, setModalStatus] = useState(false);
  const dispatch = useDispatch<typeof setTodoTaskStatus>();
  const todoStatus = useSelector((state: StoreState) => state.todo.todoStatus);

  function handleSelectTaskFilter(e: any) {
    dispatch(setTodoTaskStatus(e.target.value));
  }

  return (
    <div className={styles.appHeader}>
      <Button variant="primary" onClick={() => setModalStatus(true)}>
        Add Task
      </Button>
      <SelectButton
        id="status"
        value={todoStatus}
        selectHandler={handleSelectTaskFilter}
      >
        <option value="all">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </SelectButton>
      <TodoModal
        type="Add"
        isModalOpen={modal}
        setModalStatus={setModalStatus}
      />
    </div>
  );
};

export default AppHeader;
