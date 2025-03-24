import Post from "./post";

const User = () => {
    return (
        <div className="h-screen w-screen flex flex-col">
            {/* Header */}
            <div className="h-[20%] w-full p-5 bg-indigo-600">
                <h1 className="text-white text-3xl">User Header</h1>
            </div>
            
            {/* Body */}
            <div className="flex-1 w-full p-5 bg-gray-400 overflow-auto">
            
                <div className="w-full items-center justify-between flex flex-col space-y-4">
                    <div className="absolute ml-[80%] bottom-10">
                        <div className="cursor-pointer p-4 bg-white rounded-xl shadow-lg hover:scale-110">Write</div>
                    </div>
                    <div className="w-[50%]">
                        <Post user_name="Max Stenio" post_text="Matéria de Goalkeeper tá complicada, acho que vou ter que usar o modo estudo" />
                    </div>
                    <div className="w-[50%]">
                        <Post user_name="João Silva" post_text="Acabei de fazer o curso de Next.js, tô animado!" />
                    </div>
                    <div className="w-[50%]">
                        <Post user_name="Maria Oliveira" post_text="Alguém mais está empolgado para o lançamento do jogo novo?" />
                    </div>
                    
                    <div className="w-[50%]">
                        <Post user_name="Carlos Souza" post_text="O desafio de hoje é não procrastinar!" />
                    </div>
                    <div className="w-[50%]">
                        <Post user_name="Lucas Santos" post_text="Estou aprendendo Tailwind CSS, muito bacana!" />
                    </div>
                    <div className="w-[50%]">
                        <Post user_name="Fernanda Costa" post_text="Pronto para o evento de amanhã!" />
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default User;
