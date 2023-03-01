import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Loader from './loader';

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loader />;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}