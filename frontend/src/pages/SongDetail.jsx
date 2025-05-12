import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [loadingLine, setLoadingLine] = useState(null);

  const HF_API_KEY = 'YOUR_HUGGINGFACE_API_KEY'; // 👈 вставьте ваш токен сюда

  useEffect(() => {
    api.get(`songs/${id}/`)
      .then(res => setSong(res.data))
      .catch(err => console.error("Ошибка загрузки песни:", err));
  }, [id]);

  const handleLineClick = async (line, index) => {
  if (annotations[index]) return;

  setLoadingLine(index);
  const response = await fetch(`http://localhost:8000/api/generate_annotation/?song_line=${encodeURIComponent(line)}`)
;
const text = await response.text();
try {
  const data = JSON.parse(text);
  const explanation = data.annotation || "No explanation.";
  setAnnotations(prev => ({ ...prev, [index]: explanation }));
} catch (err) {
  console.error("Failed to parse JSON. Response:", text);
  setAnnotations(prev => ({ ...prev, [index]: "Ошибка при получении аннотации." }));
}

  setLoadingLine(null);
};


  if (!song) return <div className="container"><div className="pt-5 px-4"><p className="animate-bounce">Loading...</p></div></div>;

  const lines = song.lyrics.split('\n');

  return (
    <div className="container max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Левая колонка */}
        <div className="md:w-1/3 bg-[#f5f5f5] p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-[#306464] mb-2">Album</h3>
          <p><strong>Title:</strong> {song.album.title}</p>
          <p><strong>Release Year:</strong> {song.album.release_year}</p>

          <h3 className="text-xl font-semibold text-[#306464] mt-6 mb-2">Artist</h3>
          <p>{song.album.artist.name}</p>
        </div>

        {/* Правая колонка */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-[#0e8388] mb-4">{song.title}</h2>
          <h4 className="text-lg font-semibold text-[#fdb034] mb-2">Lyrics</h4>
          <div className="space-y-4">
            {lines.map((line, index) => (
              <div key={index}>
                <p
                  className="cursor-pointer hover:text-[#306464] transition"
                  onClick={() => handleLineClick(line, index)}
                >
                  {line}
                </p>
                {loadingLine === index && (
                  <p className="text-sm text-gray-500 animate-pulse">Идет анализ...</p>
                )}
                {annotations[index] && (
                  <p className="text-sm text-gray-700 mt-1 italic">💬 {annotations[index]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongDetail;
