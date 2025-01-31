import React from "react";
import { toast } from 'react-toastify';
import { db, collection, addDoc, updateDoc, doc, getDoc, setDoc, arrayUnion } from "../firebase";
import useSong from "../hooks/useSong";

const AddSongForm = () => {
  const {
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
    toggleHasLyrics,
    handleLyricsChange,
  } = useSong();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const languageCollections = {
        English: "english",
        Hindi: "hindi",
        Telugu: "telugu",
        Tamil: "tamil",
        Bengali: "bengali"
      }

      const collectionName = languageCollections[song.language]

      const docRef = await addDoc(
        collection(db, collectionName),
        song
      );
      const songWithId = { ...song, id: docRef.id };
      await updateDoc(docRef, { id: docRef.id });

      // Add to Albums collection if the album already exists
      if (song.album) {
        const albumRef = doc(db, "albums", song.album);
        const albumDoc = await getDoc(albumRef);
        if (albumDoc.exists()) {
          // If the album exists, update the results array with the new song
          await updateDoc(albumRef, {
            results: arrayUnion({ ...songWithId }),
          });
        } else {
          // If the album doesn't exist, create a new album entry with the song
          await setDoc(albumRef, {
            results: [{ ...songWithId }],
          });
        }
      }

      // Add to Singers collection if the singer(s) already exist
      if (song.singers.length > 0) {
        for (const singer of song.singers) {
          const singerRef = doc(db, "singers", singer);
          const singerDoc = await getDoc(singerRef);
          if (singerDoc.exists()) {
            // If the singer exists, update the results array with the new song
            await updateDoc(singerRef, {
              results: arrayUnion({ ...songWithId }),
            });
          } else {
            // If the singer doesn't exist, create a new singer entry with the song
            await setDoc(singerRef, {
              results: [{ ...songWithId }],
            });
          }
        }
      }

      toast.success(`${song.title} added in ${song.language}`);
      console.log(`${song.title} - song added with ID: ${docRef.id}`);

      setSong({
        title: "",
        singers: [],
        album: "",
        language: "",
        songUri: "",
        download: "",
        duration: "",
        released: "",
        imageUri: "",
        genre: [],
        type: ["mp3"],
        copyright: "",
        lyricsData: {
          hasLyrics: false,
          lyrics: "",
          writers: "",
          poweredBy: "",
        },
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
          <div className="d-flex mb-2">
            <input
              type="text"
              id="singers"
              name="singers"
              value={singerInput}
              onChange={(e) => setSingerInput(e.target.value)}
              className="form-control me-2 capitalize"
              placeholder="Enter Singer Names (required)"
            />
            <button type="button" className="btn btn-success" onClick={addSinger}>
              Add
            </button>
          </div>

          {song.singers.length === 0 ? "" :
            <div className="table-container">
              <table className="table table-bordered border-secondary table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Singer Names</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {song.singers.map((sing, index) => (
                    <tr key={index}>
                      <td className="align-middle">{sing}</td>
                      <td className="align-middle">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeSinger(index)}
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
          <label htmlFor="album" className="form-label">Album Name</label>
          <input
            type="text"
            id="album"
            name="album"
            value={song.album}
            onChange={handleChange}
            className="form-control capitalize"
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
            <option value="Telugu">Telugu</option>
            <option value="Tamil">Tamil</option>
            <option value="Bengali">Bengali</option>
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
          <label htmlFor="imageUri" className="form-label">Image URI</label>
          <input
            type="text"
            id="imageUri"
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
              className="form-control me-2 capitalize"
              placeholder="Pop, Rock, Electronic, Bollywood, Classical, Hip-Hop, Jazz, R&B"
            />
            <button type="button" className="btn btn-success" onClick={addGenre}>
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
            <button type="button" className="btn btn-success" onClick={addSongType}>
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

        {/* Lyrics Section */}
        <div className="mb-3">
          <div className="form-check mb-2">
            <input
              type="checkbox"
              id="lyricsToggle"
              className="form-check-input"
              checked={song.lyricsData.hasLyrics}
              onChange={toggleHasLyrics}
            />
            <label className="form-check-label" htmlFor="lyricsToggle">
              Song has lyrics?
            </label>
          </div>

          {song.lyricsData.hasLyrics && (
            <>

              <div className="mb-3">
                <label htmlFor="lyrics" className="form-label">Song Lyrics</label>
                <textarea
                  id="lyrics"
                  name="lyrics"
                  value={song.lyricsData.lyrics}
                  onChange={handleLyricsChange}
                  className="form-control"
                  placeholder="Enter lyrics here"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="writers" className="form-label">Writer(s)</label>
                <input
                  type="text"
                  id="writers"
                  name="writers"
                  value={song.lyricsData.writers}
                  onChange={handleLyricsChange}
                  className="form-control capitalize"
                  placeholder="Enter Writer Names"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="poweredBy" className="form-label">Lyrics Powered By (URL)</label>
                <input
                  type="url"
                  id="poweredBy"
                  name="poweredBy"
                  value={song.lyricsData.poweredBy}
                  onChange={handleLyricsChange}
                  className="form-control"
                  placeholder="Enter URL (eg. https://www.musixmatch.com/)"
                />
              </div>

            </>
          )}
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
