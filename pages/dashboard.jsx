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
import Link from "next/link";

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
      toastId: id,
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
        {myPosts.length == 0 && (
          <h3 className="text-lg border p-6 border-gray-200 rounded-lg text-gray-800">
            You havent published anything yet.
          </h3>
        )}
        {myPosts.map((post) => (
          <Message key={post.id} {...post}>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => deletePost(post.id)}
                className="text-red-500 py-2 px-4 flex items-center justify-center gap-2 text-sm rounded-lg border-2 border-red-500"
              >
                <BsFillTrash2Fill className="text-base" />
                Delete
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-teal-600 py-2 px-4 flex items-center justify-center gap-2 text-sm rounded-lg border-2 border-teal-600">
                  <AiFillEdit className="text-base" />
                  Edit
                </button>
              </Link>
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
