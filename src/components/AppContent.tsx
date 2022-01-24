import { FC } from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from '../app/store';
import { getCurrentStatusTodos, isListEmpty } from '../utils';
import TodoItem from './TodoItem';
import styles from '../styles/modules/app.module.scss';
import { AnimatePresence, motion, Variant } from 'framer-motion';

const todosBoxVariant: Record<string, Variant> = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } },
};

const todoItemVariant: Record<string, Variant> = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AppContent: FC = () => {
  const { todos: todoList, todoStatus } = useSelector(
    (state: StoreState) => state.todo
  );

  const currentTodos = getCurrentStatusTodos(todoStatus, todoList);

  return (
    <motion.div
      className={styles.content__wrapper}
      variants={todosBoxVariant}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {!isListEmpty(currentTodos) ? (
          currentTodos.map((todo) => <TodoItem item={todo} key={todo.id} />)
        ) : (
          <motion.div className={styles.emptyText} variants={todoItemVariant}>
            no todos found
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AppContent;
