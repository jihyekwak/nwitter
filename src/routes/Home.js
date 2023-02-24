import React, { useEffect, useState } from "react";
import { authService, dbService, storageService } from "../fbase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; 
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        const q = query(collection(dbService, 'nweets'),
            orderBy('createdAt', 'desc'));
        onSnapshot(q, querySnapshot => {
            const nweetArr = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
        setNweets(nweetArr);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if( attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        await addDoc(collection(dbService, "nweets"), nweetObj);
        setNweet("");
        setAttachment("");
    }

    const onChange = (event) => {
        const {
            target : {value}
        } = event;
        setNweet(value);
    }

    const onFileChange = (event) => {
        const {
            target: {files}
        } = event;
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { 
                currentTarget : {result} 
            } = finishedEvent;

            setAttachment(result);
        }
        reader.readAsDataURL(file);
    }

    const onClearAttatchment = () => {
        setAttachment("");
    };
    
    return(
        <>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind"></input>
                <input onChange={onFileChange} type="file" accept="image/*"></input>
                <input type="submit" value="Nweet"></input>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttatchment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <>
                        <Nweet 
                            key={nweet.id} 
                            nweetObj={nweet} 
                            isOwner={nweet.creatorId === userObj.uid} />
                    </>
                ))}
            </div>
        </>
    )
};

export default Home;