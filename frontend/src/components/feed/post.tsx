import { Heart } from "lucide-react";
import { useState } from "react";

interface PostProps {
  user_name: string;
  post_text: string;
}

const Post: React.FC<PostProps> = ({ user_name, post_text }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="bg-gray-200 rounded-md p-4 shadow-sm">
      <h3 className="font-semibold text-lg text-gray-800">{user_name}</h3>
      <p className="my-2 text-gray-700">{post_text}</p>
      <div className="flex items-center mt-3">
        <button 
          onClick={toggleLike} 
          className="flex items-center text-gray-500 hover:text-red-500"
        >
          <Heart 
            size={18} 
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
        </button>
      </div>
    </div>
  );
};

export default Post;