import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import api from "../api";

function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [loadingLine, setLoadingLine] = useState(null);
  const [task, setTask] = useState("analysis");

  const analysisOptions = [
    { value: "summary", label: "Summary" },
    { value: "mood", label: "Emotional tone" },
    { value: "analysis", label: "General analysis" },
    { value: "deep_analysis", label: "Deep analysis" },
  ];

  useEffect(() => {
    api
      .get(`songs/${id}/`)
      .then((res) => setSong(res.data))
      .catch((err) => console.error("Error loading song:", err));
  }, [id]);

  const handleLineClick = async (line, index) => {
    if (annotations[index]?.[task]) return;

    setLoadingLine(index);
    try {
      const response = await fetch(
        `https://iammusic.onrender.com/api/generate_annotation/?song_line=${encodeURIComponent(
          line
        )}&song_id=${id}&task=${task}`
      );
      const data = await response.json();

      setAnnotations((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [task]: data.annotation || { raw_output: "No data." },
        },
      }));
    } catch (err) {
      console.error("Error fetching annotation:", err);
      setAnnotations((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [task]: { raw_output: "Error while analyzing." },
        },
      }));
    }
    setLoadingLine(null);
  };

  if (!song)
    return (
      <div className="container">
        <div className="pt-5 px-4">
          <p className="animate-bounce">Loading...</p>
        </div>
      </div>
    );

  const lines = song.lyrics.split("\n");

  return (
    <div className="container max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column */}
        <div className="md:w-1/3 bg-[#f5f5f5] p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-[#306464] dark:text-[#fdb034] mb-2">
            Album
          </h3>
          <p>
            <strong>Title:</strong> {song.album.title}
          </p>
          <p>
            <strong>Release Year:</strong> {song.album.release_year}
          </p>

          <h3 className="text-xl font-semibold text-[#306464] dark:text-[#fdb034] mt-6 mb-2">
            Artist
          </h3>
          <p>{song.album.artist.name}</p>

          {/* Task selection with Headless UI Listbox */}
          <div className="mt-6">
            <Listbox value={task} onChange={setTask}>
              <div className="relative">
                <Listbox.Label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Analysis type:
                </Listbox.Label>

                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0e8388] sm:text-sm">
                  <span>
                    {analysisOptions.find((opt) => opt.value === task)?.label}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                    {analysisOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 rounded-md ${
                            active
                              ? "bg-[#0e8388]/20 text-[#0e8388]"
                              : "text-gray-900 dark:text-gray-100"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {option.label}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Check className="h-4 w-4 text-[#0e8388]" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>

        {/* Right column */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-[#0e8388] mb-4">
            {song.title}
          </h2>
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
                  <p className="text-sm text-gray-500 animate-pulse">
                    Analyzing...
                  </p>
                )}

                {/* Display annotations */}
                {annotations[index]?.[task] && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 italic space-y-1">
                    {task === "summary" && (
                      <p>💬 {annotations[index][task].summary}</p>
                    )}
                    {task === "mood" && (
                      <>
                        <p>
                          🎭 Emotional tone:{" "}
                          {annotations[index][task].emotional_tone}
                        </p>
                        <p>{annotations[index][task].mood_description}</p>
                      </>
                    )}
                    {task === "analysis" && (
                      <>
                        <p>
                          📌 Literal meaning:{" "}
                          {annotations[index][task].literal_meaning}
                        </p>
                        <p>
                          🎭 Emotional tone:{" "}
                          {annotations[index][task].emotional_tone}
                        </p>
                        <p>
                          🔗 Theme connection:{" "}
                          {annotations[index][task].theme_connection}
                        </p>
                        <p>🔄 Alternative interpretations:</p>
                        <ul className="list-disc ml-6">
                          {annotations[index][task].alternative_interpretations?.map(
                            (alt, i) => (
                              <li key={i}>{alt}</li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                    {task === "deep_analysis" && (
                      <>
                        <p>
                          📌 Literal meaning:{" "}
                          {annotations[index][task].literal_meaning}
                        </p>
                        <p>
                          🎭 Emotional tone:{" "}
                          {annotations[index][task].emotional_tone}
                        </p>
                        <p>
                          📚 Cultural reference:{" "}
                          {annotations[index][task].cultural_reference || "—"}
                        </p>
                        <p>
                          🔗 Theme connection:{" "}
                          {annotations[index][task].theme_connection}
                        </p>
                        <p>🔄 Alternative interpretations:</p>
                        <ul className="list-disc ml-6">
                          {annotations[index][task].alternative_interpretations?.map(
                            (alt, i) => (
                              <li key={i}>{alt}</li>
                            )
                          )}
                        </ul>
                      </>
                    )}
                  </div>
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
