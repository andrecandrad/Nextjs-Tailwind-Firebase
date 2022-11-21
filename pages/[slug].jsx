import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { BiTimeFive } from "react-icons/bi";
import Image from "next/image";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //Submit a message
  const submitMessage = async () => {
    //check if user is logged
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      toast.error("Don't leave an empty message! 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  //Get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Comment this post"
            className="bg-gray-800 p-2 pl-4 text-white text-sm w-full rounded-tl-lg rounded-bl-lg outline-0"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm rounded-tr-lg rounded-br-lg"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="text-xl font-medium mb-8 mt-8 border-l-4 border-cyan-400 pl-2">
            Comments
          </h2>
          {allMessages.length <= 0 && (
            <div>
              <h3 className="text-lg border p-6 border-gray-200 rounded-lg text-gray-800">
                This post has any comments yet... 💤
              </h3>
            </div>
          )}
          {allMessages
            ? allMessages.map((message) => (
                <div
                  className="bg-white p-6 border mt-[-1px] border-gray-200 rounded-lg"
                  key={message.time}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      width={100}
                      height={100}
                      className="w-10 rounded-full border-2 border-cyan-500"
                      src={message.avatar}
                      alt={message.userName}
                    />
                    <h2 className="text-lg font-thin">{message.userName}</h2>
                  </div>
                  <div className="py-4">
                    <h2 className="font-normal text-base">{message.message}</h2>
                  </div>
                  <div className="flex items-center text-gray-600 gap-1 text-sm">
                    <BiTimeFive />
                    <p>
                      {new Date(message.time?.seconds * 1000)
                        .toLocaleDateString("pt-BR")
                        .toString()}
                    </p>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </div>
  );
}
