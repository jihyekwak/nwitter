import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"; 
import NweetForm from "../components/NweetForm";
import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);

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
  
    return(
        <>
            <NweetForm userObj={userObj} />
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