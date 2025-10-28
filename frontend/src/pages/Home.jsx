import React from "react";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section className="content-section">
        <div className="content-wrapper">
          <h2>Welcome to Cinema App</h2>
          <p>
            Discover the latest movies and showtimes at your fingertips. Browse through our extensive collection of films, check out what's playing now, and plan your next movie night with ease.
          </p>
        </div>
      </section>
    </>
  );
}