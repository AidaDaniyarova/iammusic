import { useState } from 'react';
import api from '../api';

function AnnotatedLyrics({ lyrics }) {
  const [selectedLine, setSelectedLine] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLineClick = async (line) => {
    setSelectedLine(line);
    setLoading(true);
    setAnnotation('');

    try {
      const response = await api.post('annotate/', { line }); // endpoint для аннотации
      setAnnotation(response.data.annotation);
    } catch (err) {
      setAnnotation('Ошибка при получении аннотации.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {lyrics.split('\n').map((line, idx) => (
        <p
          key={idx}
          onClick={() => handleLineClick(line)}
          className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-300 transition px-2 py-1 rounded"
        >
          {line}
        </p>
      ))}

      {loading && <p className="text-sm text-gray-500 animate-pulse">Анализируем строку...</p>}

      {annotation && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
          <h4 className="font-semibold mb-2 text-[#0e8388]">Аннотация:</h4>
          <p className="text-sm">{annotation}</p>
        </div>
      )}
    </div>
  );
}
