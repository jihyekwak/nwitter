import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../fbase";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await deleteDoc(doc(dbService, "nweets", `${nweetObj.id}`));
        }
    }
    
    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, "nweets", `${nweetObj.id}`), {
            text : newNweet
        }) ;
        setEditing(false);
    }

    const onChange = (event) => {
        const {
            target : {value}
        } = event;
        setNewNweet(value);
    }

    return(
    <div>
        {editing ? (
            <form onSubmit = {onSubmit}>
                <input onChange={onChange} value={newNweet} required></input>
                <input type="submit" value="Update Nweet"></input>
            </form> 
        ) : (
            <>
                <h4>{nweetObj.text}</h4>
                {nweetObj.creatorId? (<p>{nweetObj.creatorId}</p>):null}
                <p>{nweetObj.createdAt}</p>
                {isOwner && (
                    <>
                        <button onClick={toggleEditing}>Edit Nweet</button>
                        <button onClick={onDeleteClick}>Delete Nweet</button>
                    </>
                )}
            </>
        )}
    </div>
    )
}

export default Nweet;