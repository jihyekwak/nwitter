import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, addDoc, getDocs } from "firebase/firestore"; 


const Home = ({ userObj }) => {

    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const getNweets = async () => {
        const dbNweets = await getDocs(collection(dbService, "nweets"));
        dbNweets.forEach((doc) => {
            const nweetObject = {
                ...doc.data(),
                id: doc.id,
            }
            setNweets((prev) => [nweetObject, ...prev]);
        });
    };
    useEffect(() => {
        getNweets();
    }, []);
    console.log(nweets);

    const onSubmit = async (event) => {
        event.preventDefault();
        const docRef = await addDoc(collection(dbService, "nweets"), {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        })
        console.log("Document written with ID: ", docRef.id);
        console.log(docRef);
        setNweet("");
    }

    const onChange = (event) => {
        const {
            target : {value}
        } = event;
        setNweet(value);
    }

    
    return(
        <>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind"></input>
                <input type="submit" value="Nweet"></input>
            </form>
            <div>
                {nweets.map((nweet) => (
                    <div key={nweet.id}>
                        <p>{nweet.text}</p>
                        {nweet.creatorId? (<p>{nweet.creatorId}</p>):null}
                    </div>
                ))}
            </div>
        </>
    )
};

export default Home;