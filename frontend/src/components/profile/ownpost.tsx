interface PostProps {
  id: number;
  user_name: string;
  post_text: string;
  onDelete: (id: number) => void;
}

const OwnPost: React.FC<PostProps> = ({ id, user_name, post_text, onDelete }) => {
  return (
    <div className="relative border border-gray-800 p-4 rounded-lg shadow-md bg-gray-700/80 text-gray-100">
      {/* Delete Button Inside the Post */}
      <button
        onClick={() => onDelete(id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-gray-400 hover:text-red-500 transition">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        
      </button>

      {/* Post Content */}
      <h3 className="font-bold text-lg">{user_name}</h3>
      <div className="p-0.5 my-4 border-solid border-r-2 bg-gray-900 rounded-lg"></div>
      <div className="bg-gray-600/80 p-4 rounded-lg">
        <p className="text-gray-100">{post_text}</p>
      </div>
    </div>
  );
};

export default OwnPost;
