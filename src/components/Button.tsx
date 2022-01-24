import React, { FC } from 'react';
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
  value: string;
  selectHandler: (e: React.SyntheticEvent<HTMLSelectElement, Event>) => void;
}
const SelectButton: FC<SelectButtonProps> = ({
  children,
  id,
  value,
  selectHandler,
}) => (
  <select
    className={createClass([styles.button, styles.button__select])}
    id={id}
    value={value}
    onChange={selectHandler}
  >
    {children}
  </select>
);

export { SelectButton };
export default Button;
