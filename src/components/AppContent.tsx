import { FC } from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from '../app/store';
import { isListEmpty } from '../utils';
import { TaskStatus } from '../utils/types';
import TodoItem from './TodoItem';

const AppContent: FC = () => {
  const todoList = useSelector((state: StoreState) => state.todo.todos);

  return todoList && !isListEmpty(todoList) ? (
    <div>
      {todoList.map((todo) => (
        <TodoItem item={todo} key={todo.id} />
      ))}
    </div>
  ) : (
    <div>'no todo found'</div>
  );
};

export default AppContent;
