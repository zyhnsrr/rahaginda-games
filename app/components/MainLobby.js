"use client";
import { useState, useEffect } from "react";

const GAMES = [
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    emoji: "⭕",
    desc: "Classic 3x3 board game",
    status: "available",
    accentColor: "#ff6b9d",
  },
  {
    id: "snakeladder",
    name: "Ular Tangga",
    emoji: "🎲",
    desc: "Naik tangga, hindari ular!",
    status: "coming_soon",
    accentColor: "#6b9dff",
  },
  {
    id: "cards",
    name: "Card Game",
    emoji: "🃏",
    desc: "Battle of cards",
    status: "coming_soon",
    accentColor: "#ffd700",
  },
];

export default function MainLobby({ onSelectGame }) {
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <main style={styles.container}>
      {/* Title */}
      <div style={styles.titleWrapper}>
        <h1 style={styles.title}>COUPLE</h1>
        <h1 style={styles.titleAccent}>GAMES</h1>
        <p style={styles.subtitle}>✨ play together, stay together ✨</p>
      </div>

      {/* Game Select Label */}
      <p style={styles.selectLabel}>PILIH GAME</p>

      {/* Game Cards */}
      <div style={{
        ...styles.gamesGrid,
        flexDirection: isMobile ? "column" : "row",
      }}>
        {GAMES.map((game) => {
          const isAvailable = game.status === "available";
          const isHovered = hovered === game.id;

          return (
            <button
              key={game.id}
              disabled={!isAvailable}
              onMouseEnter={() => setHovered(game.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => isAvailable && onSelectGame(game.id)}
              style={{
                ...styles.gameCard,
                borderColor: isHovered && isAvailable
                  ? game.accentColor
                  : "rgba(255,255,255,0.1)",
                boxShadow: isHovered && isAvailable
                  ? `0 0 24px ${game.accentColor}44`
                  : "none",
                opacity: isAvailable ? 1 : 0.5,
                cursor: isAvailable ? "pointer" : "not-allowed",
                transform: isHovered && isAvailable ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              <span style={{ fontSize: "48px" }}>{game.emoji}</span>
              <p style={{
                ...styles.gameName,
                color: isAvailable ? game.accentColor : "rgba(255,255,255,0.4)",
              }}>
                {game.name}
              </p>
              <p style={styles.gameDesc}>{game.desc}</p>
              {!isAvailable && (
                <div style={styles.comingSoonBadge}>
                  <p style={styles.comingSoonText}>COMING SOON</p>
                </div>
              )}
              {isAvailable && (
                <div style={{
                  ...styles.playBadge,
                  background: `${game.accentColor}22`,
                  borderColor: `${game.accentColor}44`,
                }}>
                  <p style={{ ...styles.playText, color: game.accentColor }}>▶ PLAY</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    gap: "28px",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  titleWrapper: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  title: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "clamp(20px, 5vw, 36px)",
    color: "#ffffff",
    letterSpacing: "8px",
  },
  titleAccent: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "clamp(20px, 5vw, 36px)",
    color: "#ff6b9d",
    letterSpacing: "8px",
  },
  subtitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "clamp(6px, 1.5vw, 9px)",
    color: "#aaaaaa",
    marginTop: "8px",
  },
  selectLabel: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    color: "#888888",
    letterSpacing: "4px",
  },
  gamesGrid: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
  },
  gameCard: {
    background: "rgba(255,255,255,0.04)",
    border: "2px solid",
    borderRadius: "20px",
    padding: "28px 24px",
    width: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
  },
  gameName: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "10px",
    letterSpacing: "1px",
    textAlign: "center",
  },
  gameDesc: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: "1.6",
  },
  comingSoonBadge: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "6px 12px",
    marginTop: "4px",
  },
  comingSoonText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "6px",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "1px",
  },
  playBadge: {
    border: "1px solid",
    borderRadius: "20px",
    padding: "6px 16px",
    marginTop: "4px",
  },
  playText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "8px",
    letterSpacing: "1px",
  },
};