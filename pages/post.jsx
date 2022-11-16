import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Post() {
  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form>
        <h1 className="text-2xl font-bold">Create a new Post</h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea className="bg-gray-800 min-h-[12rem] w-full text-white rounded-lg p-2 text-sm" />
          <p className="text-sm flex justify-end">0/300</p>
        </div>
      </form>
      <button>Submit</button>
    </div>
  );
}
