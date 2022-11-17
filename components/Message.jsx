export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-6 border mt-[-1px] border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <img
          src={avatar}
          alt={username}
          className="w-10 rounded-full border-2 border-cyan-500"
        />
        <h2 className="text-lg font-thin">{username}</h2>
      </div>

      <div className="py-4">
        <p className="font-normal text-base">{description}</p>
      </div>
      {children}
    </div>
  );
}
