import { createElement, Fragment, FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout, UserProfile } from '../components';
import { useAuthContext } from '../context/auth-context';
import AuthPage from '../pages/Auth';
import HomePage from '../pages/Home';

export const App: FC = () => {

  /**
   * What is Navigation Guard?
   * Securing the unauthorised access of nav links in 
   * an app when a user is not logged in.
   * 
   * */
  const { isLoggedIn } = useAuthContext();

  return (
    <Fragment>
      <Layout>
        <Switch>
          <Route path='/' exact>
            {isLoggedIn ? <HomePage /> : <Redirect to='/auth' />}
          </Route>
          {!isLoggedIn && (
          <Route path='/auth'>
            <AuthPage />
          </Route>
          )}
          <Route path='/profile'>
            {isLoggedIn ? <UserProfile /> : <Redirect to='/auth' /> }
          </Route>
          
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Layout>
    </Fragment>
  );
};
