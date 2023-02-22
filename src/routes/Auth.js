import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const auth = getAuth();

    const onChange = (event) => {
        const {
            target: {name, value}
        } = event;
        if(name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                data = await signInWithEmailAndPassword(auth, email, password);
            }
            console.log(data)
        } catch(error) {
            setError(error.message)
        }
    };

    const toggleAccount = () => setNewAccount(prev => !prev);
    const onSocialCLick = async (event) => {
        const {
            target : {name}
        } = event;
        console.log(event);
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider();
        } else if (name === "github") {
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(auth, provider);
    }
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    name="email" 
                    type="text" 
                    placeholder="Email" 
                    required value={email} 
                    onChange={onChange} 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    required value={password} 
                    onChange={onChange} 
                />
                <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
            <div>
                <button name="google" onClick={onSocialCLick}>Continue with Google</button>
                <button name="github" onClick={onSocialCLick}>Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth;