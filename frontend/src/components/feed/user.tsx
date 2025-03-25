import Post from "./post";

const User = () => {
    const postList = [
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
        }
        
    ];

    return (
        <div className="h-screen w-screen flex flex-col">
            {/* Header */}
            <div className="h-[10%] w-full p-5 bg-indigo-600">
                <h1 className="text-white text-3xl font-bold">Twibbles</h1>
            </div>

            {/* Body */}
            <div className="flex-1 w-full p-5 bg-gray-400 overflow-auto">
                <div className="w-full items-center justify-between flex flex-col space-y-4">
                    {/* Botão "Write" */}
                    <div className="absolute ml-[80%] bottom-10">
                        <div className="cursor-pointer p-4 bg-white rounded-xl shadow-lg hover:scale-110">Write</div>
                    </div>

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