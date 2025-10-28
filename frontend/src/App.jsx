import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import AddMovie from "./pages/admin/AddMovie";
import MovieList from "./pages/admin/MovieList";
import EditMovie from "./pages/admin/EditMovie";
import "./scss/App.scss";

export default function App() {
  return (
    <>
      <Header />
      <main>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/addMovie" element={<AddMovie />} />
            <Route path="/admin/movieList" element={<MovieList />} />
            <Route path="/admin/editMovie/:id" element={<EditMovie />} />
          </Routes>

      </main>  
    </>
  );
}
