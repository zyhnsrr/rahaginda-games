"use client";
import { useState, useEffect } from "react";

const CHARACTERS = [
  { id: "cat", emoji: "🐱", name: "Cat" },
  { id: "bear", emoji: "🐻", name: "Bear" },
  { id: "fox", emoji: "🦊", name: "Fox" },
  { id: "bunny", emoji: "🐰", name: "Bunny" },
];

const THEMES = [
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    boardBorder: "#ff6b35",
    boardBg: "linear-gradient(135deg, #1a0a00, #2d1200, #1a0a00)",
    cellBorder: "rgba(255,107,53,0.4)",
    cellBg: "rgba(255,107,53,0.06)",
    p1Symbol: "🔥",
    p2Symbol: "🧡",
    accentA: "#ff6b35",
    accentB: "#ffaa00",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    emoji: "🌙",
    boardBorder: "#a855f7",
    boardBg: "linear-gradient(135deg, #0d0019, #1a0033, #0d0019)",
    cellBorder: "rgba(168,85,247,0.4)",
    cellBg: "rgba(168,85,247,0.06)",
    p1Symbol: "⭐",
    p2Symbol: "💜",
    accentA: "#a855f7",
    accentB: "#6b9dff",
  },
  {
    id: "retro",
    name: "Retro",
    emoji: "👾",
    boardBorder: "#00ff88",
    boardBg: "linear-gradient(135deg, #000d00, #001a00, #000d00)",
    cellBorder: "rgba(0,255,136,0.4)",
    cellBg: "rgba(0,255,136,0.06)",
    p1Symbol: "✦",
    p2Symbol: "♥",
    accentA: "#00ff88",
    accentB: "#00ccff",
  },
];

export default function LobbyScreen({ onStart, onBack }) {
  const [step, setStep] = useState("players"); // players | theme
  const [player1, setPlayer1] = useState({ name: "", character: null });
  const [player2, setPlayer2] = useState({ name: "", character: null });
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleNextToTheme = () => {
    if (!player1.name.trim() || !player2.name.trim()) {
      setError("Kedua pemain harus memasukkan nama!");
      return;
    }
    if (!player1.character || !player2.character) {
      setError("Kedua pemain harus memilih karakter!");
      return;
    }
    if (player1.character === player2.character) {
      setError("Karakter harus berbeda!");
      return;
    }
    setError("");
    setStep("theme");
  };

  const handleStart = () => {
    if (!selectedTheme) {
      setError("Choose board!");
      return;
    }
    setError("");
    const theme = THEMES.find(t => t.id === selectedTheme);
    onStart(player1, player2, theme);
  };

  if (step === "players") {
    return (
      <main style={styles.container}>
        <button style={styles.backButton} onClick={onBack}>← BACK</button>

        <div style={styles.titleWrapper}>
          <h1 style={styles.title}>COUPLE</h1>
          <h1 style={styles.titleAccent}>GAMES</h1>
          <p style={styles.subtitle}>✨ play together, stay together ✨</p>
        </div>

        <div style={{
          ...styles.playersWrapper,
          flexDirection: isMobile ? "column" : "row",
        }}>
          <PlayerCard
            label="PLAYER 1"
            accentColor="#ff6b9d"
            player={player1}
            setPlayer={setPlayer1}
            otherCharacter={player2.character}
          />
          <div style={{
            ...styles.vsText,
            fontSize: isMobile ? "14px" : "24px",
          }}>VS</div>
          <PlayerCard
            label="PLAYER 2"
            accentColor="#6b9dff"
            player={player2}
            setPlayer={setPlayer2}
            otherCharacter={player1.character}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.primaryButton} onClick={handleNextToTheme}>
          PILIH TEMA →
        </button>
      </main>
    );
  }

  if (step === "theme") {
    return (
      <main style={styles.container}>
        <button style={styles.backButton} onClick={() => { setStep("players"); setError(""); }}>
          ← BACK
        </button>

        <div style={styles.titleWrapper}>
          <h1 style={styles.title}>PILIH</h1>
          <h1 style={styles.titleAccent}>TEMA</h1>
          <p style={styles.subtitle}>✨ sesuaikan vibe kalian ✨</p>
        </div>

        <div style={styles.themeGrid}>
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                style={{
                  ...styles.themeCard,
                  borderColor: isSelected ? theme.accentA : "rgba(255,255,255,0.12)",
                  background: isSelected ? `${theme.accentA}18` : "rgba(255,255,255,0.04)",
                  boxShadow: isSelected ? `0 0 24px ${theme.accentA}44` : "none",
                  transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                <span style={{ fontSize: "48px" }}>{theme.emoji}</span>
                <p style={{
                  ...styles.themeName,
                  color: isSelected ? theme.accentA : "rgba(255,255,255,0.7)",
                }}>
                  {theme.name}
                </p>
                <div style={styles.themeSymbols}>
                  <span style={{ color: theme.accentA, fontSize: "20px" }}>{theme.p1Symbol}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", fontFamily: "'Press Start 2P'" }}>vs</span>
                  <span style={{ color: theme.accentB, fontSize: "20px" }}>{theme.p2Symbol}</span>
                </div>
                {isSelected && (
                  <p style={{ ...styles.selectedLabel, color: theme.accentA }}>✓ DIPILIH</p>
                )}
              </button>
            );
          })}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.primaryButton} onClick={handleStart}>
          ▶ MULAI GAME
        </button>
      </main>
    );
  }
}

