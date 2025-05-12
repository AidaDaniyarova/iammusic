import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Albums() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('songs/')
      .then(res => setSongs(res.data))
      .catch(err => console.error("Ошибка загрузки песен:", err));
  }, []);

  const filteredSongs = songs.filter(song => {
    const query = search.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.album.title.toLowerCase().includes(query) ||
      song.album.artist.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container">
      <h2 className="text-2xl font-bold text-[#0e8388] mb-4">All Songs</h2>
      <input
        type="text"
        placeholder="Search by song title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />
      <ul>
        {filteredSongs.length > 0 ? (
          filteredSongs.map(song => (
            <li key={song.id}>
              <Link to={`/songs/${song.id}`} className="song-link">
                {song.title} ({song.album.artist.name}) - {song.album.title}
              </Link>
            </li>
          ))
        ) : (
            <div className="pt-5 px-4">
          <p className="animate-bounce">Loading...</p>
            </div>
        )}
      </ul>
    </div>
  );
}

export default Albums;
