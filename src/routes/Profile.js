import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../fbase";
import Nweet from "../components/Nweet";
import { updateProfile } from "firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
    const [myNweets, setMyNweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const navigate = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const onChange = (event) => {
        const {
            target : {value}
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, {
                displayName : newDisplayName
            });
        }
        refreshUser();
    }

    const getMyNweets = async () => {
        const q = query(collection(dbService, "nweets"),orderBy("createdAt", "desc"), where("creatorId", "==", userObj.uid))
        const querySnapshot = await getDocs(q);
        const nweetArr = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setMyNweets(nweetArr);
    }
    
    useEffect(() => {
        getMyNweets();
    }, []);
    
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input 
                    onChange={onChange} 
                    value={newDisplayName} 
                    type="text" 
                    placeholder="Display Name" 
                    autoFocus 
                    className="formInput"/>
                <input 
                    type="submit" 
                    value="Update Profile"
                    className="formBtn" 
                    style={{
                        marginTop: 10
                    }}/>
            </form>
            <span className="formBtn cancelBtn logout" onClick={onLogOutClick}>Log Out</span>
            {myNweets.map((nweet) => (
                    <>
                        <Nweet 
                            key={nweet.id} 
                            nweetObj={nweet} 
                            isOwner={nweet.creatorId === userObj.uid} />
                    </>
                ))}
        </div>
    )
};

export default Profile;