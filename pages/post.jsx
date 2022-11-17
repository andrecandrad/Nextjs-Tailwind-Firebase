import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //Form state
  const [post, setPost] = useState({ description: "" });

  //Getting user
  const [user, loading] = useAuthState(auth);

  //Route
  const route = useRouter();

  //Submit post
  const submitPost = async (e) => {
    e.preventDefault();

    //Run checks for post
    if (!post.description) {
      toast.error("Description Field is Empty. 🤦‍♂️", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    if (post.description.length > 300) {
      toast.error("Description is too long. 😴", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    //Make a new post
    const collectionRef = collection(db, "posts");

    await addDoc(collectionRef, {
      ...post,
      timestamp: serverTimestamp(),
      user: user.uid,
      avatar: user.photoURL,
      username: user.displayName,
    });

    return route.push("/");
  };

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">Create a new Post</h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 min-h-[12rem] w-full text-white rounded-lg p-2 text-sm"
          />
          <p
            className={`text-sm font-medium flex justify-end ${
              post.description.length > 300 ? "text-red-600" : "text-cyan-600"
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-500 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
