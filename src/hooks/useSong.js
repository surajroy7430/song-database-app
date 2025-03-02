import { useEffect, useState } from "react";

const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getRandomPlayCount = () => Math.floor(Math.random() * (24625 - 5335 + 1)) + 5335;

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
    playCount: getRandomPlayCount(),
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
    },
  });

  const [singerInput, setSingerInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [typeInput, setTypeInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSong((prevSong) => ({
      ...prevSong,
      [name]: name === "released" ? Number(value.replace(/\D/g, "").slice(0, 4))
        : name === "playCount" ? Number(value.replace(/\D/g, ""))
          : (name === "title" || name === "album" || name === "writers") ? capitalizeWords(value)
            : value,
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
        lyrics: e.target.checked ? [""] : [],
      },
    }));
  };

  const handleLyricChange = (index, value) => {
    const updatedLyrics = [...song.lyricsData.lyrics];

    updatedLyrics[index] = value;

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
        lyrics: [...prevSong.lyricsData.lyrics, ""],
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

  const refreshPlayCount = () => {
    setSong((prevSong) => ({
      ...prevSong,
      playCount: getRandomPlayCount(),
    }));
  };

  useEffect(() => {
    const { title, language, singers, album, released, duration } = song;

    const newDescriptionData = {
      about: `About ${title}`,
      description: `Listen to ${title} online. 
        ${title} is a ${language} language song and is sung by ${singers.join(", ")}. 
        ${title}, from the album ${album}, was released in the year ${released}. 
        The duration of the song is ${duration}. Listen this song and enjoy.`,
    };

    setSong((prevSong) => {
      if (JSON.stringify(prevSong.descriptionData) === JSON.stringify(newDescriptionData)) {
        return prevSong; // Avoid unnecessary re-render
      }
      
      return {
        ...prevSong,
        descriptionData: newDescriptionData,
      }
      
    });
}, [song]);

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
  addLyricSection,
  removeLyricSection,
  handleLyricsKeyChange,
  getRandomPlayCount,
  refreshPlayCount,
};
};

export default useSong;
