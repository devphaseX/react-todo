import { motion, Variant } from 'framer-motion';
import { FC } from 'react';
import styles from '../styles/modules/todoItem.module.scss';

interface CheckButtonProps {
  isChecked: boolean;
  setCheckedStatus: (status: boolean) => void;
}

const checkMarkVariant: Record<string, Variant> = {
  initial: {
    color: '#fff',
  },
  checked: {
    pathLength: 1,
  },
  unchecked: {
    pathLength: 0,
  },
};

const boxVariant: Record<string, Variant> = {
  checked: {
    backgroundColor: 'var(--primaryPurple)',
    transition: { duration: 0.1 },
  },

  unchecked: {
    backgroundColor: 'var(--gray-1)',
    transition: { duration: 0.1 },
  },
};

const CheckButton: FC<CheckButtonProps> = ({ isChecked, setCheckedStatus }) => (
  <motion.div
    className={styles.svgBox}
    animate={isChecked ? 'checked' : 'unchecked'}
    variants={boxVariant}
    onClick={() => {
      setCheckedStatus(!isChecked);
    }}
    style={{ background: 'red' }}
  >
    <motion.svg className={styles.svg} viewBox="0 0 53 38" fill="none">
      <motion.path
        fill="none"
        strokeMiterlimit="10"
        strokeWidth="6"
        d="M1.5 22L16 36.5L51.5 1"
        strokeLinejoin="round"
        strokeLinecap="round"
        variants={checkMarkVariant}
      />
    </motion.svg>
  </motion.div>
);

export default CheckButton;
