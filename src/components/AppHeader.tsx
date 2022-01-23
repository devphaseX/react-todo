import { FC, useState } from 'react';
import Button, { SelectButton } from './Button';
import styles from '../styles/modules/app.module.scss';
import TodoModal from './TodoModal';

const AppHeader: FC = () => {
  const [modal, setModalStatus] = useState(false);

  return (
    <div className={styles.appHeader}>
      <Button variant="primary" onClick={() => setModalStatus(true)}>
        Add Task
      </Button>
      <SelectButton id="status">
        <option value="All">All</option>
        <option value="Complete">Complete</option>
        <option value="InComplete">Incomplete</option>
      </SelectButton>
      <TodoModal isModalOpen={modal} setModalStatus={setModalStatus} />
    </div>
  );
};

export default AppHeader;
