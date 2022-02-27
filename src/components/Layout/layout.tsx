import { FC, createElement, Fragment } from 'react';
import { MainNavigation } from './main-navigation';

export const Layout: FC = ({ children }) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
};
