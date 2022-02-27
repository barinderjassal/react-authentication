import { FC, createElement } from 'react';
import { ProfileForm } from './profile-form';

import './styles/user-profile.css';

export const UserProfile: FC = () => {
  return (
    <section className='profile'>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
};
