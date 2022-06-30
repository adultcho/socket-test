import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "./components/Main";
import Video from "./components/Video";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/video" element={<Video />}></Route>
    </Routes>
  );
};

export default App;
