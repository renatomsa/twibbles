import { useState } from "react";

interface CreatePostProps {
  userName: string;
  onPostSubmit: (text: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ userName, onPostSubmit }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      setError("O post não pode estar vazio.");
      return;
    }

    if (trimmedText.length > 400) {
      setError("O post não pode ter mais de 400 caracteres.");
      return;
    }

    setError("");
    onPostSubmit(trimmedText);
    setText("");
  };

  const isPostButtonDisabled = text.trim().length === 0 || text.trim().length > 400;

  return (
    <div className="p-3 bg-gray-700/80 rounded-lg scale-95">
      <div className="text-gray-100 m-3 font-bold">
        <h1 className="text-2xl">{userName}</h1>
      </div>
      <div className="p-0.5 my-4 mr-0.5 border-solid border-r-2 bg-gray-900 rounded-lg"></div>
      <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva seu post..."
        rows={5}
        style={{ width: "100%", resize: "none" }}
        className="bg-gray-500/30 text-gray-100 font-bold p-4 rounded-lg"  // Aumentei o valor de p-2 para p-4
      />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="submit"
          className={`mt-2 bg-blue-500 text-white px-4 py-2 rounded ${isPostButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isPostButtonDisabled}
        >
          Postar
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
