import React from "react";
import { useAuth } from "../../auth";
import { ensureUsername } from "../../firebase";
import './Login.scss';

export default function Login() {
  const { signInWithGoogle, user, signOutUser } = useAuth();

  const handleAuthClick = async () => { 
    try {
      if (user) {
        await signOutUser();
      } else {
        const loggedInUser = await signInWithGoogle();
        await ensureUsername(loggedInUser); // make sure they have a username
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4 font-bold">GymBuddies</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
        onClick={handleAuthClick}
      >
        {user ? 'Logout' : 'Continue with Google'}
      </button>
    </div>
  );
}
