import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/Message";
import { BsFillTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  //Create a state with all posts
  const [myPosts, setMyPosts] = useState([]);

  //Check if user is logged
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //Delete post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    toast.success("Post was deleted. ❌", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    return;
  };

  //Get user data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="my-12">
      <h2 className="text-xl font-medium mb-8 border-l-4 border-cyan-400 pl-2">
        All your posts
      </h2>
      <div>
        {myPosts.map((post) => (
          <Message key={post.id} {...post}>
            <div className="flex gap-4">
              <button
                onClick={() => deletePost(post.id)}
                className="text-red-500 py-2 px-4 flex items-center justify-center gap-2 text-sm rounded-lg border-2 border-red-500"
              >
                <BsFillTrash2Fill className="text-base" />
                Delete
              </button>
              <button className="text-teal-600 py-2 px-4 flex items-center justify-center gap-2 text-sm rounded-lg border-2 border-teal-600">
                <AiFillEdit className="text-base" />
                Edit
              </button>
            </div>
          </Message>
        ))}
      </div>
      <button
        onClick={() => auth.signOut()}
        className="font-medium text-white bg-gray-800 py-2 px-4 rounded-lg my-6 float-right"
      >
        Sign Out
      </button>
    </div>
  );
}
