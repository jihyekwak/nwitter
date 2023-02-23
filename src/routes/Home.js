import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; 
import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {

    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const q = query(collection(dbService, 'nweets'),
            orderBy('createdAt'));
        onSnapshot(q, querySnapshot => {
            const nweetArr = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
        setNweets(nweetArr);
        console.log('Current tweets: ', nweetArr);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), {
                text: nweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            })
            console.log("Document written with ID: ", docRef.id);
            console.log(docRef);
        } catch (error) {
            console.log(error.massage);
        }
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