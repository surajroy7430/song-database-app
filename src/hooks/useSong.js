import { useEffect, useState } from "react";

const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const useSong = () => {
  const [song, setSong] = useState({
    title: "",
    singers: [],
    album: "",
    language: "",
    songUri: "",
    download: "",
    duration: "",
    released: "",
    imageUri: "",
    playCount: "",
    genre: [],
    type: ["mp3"],
    copyright: "",
    lyricsData: {
      hasLyrics: false,
      lyrics: [],
      writers: "",
      poweredBy: "",
    },
    descriptionData: {
      about: "",
      description: "",
    }
  });

  const [singerInput, setSingerInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [typeInput, setTypeInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSong((prevSong) => ({
      ...prevSong,
      [name]: name === "released" ? Number(value.replace(/\D/g, "").slice(0, 4)) : 
              name === "playCount" ? Number(value.replace(/\D/g, "")) : 
              name === "album" ? capitalizeWords(value) : 
              name === "writers" ? capitalizeWords(value) : 
              value,
    }));
  };

  const addSinger = () => {
    if (singerInput && !song.singers.includes(capitalizeWords(singerInput))) {
      setSong((prevSong) => ({
        ...prevSong,
        singers: [...prevSong.singers, capitalizeWords(singerInput)], // Push singers into array
      }));
      setSingerInput("");
    }
  };

  const removeSinger = (index) => {
    const updatedSingers = song.singers.filter((_, i) => i !== index);
    setSong({ ...song, singers: updatedSingers });
  };

  const addGenre = () => {
    if (genreInput && !song.genre.includes(capitalizeWords(genreInput))) {
      setSong((prevSong) => ({
        ...prevSong,
        genre: [...prevSong.genre, capitalizeWords(genreInput)], // Push genre into array
      }));
      setGenreInput("");
    }
  };

  const removeGenre = (index) => {
    const updatedGenres = song.genre.filter((_, i) => i !== index);
    setSong({ ...song, genre: updatedGenres });
  };

  const addSongType = () => {
    if (typeInput && !song.type.includes(typeInput)) {
      setSong((prevSong) => ({
        ...prevSong,
        type: [...prevSong.type, typeInput], // Push type into array
      }));
      setTypeInput("");
    }
  };

  const removeSongType = (index) => {
    const updatedTypes = song.type.filter((_, i) => i !== index);
    setSong({ ...song, type: updatedTypes });
  };

  const handleDurationChange = (e) => {
    let value = e.target.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, "");

    // Limit the length of the value (4 characters max: 2 for minutes, 2 for seconds)
    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    // Format the input as MM:SS
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}:${value.substring(2, 4)}`;
    }

    setSong((prevSong) => ({
      ...prevSong,
      duration: value,
    }));
  };

  // Lyrics handling
  const handleToggleLyrics = (e) => {
    setSong((prevSong) => ({
      ...prevSong,

      lyricsData: {
        ...prevSong.lyricsData,
        hasLyrics: e.target.checked,
        lyrics: e.target.checked ? [{ melody: "verse", lyricsText: [""] }] : [],
      },
    }));
  };

  const handleLyricChange = (index, value) => {
    const updatedLyrics = [...song.lyricsData.lyrics];

    updatedLyrics[index].lyricsText = value.split("\n");

    setSong((prevSong) => ({
      ...prevSong,
      lyricsData: { ...prevSong.lyricsData, lyrics: updatedLyrics },
    }));
  };

  const handleLyricTypeChange = (index, value) => {
    const updatedLyrics = [...song.lyricsData.lyrics];

    updatedLyrics[index].melody = value;

    setSong((prevSong) => ({
      ...prevSong,
      lyricsData: { ...prevSong.lyricsData, lyrics: updatedLyrics },
    }));
  };

  const addLyricSection = () => {
    setSong((prevSong) => ({
      ...prevSong,
      lyricsData: {
        ...prevSong.lyricsData,
        lyrics: [
          ...prevSong.lyricsData.lyrics,
          { melody: "verse", lyricsText: [""] },
        ],
      },
    }));
  };

  const removeLyricSection = (index) => {
    const updatedLyrics = song.lyricsData.lyrics.filter((_, i) => i !== index);
    setSong((prevSong) => ({
      ...prevSong,
      lyricsData: { ...prevSong.lyricsData, lyrics: updatedLyrics },
    }));
  };

  const handleLyricsKeyChange = (e) => {
    const { name, value } = e.target;

    setSong((prevSong) => ({
      ...prevSong,
      lyricsData: {
        ...prevSong.lyricsData,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    const { title, language, singers, album, released, duration } = song;

    setSong((prevSong) => ({
      ...prevSong,
      descriptionData: {
        about: `About ${title}`,
        description: 
        `Listen to ${title} online. 
        ${title} is a ${language} language song and is sung by ${singers.join(', ')}. 
        ${title}, from the album ${album}, was released in the year ${released}. 
        The duration of the song is ${duration}. Download this song and enjoy.`,
      },
    }));
  }, [song]);

  // Auto-increment playCount every day (AFTER adding to the database)
  useEffect(() => {
    if (typeof song.playCount === "number" && song.playCount >= 0) {
      const updatePlayCount = () => {
        setSong((prevSong) => ({
          ...prevSong,
          playCount: prevSong.playCount + 1,
        }));
      };

      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const initialDelay = midnight - now;

      const firstTimeout = setTimeout(() => {
        updatePlayCount();
        setInterval(updatePlayCount, 24 * 60 * 60 * 1000);
      }, initialDelay);

      return () => clearTimeout(firstTimeout);
    }
  }, [song.playCount]);

  return {
    song,
    setSong,
    singerInput,
    setSingerInput,
    addSinger,
    removeSinger,
    genreInput,
    setGenreInput,
    typeInput,
    setTypeInput,
    handleChange,
    addGenre,
    removeGenre,
    addSongType,
    removeSongType,
    handleDurationChange,
    handleToggleLyrics,
    handleLyricChange,
    handleLyricTypeChange,
    addLyricSection,
    removeLyricSection,
    handleLyricsKeyChange,
  };
};

export default useSong;
