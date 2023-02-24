import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "../fbase";
import { collection, addDoc } from "firebase/firestore"; 
import { ref, uploadString, getDownloadURL } from "firebase/storage";


const NweetForm = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if( attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        };
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await addDoc(collection(dbService, "nweets"), nweetObj);
        setNweet("");
        setAttachment("");
    };

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
        };
        reader.readAsDataURL(file);
    };

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
        </>
    )
};

export default NweetForm;