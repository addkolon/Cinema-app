import React from "react";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#movies">Movies</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </header>
      <HeroSection />
    </div>
  );
}