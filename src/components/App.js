import React, { useState } from "react";
import AppRouter from "./Router";
import { auth } from "../fbase"

function App() {
  const currentUser = auth.currentUser;
  console.log(currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(currentUser);
  return (
    <>
    <AppRouter isLoggedIn={isLoggedIn} />
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  )
}

export default App;
