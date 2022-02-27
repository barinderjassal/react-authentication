import { FC, createElement, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../context/auth-context';

import './styles/auth.css';

export const AuthForm: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthContext();

  const history = useHistory();

  const emailInputRef = useRef('' as any);
  const passwordInputRef = useRef('' as any);

  

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const sendRequest = async (url: string, enteredEmail: string, enteredPassword: string) => {
    try {
      const data = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!data.ok) {
        // throw the error object to the catch block
        throw await data.json();
      }

      return await data.json();
    } catch (error) {
      // a very descriptive error object from Firebase which could be handled using states
      // to provide interactive feedback to the user
      let errorMessage = 'Authentication Failed!';
      // ignore the error warnings
      if (error && error?.error && error?.error?.message) {
        errorMessage = error.error.message
      }
      // for now just showing an alert
      alert(errorMessage);
    }
  }

  const submitHandler = async (event: any) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Optional: You can add validation on email logic and password

    setIsLoading(true);
    let url;
    if (isLogin) {
      // if user is logging in
      // https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBH75gYN13nejl09RTsFAblawHbe6Au7sw'
    } else {
      // if the user is signing up
      // refer this doc: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBH75gYN13nejl09RTsFAblawHbe6Au7sw'
    }
    // now send the request to the server
    const data = await sendRequest(url, enteredEmail, enteredPassword);
    setIsLoading(false);

    if (data) {
      // get current time stamp in milliseconds(ms)
      const currentTimeStampInMs = new Date().getTime();

      // data.expiresIn is in Seconds, so convert it into ms
      const futureExpirationDateTimeObject = new Date(currentTimeStampInMs + (+data.expiresIn * 1000));

      // set token and session timeout time in the context by passing it to the login function 
      login(data.idToken, futureExpirationDateTimeObject.toISOString());

      // redirect the user to Home Page
      history.replace('/');
    }
  };

  return (
    <section className='auth'>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className='control-element'>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className='control-element'>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className='actions'>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className='toggle'
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};
