import { useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery() {
  const videoRefs = useRef([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gallery`
        );

        const data = await response.json();

        if (response.ok) {
          setGallery(data);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const eventPhotos = gallery
    .filter((item) => item.category === "events")
    .sort((a, b) => a.order - b.order);

  const djPhotos = gallery
    .filter((item) => item.category === "dj")
    .sort((a, b) => a.order - b.order);

  const videos = gallery
    .filter((item) => item.category === "live")
    .sort((a, b) => a.order - b.order);

  const handleVideoPlay = (currentIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
      }
    });
  };

  return (
    <section className="gallery-page">

      {/* Gallery Header */}
      <div className="gallery-header">
        <h1>GALLERY</h1>
        <p>A look at the celebrations we’ve been part of.</p>
      </div>

      {/* Events & Setups */}
      <div className="gallery-section">
        <h2>EVENTS &amp; SETUPS</h2>
        <p>Great music. Great setups. Great celebrations.</p>

        <div className="gallery-grid">
          {eventPhotos.map((item) => (
            item.mediaType === "video" ? (
              <video
                key={item._id}
                src={item.mediaUrl}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                key={item._id}
                src={item.mediaUrl}
                alt="Event moment"
              />
            )
          ))}
        </div>
      </div>

      {/* DJ Vipul */}
      <div className="gallery-section">
        <h2>DJ VIPUL</h2>
        <p>Behind the console, behind the energy.</p>

        <div className="gallery-grid">
          {djPhotos.map((item) => (
            item.mediaType === "video" ? (
              <video
                key={item._id}
                src={item.mediaUrl}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                key={item._id}
                src={item.mediaUrl}
                alt="DJ Vipul"
              />
            )
          ))}
        </div>
      </div>

      {/* Live Moments */}
      <div className="gallery-section live-moments">
        <h2>LIVE MOMENTS</h2>
        <p>Turn up the volume. Feel the moment.</p>

        <div className="video-grid">
          {videos.map((item, index) => (
            <div
              className="video-card"
              key={item._id}
            >
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                src={item.mediaUrl}
                controls
                playsInline
                preload="metadata"
                onPlay={() =>
                  handleVideoPlay(index)
                }
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Gallery;