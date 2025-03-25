"use client";

import { useState } from "react";
import Post from "./post";
import CreatePost from "./createPost";

const User = () => {
  const [postList, setPostList] = useState([
    {
      name: "Rodrigo Ladvocat",
      text: "Matéria tá complicada, quero ver o que a gente vai fazer",
    },
    {
      name: "Rodrigo Ladvocat",
      text: "A economia está muito boa, o ovo está barato",
    },
    {
      name: "JP",
      text: "Quero me demitir",
    },
  ]);
  
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };


  const handlePostSubmit = (newPost: string) => {
    const newPostItem = {
      name: "Novo Usuário", 
      text: newPost,
    };

    setPostList((prevList) => [newPostItem, ...prevList]);
    setIsFormVisible(false); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pt-16">
      <main className="flex-1 max-w-2xl mx-auto w-full py-4 px-4">
        <div className="fixed bottom-8 right-8">
          <button 
            onClick={toggleFormVisibility}
            className="bg-cyan-900 text-white p-4 rounded-lg shadow-lg hover:bg-cyan-800 transition-colors"
          >
            Write
          </button>
        </div>

        {isFormVisible && (
          <div className="mb-6 p-4">
            <CreatePost userName="Novo Usuário" onPostSubmit={handlePostSubmit} />
          </div>
        )}

        <div className="space-y-4">
          {postList.map((post, index) => (
            <div key={index} className="mb-4">
              <Post user_name={post.name} post_text={post.text} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default User;
