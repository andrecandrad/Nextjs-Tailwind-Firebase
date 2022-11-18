import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Creative Writes</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <p className="py-2 px-4 text-sm bg-cyan-400 text-white rounded-lg font-medium ml-8">
              Join Now
            </p>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              <Image
                width={100}
                height={100}
                src={user.photoURL}
                alt={user.username}
                className="w-10 rounded-full cursor-pointer border-2 border-cyan-500"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
