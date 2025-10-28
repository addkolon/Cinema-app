import { useState, useEffect, useRef, useCallback } from "react";

export function useCarousel({
  apiBase,
  endpoint,
  mapResponseToSlides,
  timeRunning = 3000,
}) {
  const [slides, setSlides] = useState([]);
  const [animating, setAnimating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const animTimeoutRef = useRef(null);
  const cache = useRef(new Map());

  const stableMapper = useCallback(mapResponseToSlides, []);

  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = apiBase + endpoint;

    if (cache.current.has(cacheKey)) {
      setSlides(cache.current.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(cacheKey, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // FIXED: Don't modify URLs - they're already complete from backend
        const slides = stableMapper(data);
        cache.current.set(cacheKey, slides);
        setSlides(slides);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [apiBase, endpoint, stableMapper]);

  const rotate = (direction) => {
    if (slides.length <= 1) return;
    setSlides((prev) =>
      direction === "next"
        ? [...prev.slice(1), prev[0]]
        : [prev[prev.length - 1], ...prev.slice(0, -1)]
    );
    setAnimating(direction);

    clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => setAnimating(null), timeRunning);
  };

  const handleNext = () => rotate("next");
  const handlePrev = () => rotate("prev");

  useEffect(() => {
    return () => {
      clearTimeout(animTimeoutRef.current);
    };
  }, []);

  return { slides, animating, loading, error, handleNext, handlePrev };
}