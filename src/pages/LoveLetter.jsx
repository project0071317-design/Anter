import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import birthdayVideo from '../assets/video.mp4';
import '../LoveLetter.css';

const LoveLetter = () => {
    const [openEnvelope, setOpenEnvelope] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);

    // Auto-play with audio when envelope opens
    useEffect(() => {
        if (openEnvelope && videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
            }).catch(() => {
                // If browser autoplay policy blocks unmuted audio on start, fallback to muted autoplay
                if (videoRef.current) {
                    videoRef.current.muted = true;
                    videoRef.current.play().catch(() => {});
                    setIsPlaying(true);
                    setIsMuted(true);
                }
            });
        }
    }, [openEnvelope]);

    // Play / Pause toggle
    const togglePlayPause = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch(() => {});
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    // Mute / Unmute toggle
    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            const nextMuted = !videoRef.current.muted;
            videoRef.current.muted = nextMuted;
            setIsMuted(nextMuted);
            if (!nextMuted && videoRef.current.paused) {
                videoRef.current.play().catch(() => {});
                setIsPlaying(true);
            }
        }
    };

    const handleOpen = () => {
        setOpenEnvelope(true);
    };

    return (
        <main className='munna bg-[#8b0000] h-screen w-full overflow-hidden relative flex flex-col items-center justify-center'>
            {/* Top Navigation Bar */}
            <header className="love_header absolute top-5 left-5 right-5 flex justify-between items-center z-50">
                <Link
                    to="/"
                    className="love_back_btn"
                    title="Back to Home Page"
                >
                    ← Back to Birthday Home
                </Link>
                {openEnvelope && (
                    <button
                        type="button"
                        onClick={() => setOpenEnvelope(false)}
                        className="love_close_btn"
                    >
                        ✉️ Fold Envelope
                    </button>
                )}
            </header>

            <section className="munna cssletter z-10">
                <div className={`envelope ${openEnvelope ? "active" : ""}`}>
                    <button
                        className="munna heart"
                        id="openEnvelope"
                        aria-label="Open Envelope"
                        onClick={handleOpen}
                    >
                        <span className="munna heart-text">Open</span>
                    </button>
                    <div className="munna envelope-flap text-black relative">
                        <div className='munna absolute left-1/2 top-[30%] -translate-x-1/2 flex items-center justify-center flex-col md:gap-y-2'>
                            <span className='munna font-dancingScript md:text-3xl text-xl font-bold text-[#8b0000]'>Dear Angela</span>
                        </div>
                    </div>
                    <div className="munna envelope-folds">
                        <div className="munna envelope-left"></div>
                        <div className="munna envelope-right"></div>
                        <div className="munna envelope-bottom"></div>
                    </div>
                </div>

                {/* Video Card that emerges upon opening envelope */}
                {openEnvelope && (
                    <div className="love_video_modal_wrapper">
                        <div className="love_video_card" onClick={togglePlayPause}>
                            <div className="love_video_header">
                                <span className="video_sparkle">✨</span>
                                <span className="video_title">Special Birthday Video for Angela 💖</span>
                                <span className="video_sparkle">✨</span>
                            </div>

                            <div className="video_screen_container">
                                <video
                                    ref={videoRef}
                                    src={birthdayVideo}
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    className="love_video_player"
                                />

                                {/* Floating Play/Pause Center Indicator on pause */}
                                {!isPlaying && (
                                    <div className="video_pause_overlay">
                                        <div className="pause_icon_badge">⏸️ Paused</div>
                                    </div>
                                )}
                            </div>

                            {/* Video Control Bar */}
                            <div className="love_video_controls" onClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    className="v_ctrl_btn play_btn"
                                    onClick={togglePlayPause}
                                    aria-label={isPlaying ? "Pause Video" : "Play Video"}
                                >
                                    {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                                </button>

                                <button
                                    type="button"
                                    className="v_ctrl_btn sound_btn"
                                    onClick={toggleMute}
                                    aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
                                >
                                    {isMuted ? "🔇 Unmute" : "🔊 Sound ON"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ------------------ Heart Beating Decorative Elements */}
            <div className="munna heart-container absolute top-[20%] md:left-20 left-6 pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="munna heartBeating md:w-[150px] w-[110px] h-[200px]"
                >
                    <path
                        d="M471.7 73.6c-54.5-46.4-136-38.3-186.4 15.8L256 120.6l-29.3-31.2C176.3 35.3 94.8 27.2 40.3 73.6-18 125.4-13.3 221 43 273.7l187.3 177.6a24 24 0 0032.4 0L469 273.7c56.3-52.8 61-148.3 2.7-200.1z"
                        fill="#b10505"
                    />
                </svg>
            </div>
            <div className="munna heart-container absolute bottom-[10%] md:right-20 right-6 rotate-180 pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="munna heartBeating md:w-[150px] w-[110px] h-[200px]"
                >
                    <path
                        d="M471.7 73.6c-54.5-46.4-136-38.3-186.4 15.8L256 120.6l-29.3-31.2C176.3 35.3 94.8 27.2 40.3 73.6-18 125.4-13.3 221 43 273.7l187.3 177.6a24 24 0 0032.4 0L469 273.7c56.3-52.8 61-148.3 2.7-200.1z"
                        fill="#b10505"
                    />
                </svg>
            </div>

            {/* ------------------ Heart Falling Snowflakes */}
            <div className="munna snowflakes z-0 pointer-events-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div key={num} className="munna snowflake">
                        <img src="https://i.pinimg.com/originals/96/c7/8b/96c78bc8ab873498b763798793d64f62.png" width="25" alt="heart" />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default LoveLetter;