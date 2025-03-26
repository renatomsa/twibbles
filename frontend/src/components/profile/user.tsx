"use client";
import { useState } from "react";
import OwnPost from "./ownPost";

const User = () => {
  const [posts, setPosts] = useState([
    { id: 1, user_name: "Alice", post_text: "Hello World!" },
    { id: 2, user_name: "Bob", post_text: "My first post!" },
  ]);

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className="h-screen w-screen flex flex-col">
            {/* Header */}
            <div className="h-[20%] w-full p-5 bg-indigo-600">
                <h1 className="text-white text-3xl">User Header</h1>
            </div>

            {/* Body */}
            <div className="flex-1 w-full p-5 bg-gray-400 overflow-auto">
                <div className="w-full items-center justify-between flex flex-col space-y-4">
                    {/* Botão "Write" */}
                    <div className="absolute ml-[80%] bottom-10">
                        <div className="cursor-pointer p-4 bg-white rounded-xl shadow-lg hover:scale-110">Write</div>
                    </div>

                    {/* Lista de Posts */}
                    {posts.map((post, index) => (
                        <div key={index} className="w-[50%]">
                            <OwnPost key={post.id} {...post} onDelete={handleDeletePost} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default User;
