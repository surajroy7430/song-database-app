import React from "react";
import { ToastContainer } from "react-toastify";
import AddSongForm from "./pages/AddSongForm";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="dark"
      />
      <AddSongForm />
    </div>
  );
}

export default App;
