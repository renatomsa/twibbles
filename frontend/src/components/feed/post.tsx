interface PostProps {
    user_name: string;
    post_text: string;
  }
  
  const Post: React.FC<PostProps> = ({ user_name, post_text }) => {
    return (
    <div className="border border-gray-800 p-4 rounded-lg shadow-md bg-gray-700/80 text-gray-100">
        <h3 className="font-bold text-lg">{user_name}</h3>
        <div className="p-0.5 my-4 mr-0.5 border-solid border-r-2 bg-gray-900 rounded-lg"></div>
        <div className="bg-gray-600/80 p-4 rounded-lg text-ellipsis">
          <p className="text-gray-100">{post_text}</p>
        </div>
      </div>
    );
  };


  export default Post;