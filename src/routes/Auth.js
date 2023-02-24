import React from "react";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import AuthForm from "../components/AuthForm";
import { authService } from "../fbase";

const Auth = () => {
    const onSocialCLick = async (event) => {
        const {
            target : {name}
        } = event;
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider();
        } else if (name === "github") {
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
    };
    
    return (
        <div>
            <AuthForm />   
            <div>
                <button name="google" onClick={onSocialCLick}>Continue with Google</button>
                <button name="github" onClick={onSocialCLick}>Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth;