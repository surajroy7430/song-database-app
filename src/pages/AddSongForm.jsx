import React from "react";
import { toast } from 'react-toastify';
import { db, collection, addDoc, getDoc, writeBatch, doc, arrayUnion } from "../firebase";
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
    handleToggleLyrics,
    handleLyricChange,
    addLyricSection,
    removeLyricSection,
    handleLyricsKeyChange,
    getRandomPlayCount,
    refreshPlayCount,
  } = useSong();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const batch = writeBatch(db);
      const languageCollections = {
        English: "english",
        Hindi: "hindi",
        Telugu: "telugu",
        Tamil: "tamil",
        Bengali: "bengali"
      }

      const collectionName = languageCollections[song.language];

      // Get today's date in DD-MMM-YYYY format
      const today = new Date();
      const formattedDate = today.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).replace(/(\d{2}) (\w{3}) (\d{4})/, "$1 $2, $3");

      const docRef = await addDoc(
        collection(db, collectionName),
        song
      );
      const songWithId = { ...song, id: docRef.id };
      batch.update(docRef, { id: docRef.id });
      batch.update(docRef, { dateCreated: formattedDate });

      // Add to Albums collection if the album already exists
      if (song.album) {
        const albumRef = doc(db, "albums", song.album);
        const albumSnapshot = await getDoc(albumRef);

        let songCount = albumSnapshot.exists() && albumSnapshot.data().results ?
          albumSnapshot.data().results.length + 1 : 1;

        const songText = songCount === 1 ? "song" : "songs";

        const allSingers = new Set(song.singers);
        if (albumSnapshot.exists() && albumSnapshot.data().results) {
          albumSnapshot.data().results.forEach(songItem => {
            songItem.singers.forEach(singer => allSingers.add(singer));
          });
        }

        // Convert Set to array and pick 3 random singers
        const allSingersArray = Array.from(allSingers);
        const uniqueSingers = allSingersArray.sort(() => 0.5 - Math.random()).slice(0, 3);
        const singerList = uniqueSingers.join(", "); // Get first 3 singers
        const otherSingers = allSingersArray.length > 3 ? " and more" : ""; // If more than 3 singers

        const albumDescription = {
          about: `About ${song.album}`,
          description:
            `${song.album} is a ${song.language} album released in ${song.released}. 
          There are a total of ${songCount} ${songText} in ${song.album}. 
          The songs were composed by talented musicians such as ${singerList}${otherSingers}.
          Listen to all of ${song.album} songs online.`,
        };

        batch.set(albumRef, {
          results: arrayUnion({ ...songWithId, dateCreated: formattedDate }),
          descriptionData: albumDescription
        }, { merge: true });
      }

      for (const singer of song.singers) {
        const singerRef = doc(db, "singers", singer);
        batch.set(singerRef, {
          results: arrayUnion({ ...songWithId, dateCreated: formattedDate })
        },
          { merge: true });
      }

      for (const gen of song.genre) {
        const genreRef = doc(db, "genre", gen);
        batch.set(genreRef, {
          results: arrayUnion({ ...songWithId, dateCreated: formattedDate })
        },
          { merge: true });
      }

      await batch.commit();

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
        }
      });

    } catch (e) {
      toast.error("Error adding document");
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="container min-vh-100 py-5">
      <form onSubmit={handleSubmit} className="p-4" autoComplete="off">
        <h1 className="text-center text-uppercase mb-4 fw-bold">ADD A SONG</h1>

        <hr />

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title<span style={{ color: "#e55f5f" }}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={song.title}
            onChange={handleChange}
            className="form-control capitalize"
            placeholder="Enter Song Name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="singers" className="form-label">
            Artists<span style={{ color: "#e55f5f" }}>*</span>
          </label>
          <div className="input-group mb-2">
            <button
              type="button"
              className="btn btn-secondary input-group-text custom-tooltip"
              onClick={addSinger}
            >
              Add
            </button>

            <input
              type="text"
              id="singers"
              name="singers"
              value={singerInput}
              onChange={(e) => setSingerInput(e.target.value)}
              className="form-control capitalize"
              placeholder="Enter Artists Names"
            />
          </div>

          {song.singers.length === 0 ? "" :
            <div className="table-container">
              <table className="table table-bordered border-secondary table-hover text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Artist Names</th>
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
          <label htmlFor="album" className="form-label">
            Album Name<span style={{ color: "#e55f5f" }}>*</span>
          </label>
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
          <label htmlFor="language" className="form-label">
            Select Language<span style={{ color: "#e55f5f" }}>*</span>
          </label>
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
          <label htmlFor="songUri" className="form-label">
            Song URL<span style={{ color: "#e55f5f" }}>*</span>
          </label>
          <input
            type="text"
            id="songUri"
            name="songUri"
            value={song.songUri}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Song Url"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="download" className="form-label">
            Download Link
          </label>
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
          <label htmlFor="duration" className="form-label">
            Duration<span style={{ color: "#e55f5f" }}>*</span>
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={song.duration}
            onChange={handleDurationChange}
            className="form-control"
            maxLength="5" // Limit to 5 characters: "MM:SS"
            placeholder="MM:SS"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="released" className="form-label">
            Released Year<span style={{ color: "#e55f5f" }}>*</span>
          </label>
          <input
            type="number"
            id="released"
            name="released"
            value={song.released}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Released year"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imageUri" className="form-label">
            Image URI<span style={{ color: "#e55f5f" }}>*</span>
          </label>
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
          <label htmlFor="playCount" className="form-label">Play Count</label>
          <div className="input-group mb-2">
            <button
              type="button"
              className="btn btn-secondary input-group-text custom-tooltip"
              onClick={refreshPlayCount}
            >
              <i className="bi bi-arrow-clockwise"></i>
              <span className="tooltip-text">Refresh</span>
            </button>
            <input
              type="number"
              id="playCount"
              name="playCount"
              value={song.playCount}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Play Count"
            />
          </div>
        </div>


        <div className="mb-3">
          <label htmlFor="genre" className="form-label">
            Genre<span style={{ color: "#e55f5f" }}>*</span>
          </label>
          <div className="input-group mb-2">
            <button
              type="button"
              className="btn btn-secondary input-group-text"
              onClick={addGenre}
            >
              Add
            </button>
            <input
              type="text"
              id="genre"
              name="genre"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              className="form-control capitalize"
              placeholder="Pop, Rock, Electronic, Bollywood, Classical, Hip-Hop, Jazz, R&B"
            />
          </div>

          {song.genre.length === 0 ? "" :
            <div className="table-container">
              <table className="table table-bordered border-secondary table-hover text-center">
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
          <label htmlFor="type" className="form-label">
            Song Type<span style={{ color: "#e55f5f" }}>*</span>
          </label>
          <div className="input-group mb-2">
            <button
              type="button"
              className="btn btn-secondary input-group-text"
              onClick={addSongType}
            >
              Add
            </button>
            <input
              type="text"
              id="type"
              name="type"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              className="form-control"
              placeholder="mp3, wav, flac, aac, ogg"
            />
          </div>

          {song.type.length === 0 ? "" :
            <div className="table-container">
              <table className="table table-bordered border-secondary table-hover text-center">
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
              onChange={handleToggleLyrics}
            />
            <label className="form-check-label fw-bold" htmlFor="lyricsToggle">
              SONG HAS LYRICS?
            </label>
          </div>

          {song.lyricsData.hasLyrics && (
            <>
              <div className="mb-3">
                <label htmlFor="lyrics" className="form-label" style={{ marginTop: "10px", marginRight: "10px" }}>
                  Lyrics
                </label>
                <br />
                {song.lyricsData.lyrics.map((section, index) => (
                  <div key={index} className="input-group mb-2">
                    <button
                      type="button"
                      className="btn btn-danger input-group-text"
                      onClick={() => removeLyricSection(index)}
                    >
                      Remove
                    </button>
                    <textarea
                      id="lyrics"
                      value={section}
                      className="form-control"
                      onChange={(e) => handleLyricChange(index, e.target.value)}
                      rows="4"
                    />
                  </div>
                ))}
                <button type="button" className="btn btn-success" onClick={addLyricSection}>
                  + Add new section
                </button>
              </div>

              <div className="mb-3">
                <label htmlFor="writers" className="form-label">Writer(s)</label>
                <input
                  type="text"
                  id="writers"
                  name="writers"
                  value={song.lyricsData?.writers || ""}
                  onChange={handleLyricsKeyChange}
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
                  list="poweredByOptions"
                  value={song.lyricsData?.poweredBy || ""}
                  onChange={handleLyricsKeyChange}
                  className="form-control"
                  placeholder="Enter URL"
                  autoComplete="on"
                />
                <datalist id="poweredByOptions">
                  <option value="https://www.musixmatch.com" />
                </datalist>
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
