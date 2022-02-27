import { createContext, createElement, useState, useContext, useEffect, useCallback } from 'react';
import { calculateRemainingTime, retrieveAppData } from '../utils/context-helper';

interface AuthContextInterface {
  token: any;
  isLoggedIn: boolean;
  login: (token: string, time: string) => void,
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>({
  token: '',
  isLoggedIn: false,
  login: (token, time) => { },
  logout: () => {}
});

let logoutTimer: any;

export const AuthContextProvider = ({ children }: any) => {
  // retrieve the token and expirationTime once the app loads 
  // from the localStorage using retrieveAppData() function
  const appData = retrieveAppData();
  let initialToken;

  if (appData) {
    initialToken = appData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggenIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.clear();

    // clear the timer manually when user logout before the expiration time
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token: string, expirationTime: string) => {
    setToken(token);
    // store token and expirationTime in localStorage so that they persist when user refresh the page
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    // get the remaining Time from calculateRemainingTime function by passing the date Object 
    // and pass the return value to setTimeout to automatically logout the user
    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (appData && appData.duration) {
      // if there is an appData from the storage, then set the timer
      logoutTimer = setTimeout(logoutHandler, appData.duration);
    }
  }, [logoutTimer, logoutHandler]);

  return (
    <AuthContext.Provider value={{
      token: token,
      isLoggedIn: userIsLoggenIn,
      login: loginHandler,
      logout: logoutHandler
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
