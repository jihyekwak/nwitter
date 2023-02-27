import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await deleteDoc(doc(dbService, "nweets", `${nweetObj.id}`));
            if (nweetObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, nweetObj.attachmentUrl));
            }
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
    <div className="nweet">
        {editing ? (
            <>
                <form onSubmit = {onSubmit} className="container nweetEdit">
                    <input onChange={onChange} value={newNweet} required autoFocus className="formInput"></input>
                    <input type="submit" value="Update Nweet" className="formBtn"></input>
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel                
                </span> 
            </>
        ) : (
            <>
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && (<img id="myimg" src={nweetObj.attachmentUrl}></img>)}
                {/* {nweetObj.creatorId? (<p>{nweetObj.creatorId}</p>):null} */}
                {/* <p>{nweetObj.createdAt}</p> */}
                {isOwner && (
                    <div className="nweet__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                         <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )}
            </>
        )}
    </div>
    )
}

export default Nweet;