function PlayerCard({ label, accentColor, player, setPlayer, otherCharacter }) {
  return (
    <div style={{ ...styles.card, borderColor: accentColor }}>
      <p style={{ ...styles.cardLabel, color: accentColor }}>{label}</p>
      <input
        style={styles.input}
        placeholder="Input username..."
        value={player.name}
        onChange={(e) => setPlayer({ ...player, name: e.target.value })}
        maxLength={12}
      />
      <p style={styles.chooseText}>PILIH KARAKTER</p>
      <div style={styles.characterGrid}>
        {CHARACTERS.map((char) => {
          const isSelected = player.character === char.id;
          const isDisabled = otherCharacter === char.id;
          return (
            <button
              key={char.id}
              disabled={isDisabled}
              onClick={() => setPlayer({ ...player, character: char.id })}
              style={{
                ...styles.charButton,
                borderColor: isSelected ? accentColor : "#333",
                opacity: isDisabled ? 0.3 : 1,
                backgroundColor: isSelected ? accentColor + "33" : "transparent",
              }}
            >
              <span style={{ fontSize: "28px" }}>{char.emoji}</span>
              <span style={styles.charName}>{char.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px 40px",
    gap: "28px",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "8px",
    padding: "10px 16px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
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
  playersWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  vsText: {
    fontFamily: "'Press Start 2P', monospace",
    color: "#ffffff",
    opacity: 0.5,
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "2px solid",
    borderRadius: "16px",
    padding: "24px",
    width: "260px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backdropFilter: "blur(10px)",
  },
  cardLabel: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "11px",
    letterSpacing: "2px",
  },
  input: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#ffffff",
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    outline: "none",
    width: "100%",
  },
  chooseText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "8px",
    color: "#888888",
    letterSpacing: "1px",
  },
  characterGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  charButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "10px 8px",
    border: "2px solid",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "transparent",
  },
  charName: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
    color: "#ffffff",
  },
  themeGrid: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  themeCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "24px 20px",
    border: "2px solid",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "130px",
    backdropFilter: "blur(10px)",
  },
  themeName: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    letterSpacing: "1px",
  },
  themeSymbols: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  selectedLabel: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
    letterSpacing: "1px",
  },
  primaryButton: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "13px",
    padding: "16px 40px",
    background: "linear-gradient(135deg, #ff6b9d, #ff8e53)",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    cursor: "pointer",
    letterSpacing: "2px",
    boxShadow: "0 4px 20px rgba(255,107,157,0.4)",
  },
  error: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "8px",
    color: "#ff4444",
    textAlign: "center",
  },
};