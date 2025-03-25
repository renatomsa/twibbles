"use client"; // Marca este arquivo como um componente do cliente

import { useState } from "react";
import Post from "./post";
import CreatePost from "./createPost";

const User = () => {
  const [postList, setPostList] = useState([
    {
      name: "Max Stenio",
      text: "Matéria tá complicada, acho que vou ter que usar o modo estudo",
    },
    {
      name: "Rodrigo Ladvocat",
      text: "Bang Bang Skeet Skeet Skeet",
    },
    {
      name: "JP",
      text: "Eu sou de falar e não de fazer",
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
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <div className="h-[10%] w-full p-5 bg-cyan-900/90">
        <h1 className="text-white text-3xl font-bold">Twibbles</h1>
      </div>

      {/* Body */}
      <div className="flex-1 w-full p-5 bg-gray-400 overflow-auto">
        <div className="w-full items-center justify-between flex flex-col space-y-4">
          {/* Botão "Write" */}
          <div className="absolute ml-[85%] bottom-10">
            <div
              onClick={toggleFormVisibility}
              className="cursor-pointer p-4 bg-cyan-900/80 text-white rounded-xl shadow-lg hover:scale-110"
            >
              Write
            </div>
          </div>

          {/* Exibe o formulário de criação de post */}
          {isFormVisible && (
            <div className="w-[50%] mb-4">
              <CreatePost userName="Novo Usuário" onPostSubmit={handlePostSubmit} />
            </div>
          )}

          {/* Lista de Posts */}
          <div className="w-[50%] ">
            {postList.map((post, index) => (
              <div key={index} className="m-4">
                <Post user_name={post.name} post_text={post.text} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
