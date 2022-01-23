import { FC } from 'react';
import style from '../styles/modules/title.module.scss';

const PageTitle: FC = ({ children }) => (
  <div className={style.title}>{children}</div>
);

export default PageTitle;
