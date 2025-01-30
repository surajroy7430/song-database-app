import React, { useState } from "react";
import { toast } from 'react-toastify';
import { db, collection, addDoc, updateDoc } from "../firebase/firebase-config";

const AddSongForm = () => {
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

    // Format the input as mm:ss
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}:${value.substring(2, 4)}`;
    }

    setSong((prevSong) => ({
      ...prevSong,
      duration: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(
        collection(db, song.language === "English" ? "english" : "hindi"),
        song
      );
      await updateDoc(docRef, { id: docRef.id });

      toast.success(`${song.title} added successfully`);
      console.log(`${song.title} - song added with ID: ${docRef.id}`);

      setSong({
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

    } catch (e) {
      toast.error("Error adding document");
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="p-4 border shadow-sm rounded">
        <h1 className="d-flex justify-content-center mb-4 fw-bold">ADD A SONG</h1>
        
        <hr></hr>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={song.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Song Name (required)"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="singers" className="form-label">Singers</label>
          <input
            type="text"
            id="singers"
            name="singers"
            value={song.singers}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Singer Names (required)"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="album" className="form-label">Album Name</label>
          <input
            type="text"
            id="album"
            name="album"
            value={song.album}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Album Name"
          // required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="language" className="form-label">Language</label>
          <select
            id="language"
            name="language"
            value={song.language}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="" disabled>Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="songUri" className="form-label">Song URL</label>
          <input
            type="text"
            id="songUri"
            name="songUri"
            value={song.songUri}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Song Url (required)"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="download" className="form-label">Download Link</label>
          <input
            type="text"
            id="download"
            name="download"
            value={song.download}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Download Link"
          // required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={song.duration}
            onChange={handleDurationChange}
            className="form-control"
            maxLength="5" // Limit to 5 characters: "MM:SS"
            placeholder="MM:SS (required)"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="released" className="form-label">Released Year</label>
          <input
            type="number"
            id="released"
            name="released"
            value={song.released}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Released year (required)"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          {song.images.map((img, index) => (
            <div key={index} className="d-flex mb-2">
              <select
                name="quality"
                value={img.quality}
                onChange={(e) => handleImageChange(index, e)}
                className="form-select me-2"
              >
                <option value="" disabled>Image Quality</option>
                <option value="50x50">50x50</option>
                <option value="150x150">150x150</option>
                <option value="500x500">500x500</option>
              </select>
              <input
                type="text"
                name="imageUrl"
                value={img.imageUrl}
                onChange={(e) => handleImageChange(index, e)}
                placeholder="Image URL"
                className="form-control me-2"
              />
              {index > 0 && (
                <button type="button" className="btn btn-danger" onClick={() => removeImageField(index)}>
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={addImageField}
          >
            + Add More
          </button>
        </div>

        <div className="mb-3">
          <label htmlFor="imageUri" className="form-label">Image URI</label>
          <input
            type="text"
            name="imageUri"
            value={song.imageUri}
            onChange={handleChange}
            placeholder="Image URI"
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre</label>
          <div className="d-flex mb-2">
            <input
              type="text"
              id="genre"
              name="genre"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              className="form-control me-2"
              placeholder="Pop, Rock, Electronic, Bollywood, Classical, Hip-Hop, Jazz, R&B"
            />
            <button type="button" className="btn btn-secondary" onClick={addGenre}>
              Add
            </button>
          </div>

          {song.genre.length === 0 ? "" :
            <div className="table-container">
              <table className="table table-bordered border-secondary table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Genre</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {song.genre.map((gen, index) => (
                    <tr key={index}>
                      <td className="align-middle">{gen}</td>
                      <td className="align-middle">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeGenre(index)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="form-label">Song Type</label>
          <div className="d-flex mb-2">
            <input
              type="text"
              id="type"
              name="type"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              className="form-control me-2"
              placeholder="mp3, wav, flac, aac, ogg"
            />
            <button type="button" className="btn btn-secondary" onClick={addSongType}>
              Add
            </button>
          </div>

          {song.type.length === 0 ? "" :
            <div className="table-container">
              <table className="table table-bordered border-secondary table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {song.type.map((typ, index) => (
                    <tr key={index}>
                      <td className="align-middle">{typ}</td>
                      <td className="align-middle">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeSongType(index)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>

        <div className="mb-3">
          <label htmlFor="copyright" className="form-label">Copyright</label>
          <input
            type="text"
            id="copyright"
            name="copyright"
            value={song.copyright}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Copyright"
          // required
          />
        </div>

        <div className="d-flex justify-content-center mt-5">
          <button
            type="submit"
            className="btn btn-primary w-50"
            style={{ height: "50px", fontSize: "1.2rem" }}
          >
            ADD SONG
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSongForm;
