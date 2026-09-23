import React, { useEffect, useRef, useState } from 'react';
import '../CelebrationShow.css';
import ruthikaImg from '../assets/ruthika.jpeg';
import {
    playPopperSound,
    playFireworkSound,
    playBalloonPopSound,
    playCelebrationChimes,
    playGrandFinaleFanfare
} from '../utils/audioEffects';

const TOTAL_DURATION = 20; // 20 seconds show

const BALLOON_COLORS = [
    'linear-gradient(135deg, #ff416c, #ff4b2b)',
    'linear-gradient(135deg, #f857a6, #ff5858)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
    'linear-gradient(135deg, #fdcbf1, #e6dee9)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #ff9a9e, #fecfef)',
    'linear-gradient(135deg, #ff758c, #ff7eb3)'
];

const EMOJIS = ['🎈', '🎂', '🧸', '💖', '✨', '🌸', '🦄', '🎁', '⭐', '🍭'];

const CelebrationShow = ({ onClose }) => {
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [poppedBalloons, setPoppedBalloons] = useState(new Set());
    const [balloonsList, setBalloonsList] = useState([]);
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const soundEnabledRef = useRef(soundEnabled);

    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    // Generate random balloons for Phase 2
    useEffect(() => {
        const list = Array.from({ length: 22 }, (_, idx) => ({
            id: idx,
            left: Math.random() * 88 + 6, // 6% to 94%
            size: Math.floor(Math.random() * 30) + 65, // 65px - 95px
            speed: Math.random() * 2.5 + 4, // 4s - 6.5s
            delay: Math.random() * 3.5, // stagger
            color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
            emoji: EMOJIS[idx % EMOJIS.length],
            wobble: Math.random() * 20 - 10
        }));
        setBalloonsList(list);
    }, []);

    // Main 20s Timeline
    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsElapsed((prev) => {
                const next = prev + 0.1;
                if (next >= TOTAL_DURATION) {
                    return TOTAL_DURATION;
                }
                return parseFloat(next.toFixed(1));
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Trigger Choreographed Effects Based on Current Second
    useEffect(() => {
        const sec = Math.floor(secondsElapsed);

        // Phase 1: 0s - 4s (Poppers & Confetti Cannons)
        if (secondsElapsed >= 0 && secondsElapsed < 4) {
            if (window.confetti && Math.floor(secondsElapsed * 10) % 7 === 0) {
                if (soundEnabledRef.current) playPopperSound();
                window.confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 65,
                    origin: { x: 0.1, y: 0.8 },
                    colors: ['#ff4081', '#ffd700', '#00e5ff', '#ff6e40', '#76ff03']
                });
                window.confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 65,
                    origin: { x: 0.9, y: 0.8 },
                    colors: ['#ff4081', '#ffd700', '#00e5ff', '#ff6e40', '#76ff03']
                });
            }
        }

        // Phase 3: 9s - 14s (Firework Crackers Sound)
        if (secondsElapsed >= 9 && secondsElapsed < 14) {
            if (Math.floor(secondsElapsed * 10) % 12 === 0) {
                if (soundEnabledRef.current) playFireworkSound();
            }
        }

        // Phase 4: 14s - 19s (Celebration Chimes)
        if (secondsElapsed >= 14 && secondsElapsed < 19) {
            if (Math.floor(secondsElapsed * 10) % 6 === 0) {
                if (soundEnabledRef.current) {
                    playCelebrationChimes(Math.floor(secondsElapsed * 2));
                }
            }
        }

        // Phase 5: 19s (Grand Finale Fanfare & Golden Confetti)
        if (sec === 19 && Math.floor(secondsElapsed * 10) % 10 === 0) {
            if (soundEnabledRef.current) playGrandFinaleFanfare();
            if (window.confetti) {
                window.confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.4 },
                    colors: ['#ffd700', '#ff69b4', '#ffffff', '#ff1493', '#00ffff']
                });
            }
        }
    }, [secondsElapsed]);

    // Canvas Fireworks Simulation for Phase 3 (9s - 14s)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
                this.size = Math.random() * 3 + 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.08; // gravity
                this.alpha -= this.decay;
            }
            draw(context) {
                context.save();
                context.globalAlpha = Math.max(0, this.alpha);
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fillStyle = this.color;
                context.shadowBlur = 10;
                context.shadowColor = this.color;
                context.fill();
                context.restore();
            }
        }

        let particles = [];
        const colors = ['#ff0055', '#00ffff', '#ffd700', '#ff00ea', '#00ff66', '#ff7700', '#ffffff'];

        const spawnFirework = (targetX, targetY) => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const count = 45;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(targetX, targetY, color));
            }
        };

        let lastSpawn = 0;
        const loop = (timestamp) => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, width, height);

            // Spawn fireworks between 8.5s and 14.5s
            if (secondsElapsed >= 8.5 && secondsElapsed <= 14.5) {
                if (timestamp - lastSpawn > 500) {
                    const fx = Math.random() * (width * 0.8) + width * 0.1;
                    const fy = Math.random() * (height * 0.5) + height * 0.15;
                    spawnFirework(fx, fy);
                    lastSpawn = timestamp;
                }
            }

            particles = particles.filter((p) => p.alpha > 0);
            particles.forEach((p) => {
                p.update();
                p.draw(ctx);
            });

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [secondsElapsed]);

    // Handle interactive balloon click/pop
    const handlePopBalloon = (id, e) => {
        e.stopPropagation();
        if (poppedBalloons.has(id)) return;
        setPoppedBalloons((prev) => new Set(prev).add(id));
        if (soundEnabledRef.current) playBalloonPopSound();
        if (window.confetti) {
            const rect = e.currentTarget.getBoundingClientRect();
            window.confetti({
                particleCount: 20,
                spread: 50,
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight
                }
            });
        }
    };

    // Replay celebration show
    const handleReplay = () => {
        setPoppedBalloons(new Set());
        setSecondsElapsed(0);
    };

    const progressPercent = Math.min(100, (secondsElapsed / TOTAL_DURATION) * 100);

    return (
        <div className="celebration_overlay">
            {/* Background Canvas for Fireworks & Star Particles */}
            <canvas ref={canvasRef} className="celebration_canvas" />

            {/* Header Controls */}
            <div className="celebration_header">
                <div className="celebration_timer_badge">
                    <span className="timer_pulse"></span>
                    <span>🎉 Show: {Math.ceil(TOTAL_DURATION - secondsElapsed)}s</span>
                </div>

                <div className="celebration_controls">
                    <button
                        type="button"
                        className="ctrl_btn sound_btn"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                    >
                        {soundEnabled ? '🔊 Sound ON' : '🔇 Muted'}
                    </button>
                    <button
                        type="button"
                        className="ctrl_btn close_btn"
                        onClick={onClose}
                        title="Close Show"
                    >
                        ✕ Close
                    </button>
                </div>
            </div>

            {/* Top Progress Bar */}
            <div className="celebration_progress_track">
                <div
                    className="celebration_progress_bar"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* PHASE 1: 0s - 4s (Poppers & Confetti Cannons) */}
            {secondsElapsed < 4.2 && (
                <div className="phase_container phase_poppers">
                    <div className="popper_item popper_left">
                        <div className="popper_icon">🎉</div>
                        <div className="popper_blast"></div>
                    </div>
                    <div className="phase_title_card">
                        <h2 className="glow_text">🎊 Party Time! 🎊</h2>
                        <p className="sub_text">Get ready for Angela's 8th Birthday Extravaganza!</p>
                    </div>
                    <div className="popper_item popper_right">
                        <div className="popper_icon">🎉</div>
                        <div className="popper_blast"></div>
                    </div>
                </div>
            )}

            {/* PHASE 2: 4s - 9s (3D Floating Balloons Swarm) */}
            {secondsElapsed >= 3.8 && secondsElapsed < 9.5 && (
                <div className="phase_container phase_balloons">
                    <div className="balloons_header_badge">
                        <h3>🎈 Pop the Balloons! 🎈</h3>
                    </div>
                    <div className="balloon_field">
                        {balloonsList.map((b) => {
                            const isPopped = poppedBalloons.has(b.id);
                            if (isPopped) return null;
                            return (
                                <div
                                    key={b.id}
                                    className="floating_3d_balloon"
                                    style={{
                                        left: `${b.left}%`,
                                        width: `${b.size}px`,
                                        height: `${b.size * 1.25}px`,
                                        animationDuration: `${b.speed}s`,
                                        animationDelay: `${b.delay}s`,
                                        background: b.color
                                    }}
                                    onClick={(e) => handlePopBalloon(b.id, e)}
                                >
                                    <div className="balloon_highlight"></div>
                                    <span className="balloon_emoji">{b.emoji}</span>
                                    <div className="balloon_string"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* PHASE 3: 9s - 14s (Firework Crackers & Sparklers) */}
            {secondsElapsed >= 9 && secondsElapsed < 14.5 && (
                <div className="phase_container phase_fireworks">
                    <div className="fireworks_title">
                        <span className="sparkle_star">✨</span>
                        <h2 className="firework_glow_text">🎆 Cracker Spectacular! 🎆</h2>
                        <span className="sparkle_star">✨</span>
                    </div>
                    <div className="firework_launchers">
                        <div className="rocket_launcher r1">🚀</div>
                        <div className="rocket_launcher r2">🚀</div>
                        <div className="rocket_launcher r3">🚀</div>
                    </div>
                </div>
            )}

            {/* PHASE 4: 14s - 19s (3D Angela Birthday Spotlight) */}
            {secondsElapsed >= 14 && secondsElapsed < 19.5 && (
                <div className="phase_container phase_spotlight">
                    <div className="spotlight_card_3d">
                        <div className="crown_badge">👑</div>
                        <div className="spotlight_photo_wrapper">
                            <img src={ruthikaImg} alt="Angela" className="spotlight_photo" />
                            <div className="shimmer_ring"></div>
                        </div>
                        <div className="spotlight_text">
                            <h1 className="hologram_title">Happy 8th Birthday</h1>
                            <h2 className="hologram_name">Angela 💖</h2>
                            <p className="hologram_sub">✨ Our Sweetest Little Star ✨</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 5: 19s - 20s+ (Grand Finale & Replay) */}
            {secondsElapsed >= 19 && (
                <div className="phase_container phase_finale">
                    <div className="finale_card">
                        <div className="finale_trophy">🎂✨🎈</div>
                        <h1 className="finale_title">Happy 8th Birthday Angela!</h1>
                        <p className="finale_msg">
                            Wishing you endless joy, love, magic, and boundless laughter today and always! 💖🦄
                        </p>
                        <div className="finale_actions">
                            <button type="button" className="finale_btn replay" onClick={handleReplay}>
                                🔄 Replay Celebration
                            </button>
                            <button type="button" className="finale_btn close" onClick={onClose}>
                                ✨ Back to Birthday Card
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CelebrationShow;
