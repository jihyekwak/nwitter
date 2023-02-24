import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase"
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
    {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
    {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  )
}

export default App;
