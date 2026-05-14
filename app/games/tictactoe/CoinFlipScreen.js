"use client";
import { useState } from "react";

const CHARACTERS = {
  cat: "🐱",
  bear: "🐻",
  fox: "🦊",
  bunny: "🐰",
};

export default function CoinFlipScreen({ player1, player2, onFlipDone }) {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const flipCoin = () => {
    setFlipping(true);
    setShowResult(false);
    setResult(null);

    setTimeout(() => {
      const winner = Math.random() < 0.5 ? player1 : player2;
      setResult(winner);
      setFlipping(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <main style={styles.container}>
      <h2 style={styles.title}>COIN FLIP</h2>
      <p style={styles.subtitle}>siapa yang jalan duluan?</p>

      <div style={styles.coinWrapper}>
        <div style={{
          ...styles.coin,
          animation: flipping ? "spin 0.4s linear infinite" : "none",
        }}>
          {!flipping && !result && (
            <span style={styles.coinEmoji}>🪙</span>
          )}
          {flipping && (
            <span style={styles.coinEmoji}>✨</span>
          )}
          {result && !flipping && (
            <span style={styles.coinEmoji}>
              {CHARACTERS[result.character]}
            </span>
          )}
        </div>
      </div>

      {showResult && result && (
        <div style={styles.resultWrapper}>
          <p style={styles.resultText}>
            {CHARACTERS[result.character]} {result.name.toUpperCase()} JALAN DULUAN!
          </p>
          <p style={styles.resultSub}>siap-siap ya 👀</p>
        </div>
      )}

      {!showResult && (
        <button
          style={{
            ...styles.flipButton,
            opacity: flipping ? 0.6 : 1,
            cursor: flipping ? "not-allowed" : "pointer",
          }}
          onClick={flipCoin}
          disabled={flipping}
        >
          {flipping ? "flipping..." : "🪙 FLIP!"}
        </button>
      )}

      {showResult && (
        <button
          style={styles.continueButton}
          onClick={() => onFlipDone(result)}
        >
          ▶ MULAI MATCH
        </button>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(90deg) scale(1.2); }
          100% { transform: rotateY(180deg) scale(1); }
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
    gap: "32px",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "40px 20px",
  },
  title: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "clamp(18px, 4vw, 32px)",
    color: "#ffffff",
    letterSpacing: "6px",
  },
  subtitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    color: "#aaaaaa",
  },
  coinWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    border: "3px solid rgba(255,215,0,0.4)",
    boxShadow: "0 0 40px rgba(255,215,0,0.2)",
  },
  coin: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ffd700, #ffaa00)",
    boxShadow: "0 4px 20px rgba(255,215,0,0.5)",
  },
  coinEmoji: {
    fontSize: "56px",
    lineHeight: 1,
  },
  resultWrapper: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  resultText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "clamp(10px, 2.5vw, 14px)",
    color: "#ffd700",
    letterSpacing: "2px",
  },
  resultSub: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    color: "#aaaaaa",
  },
  flipButton: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "14px",
    padding: "16px 48px",
    background: "linear-gradient(135deg, #ffd700, #ffaa00)",
    border: "none",
    borderRadius: "12px",
    color: "#1a1a2e",
    cursor: "pointer",
    letterSpacing: "2px",
    boxShadow: "0 4px 20px rgba(255,215,0,0.4)",
  },
  continueButton: {
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
};