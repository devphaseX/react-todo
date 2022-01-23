import { FC } from 'react';
import styles from '../styles/modules/button.module.scss';
import { createClass } from '../utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  type?: 'submit' | 'button';
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
}) => (
  <button
    className={createClass([styles.button, styles[`button--${variant}`]])}
    type={type}
    onClick={onClick}
  >
    {children}
  </button>
);

interface SelectButtonProps {
  id: string;
}
const SelectButton: FC<SelectButtonProps> = ({ children, id }) => (
  <select
    className={createClass([styles.button, styles.button__select])}
    id={id}
  >
    {children}
  </select>
);

export { SelectButton };
export default Button;
