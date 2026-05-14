"use client";
import { useEffect, useState } from "react";

const CHARACTERS = {
  cat: "🐱",
  bear: "🐻",
  fox: "🦊",
  bunny: "🐰",
};

const WIN_MESSAGES = {
  cat: ["Purrfect! 😸", "Kamu tajam seperti cakar kucing!", "Meong~ kamu yang terbaik!"],
  bear: ["Beruang juara! 🐻", "Kuat dan manis, persis kamu!", "Grrreat job!"],
  fox: ["Licik tapi keren! 🦊", "Cerdik seperti rubah!", "Fox wins again~"],
  bunny: ["Hop hop hooray! 🐰", "Secepat kelinci!", "Lucu tapi mematikan~"],
};

export default function EndScreen({ winner, scores, player1, player2, onPlayAgain, onBackToMain }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [msgIndex] = useState(Math.floor(Math.random() * 3));

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const winMessage = WIN_MESSAGES[winner.character]?.[msgIndex] || "Selamat menang!";
  const loser = winner.name === player1.name ? player2 : player1;

  return (
    <main style={styles.container}>
      {/* Confetti dots */}
      {showConfetti && (
        <div style={styles.confettiWrapper}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.confettiDot,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                background: ["#ff6b9d", "#6b9dff", "#ffd700", "#ff8e53", "#88ffcc"][i % 5],
              }}
            />
          ))}
        </div>
      )}

      {/* Trophy */}
      <div style={styles.trophyWrapper}>
        <span style={styles.trophyEmoji}>🏆</span>
      </div>

      {/* Winner announcement */}
      <div style={styles.winnerBlock}>
        <p style={styles.winnerLabel}>PEMENANG</p>
        <div style={styles.winnerNameRow}>
          <span style={{ fontSize: "36px" }}>{CHARACTERS[winner.character]}</span>
          <p style={styles.winnerName}>{winner.name.toUpperCase()}</p>
        </div>
        <p style={styles.winMessage}>{winMessage}</p>
      </div>

      {/* Score Summary */}
      <div style={styles.scoreSummary}>
        <ScorePill
          player={player1}
          score={scores[player1.name]}
          isWinner={winner.name === player1.name}
        />
        <p style={styles.scoreDash}>—</p>
        <ScorePill
          player={player2}
          score={scores[player2.name]}
          isWinner={winner.name === player2.name}
        />
      </div>

      {/* Loser message */}
      <div style={styles.loserBox}>
        <p style={styles.loserText}>
          {CHARACTERS[loser.character]} {loser.name}, next time ya~ 😘
        </p>
      </div>

      {/* Buttons */}
      <div style={styles.buttonRow}>
  <button style={styles.playAgainButton} onClick={onPlayAgain}>
    🔄 MAIN LAGI
  </button>
  <button style={styles.backButton} onClick={onBackToMain}>
    🏠 MENU
  </button>
</div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes glow {
          0% { text-shadow: 0 0 10px #ffd700; }
          50% { text-shadow: 0 0 30px #ffd700, 0 0 60px #ffaa00; }
          100% { text-shadow: 0 0 10px #ffd700; }
        }
      `}</style>
    </main>
  );
}

function ScorePill({ player, score, isWinner }) {
  return (
    <div style={{
      ...styles.scorePill,
      borderColor: isWinner ? "#ffd700" : "rgba(255,255,255,0.15)",
      background: isWinner ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)",
    }}>
      <span style={{ fontSize: "20px" }}>{CHARACTERS[player.character]}</span>
      <p style={styles.scorePillName}>{player.name}</p>
      <p style={{
        ...styles.scorePillScore,
        color: isWinner ? "#ffd700" : "#ffffff",
      }}>{score}</p>
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
    gap: "28px",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  confettiWrapper: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
  },
  confettiDot: {
    position: "absolute",
    top: "-10px",
    width: "10px",
    height: "10px",
    borderRadius: "2px",
    animation: "fall linear infinite",
  },
  trophyWrapper: {
    animation: "popIn 0.6s ease forwards",
    zIndex: 1,
  },
  trophyEmoji: {
    fontSize: "80px",
    display: "block",
    animation: "glow 2s ease infinite",
  },
  winnerBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    zIndex: 1,
  },
  winnerLabel: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    color: "#aaaaaa",
    letterSpacing: "4px",
  },
  winnerNameRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  winnerName: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "clamp(16px, 4vw, 28px)",
    color: "#ffd700",
    letterSpacing: "3px",
    animation: "glow 2s ease infinite",
  },
  winMessage: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    color: "#ffffff",
    opacity: 0.8,
  },
  scoreSummary: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "16px",
    zIndex: 1,
  },
  scoreDash: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "16px",
    color: "rgba(255,255,255,0.3)",
  },
  scorePill: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "16px 20px",
    border: "2px solid",
    borderRadius: "14px",
    minWidth: "100px",
  },
  scorePillName: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
    color: "#ffffff",
  },
  scorePillScore: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "28px",
  },
  loserBox: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "14px 24px",
    zIndex: 1,
  },
  loserText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "8px",
    color: "#aaaaaa",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    zIndex: 1,
  },
  playAgainButton: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "11px",
    padding: "16px 32px",
    background: "linear-gradient(135deg, #ff6b9d, #ff8e53)",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    cursor: "pointer",
    letterSpacing: "2px",
    boxShadow: "0 4px 20px rgba(255,107,157,0.4)",
  },
  backButton: {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: "10px",
  padding: "16px 24px",
  background: "transparent",
  border: "2px solid rgba(255,255,255,0.2)",
  borderRadius: "12px",
  color: "rgba(255,255,255,0.6)",
  cursor: "pointer",
  letterSpacing: "1px",
},
};