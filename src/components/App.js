import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase"
import { getAuth, onAuthStateChanged, updateCurrentUser, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        if (user.displayName === null) {
          updateProfile(user, {
            displayName : "User"
          })
        }
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = async () => {
    await updateCurrentUser(authService, authService.currentUser)
    setUserObj(authService.currentUser);
  }

  return (
    <>
    {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} /> : "Initializing..."}
    {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  )
}

export default App;
