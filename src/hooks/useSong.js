import { useState }  from "react";

const useSong = () => {
  const [song, setSong] = useState({
    title: "",
    singers: "",
    album: "",
    language: "",
    songUri: "",
    download: "",
    duration: "",
    released: "",
    images: [{ quality: "50x50", imageUrl: "" }],
    imageUri: "",
    genre: [],
    type: ["mp3"],
    copyright: "",
  });

  const [genreInput, setGenreInput] = useState("");
  const [typeInput, setTypeInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSong((prevSong) => ({
      ...prevSong,
      [name]: name === "released" ? Number(value) : value,
    }));
  };

  const handleImageChange = (index, e) => {
    const { name, value } = e.target;
    const updatedImages = [...song.images];
    updatedImages[index][name] = value;
    setSong({ ...song, images: updatedImages });
  };

  const addImageField = () => {
    setSong((prevSong) => ({
      ...prevSong,
      images: [...prevSong.images, { quality: "50x50", imageUrl: "" }],
    }));
  };

  const removeImageField = (index) => {
    if (song.images.length > 1) {
      const updatedImages = song.images.filter((_, i) => i !== index);
      setSong({ ...song, images: updatedImages });
    }
  };

  const addGenre = () => {
    if (genreInput && !song.genre.includes(genreInput)) {
      setSong((prevSong) => ({
        ...prevSong,
        genre: [...prevSong.genre, genreInput], // Push genre into array
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

  return {
    song,
    setSong,
    genreInput,
    setGenreInput,
    typeInput,
    setTypeInput,
    handleChange,
    handleImageChange,
    addImageField,
    removeImageField,
    addGenre,
    removeGenre,
    addSongType,
    removeSongType,
    handleDurationChange,
  };
};

export default useSong;
