import { FC, createElement, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext, useAuthContext } from '../../context/auth-context';

import './styles/profile-form.css';

export const ProfileForm: FC = () => {
  const newPasswordInputRef = useRef('' as any);

  const { token } = useAuthContext();
  const history = useHistory();

  const sendRequest = async (url: string, newPassword: string) => {
    try {
      const data = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          idToken: token, // token could be sent via Headers like Authorisation header(bearer token) but its upto the API structure
          password: newPassword,
          returnSecureToken: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!data.ok) {
        throw await data.json();
      }
      return await data.json();
    } catch (err) {
      // logs the errors for now
      console.log(err);
    }
  };

  const changePasswordSubmitHandler = async (event: any) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // could add some validations here

    // api end point
    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBH75gYN13nejl09RTsFAblawHbe6Au7sw';
    const response = await sendRequest(url, enteredNewPassword);

    if (response) {
      console.log({ response });

      // redirect the user to Home Page
      history.replace('/');
    }
  };

  return (
    <form className='form' onSubmit={changePasswordSubmitHandler}>
      <div className='control'>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef} minLength={7} />
      </div>
      <div className='action'>
        <button>Change Password</button>
      </div>
    </form>
  );
}
