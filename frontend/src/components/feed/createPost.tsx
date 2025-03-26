import { useState } from "react";
import { MapPin, Hash } from "lucide-react";

interface CreatePostProps {
  userName: string;
  onPostSubmit: (text: string, location: string, hashtags: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ userName, onPostSubmit }) => {
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [error, setError] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

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
    onPostSubmit(trimmedText, location.trim(), hashtags.trim());
    setText("");
    setLocation("");
    setHashtags("");
    setShowOptionalFields(false);
  };

  const isPostButtonDisabled = text.trim().length === 0 || text.trim().length > 400;

  return (
    <div className="bg-white rounded-md p-4 shadow-md">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{userName}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva seu post..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-cyan-900"
        />

        {!showOptionalFields ? (
          <button
            type="button"
            onClick={() => setShowOptionalFields(true)}
            className="text-cyan-700 text-sm hover:underline flex items-center"
          >
            + Add location and hashtags
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-900"
              />
            </div>

            <div className="flex items-center">
              <Hash size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="Add hashtags (separate with spaces)"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-900"
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-cyan-900 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition-colors ${isPostButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isPostButtonDisabled}
          >
            Postar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
