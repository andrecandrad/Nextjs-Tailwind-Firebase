import { Timestamp } from "firebase/firestore";
import { BiTimeFive } from "react-icons/bi";
import Image from "next/image";

export default function Message({
  children,
  avatar,
  username,
  description,
  timestamp,
}) {
  return (
    <div className="bg-white p-6 border mt-[-1px] border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <Image
          width={100}
          height={100}
          src={avatar}
          alt={username}
          className="w-10 rounded-full border-2 border-cyan-500"
        />
        <h2 className="text-lg font-thin">{username}</h2>
      </div>

      <div className="py-4">
        <p className="font-normal text-base">{description}</p>
      </div>
      <div className="flex items-center text-gray-600 gap-1 text-sm">
        <BiTimeFive />
        <p>
          {new Date(timestamp?.seconds * 1000)
            .toLocaleDateString("pt-BR")
            .toString()}
        </p>
      </div>
      {children}
    </div>
  );
}
