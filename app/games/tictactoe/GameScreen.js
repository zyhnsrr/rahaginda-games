"use client";
import { useState, useEffect } from "react";

const CHARACTERS = {
  cat: "🐱",
  bear: "🐻",
  fox: "🦊",
  bunny: "🐰",
};

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const PUNISHMENTS = [
  "Ciium pipi lawan 3x 😘",
  "Kasih compliment tulus ke lawan 💬",
  "Peluk lawan selama 10 detik 🤗",
  "Nyanyiin lagu buat lawan 🎵",
  "Ceritain hal yang kamu suka dari lawan ❤️",
  "Kasih pijat bahu 1 menit 💆",
  "Bilang 'I love you' dengan gaya lebay 😂",
  "Foto selfie bareng dengan pose lucu 📸",
  "Kasih satu wish yang harus dikabulkan 🌟",
  "Bacain puisi dadakan buat lawan 📝",
  "Joget 15 detik di depan lawan 💃",
  "Tebak-tebakan, kalah = cubit pipi 😆",
  "Kasih nickname lucu buat lawan 🏷️",
  "Reenact adegan film romantis favorit 🎬",
  "Kirim voice note bilang sayang 🎙️",
];

const SKILLS = [
  { id: "freeze", name: "Freeze Tile", emoji: "❄️", desc: "Kunci 1 kotak lawan selama 2 turn" },
  { id: "shield", name: "Shield", emoji: "🛡️", desc: "Proteksi 1 tile milikmu dari Bomb" },
  { id: "double", name: "Double Move", emoji: "⚡", desc: "Jalan 2x giliran ini" },
  { id: "invisible", name: "Invisible", emoji: "👻", desc: "Sembunyikan simbolmu selama 1 turn" },
  { id: "bomb", name: "Bomb", emoji: "💣", desc: "Hapus tile di radius 1 dari tile yang dipilih" },
];

function checkWinner(board) {
  for (let combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] !== "HIDDEN" && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  if (board.every((cell) => cell !== null)) return { winner: "draw", combo: [] };
  return null;
}

export default function GameScreen({ player1, player2, firstPlayer, theme, onGameEnd }) {
  const p1Symbol = theme?.p1Symbol || "⭐";
  const p2Symbol = theme?.p2Symbol || "💗";
  const p1Color = theme?.accentA || "#ff6b9d";
  const p2Color = theme?.accentB || "#6b9dff";

  const [board, setBoard] = useState(Array(9).fill(null));
  const [hiddenCells, setHiddenCells] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(firstPlayer);
  const [scores, setScores] = useState({ [player1.name]: 0, [player2.name]: 0 });
  const [matchResult, setMatchResult] = useState(null);
  const [gamePhase, setGamePhase] = useState("playing");
  const [winCombo, setWinCombo] = useState([]);
  const [punishment, setPunishment] = useState("");
  const [skillReward, setSkillReward] = useState(null);
  const [p1Skills, setP1Skills] = useState([]);
  const [p2Skills, setP2Skills] = useState([]);
  const [frozenCells, setFrozenCells] = useState({});
  const [shieldedCells, setShieldedCells] = useState({});
  const [activeSkill, setActiveSkill] = useState(null);
  const [doubleMove, setDoubleMove] = useState(false);
  const [invisibleNext, setInvisibleNext] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [bombEffect, setBombEffect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentSymbol = currentPlayer?.name === player1.name ? p1Symbol : p2Symbol;
  const currentColor = currentPlayer?.name === player1.name ? p1Color : p2Color;
  const currentSkills = currentPlayer?.name === player1.name ? p1Skills : p2Skills;

  const removeUsedSkill = (skillId) => {
    if (currentPlayer?.name === player1.name) {
      setP1Skills(prev => prev.filter(s => s.id !== skillId));
    } else {
      setP2Skills(prev => prev.filter(s => s.id !== skillId));
    }
  };

  const switchTurn = () => {
    setCurrentPlayer(prev => prev?.name === player1.name ? player2 : player1);
  };

  const handleCellClick = (index) => {
    if (gamePhase !== "playing") return;
    if (activeSkill) { applySkill(index); return; }
    if (board[index] && board[index] !== "HIDDEN") return;
    if (frozenCells[index] > 0) { setStatusMsg("❄️ Kotak ini dibekukan!"); return; }

    const newBoard = [...board];

    if (invisibleNext) {
      newBoard[index] = currentSymbol;
      setHiddenCells(prev => ({ ...prev, [index]: true }));
      setInvisibleNext(false);
      removeUsedSkill("invisible");
    } else {
      newBoard[index] = currentSymbol;
      // Reveal any previously hidden cells
      const newHidden = { ...hiddenCells };
      delete newHidden[index];
      setHiddenCells(newHidden);
    }

    // Decrement frozen
    const newFrozen = { ...frozenCells };
    Object.keys(newFrozen).forEach(k => {
      newFrozen[k]--;
      if (newFrozen[k] <= 0) delete newFrozen[k];
    });

    // Reveal hidden cells after 1 turn
    const updatedHidden = {};
    Object.keys(hiddenCells).forEach(k => {
      if (parseInt(k) !== index) updatedHidden[k] = true;
    });
    setHiddenCells(updatedHidden);

    setFrozenCells(newFrozen);
    setBoard(newBoard);
    setStatusMsg("");

    const result = checkWinner(newBoard);
    if (result) { handleMatchEnd(result); return; }

    if (doubleMove) {
      setDoubleMove(false);
      setStatusMsg("⚡ Double move! Jalan lagi!");
      return;
    }

    switchTurn();
  };

  const applySkill = (index) => {
    if (activeSkill === "freeze") {
      const targetSymbol = board[index];
      if (!targetSymbol) { setStatusMsg("❄️ Pilih kotak yang sudah diisi lawan!"); return; }
      const isOpponent = targetSymbol !== currentSymbol;
      if (!isOpponent) { setStatusMsg("❄️ Harus pilih kotak lawan!"); return; }
      const newFrozen = { ...frozenCells, [index]: 2 };
      setFrozenCells(newFrozen);
      setStatusMsg("❄️ Kotak lawan dibekukan 2 turn!");
      removeUsedSkill("freeze");
      setActiveSkill(null);
      switchTurn();
      return;
    }

    if (activeSkill === "bomb") {
      const newBoard = [...board];
      const targetRow = Math.floor(index / 3);
      const targetCol = index % 3;
      const affected = [];
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const distance = Math.max(Math.abs(row - targetRow), Math.abs(col - targetCol));
        if (distance <= 1 && !shieldedCells[i]) {
          newBoard[i] = null;
          affected.push(i);
        }
      }
      setBoard(newBoard);
      setBombEffect({ center: index, affected });
      setTimeout(() => setBombEffect(null), 800);
      setStatusMsg("💣 BOOM! Area terhapus!");
      removeUsedSkill("bomb");
      setActiveSkill(null);
      switchTurn();
      return;
    }

    if (activeSkill === "shield") {
      if (board[index] !== currentSymbol) { setStatusMsg("🛡️ Harus pilih tile milikmu!"); return; }
      setShieldedCells(prev => ({ ...prev, [index]: true }));
      setStatusMsg("🛡️ Tile diproteksi dari Bomb!");
      removeUsedSkill("shield");
      setActiveSkill(null);
      switchTurn();
      return;
    }
  };

  const handleMatchEnd = (result) => {
    setWinCombo(result.combo);
    setGamePhase("matchEnd");

    if (result.winner === "draw") {
      setMatchResult({ type: "draw" });
      setTimeout(() => resetMatch(), 2000);
      return;
    }

    const winnerPlayer = result.winner === p1Symbol ? player1 : player2;
    const newScores = { ...scores, [winnerPlayer.name]: scores[winnerPlayer.name] + 1 };
    setScores(newScores);
    setMatchResult({ type: "win", winner: winnerPlayer });

    if (newScores[winnerPlayer.name] >= 3) {
      setTimeout(() => onGameEnd(winnerPlayer, newScores), 2000);
      return;
    }

    const randomPunishment = PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];
    setPunishment(randomPunishment);
    setTimeout(() => setGamePhase("punishment"), 1800);
  };

  const handlePunishmentDone = () => {
    const randomSkill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
    setSkillReward(randomSkill);
    setGamePhase("skillGacha");
  };

  const handleSkillAcknowledged = () => {
    if (matchResult?.winner) {
      if (matchResult.winner.name === player1.name) {
        setP1Skills(prev => [...prev, skillReward]);
      } else {
        setP2Skills(prev => [...prev, skillReward]);
      }
    }
    resetMatch();
  };

  const resetMatch = () => {
    setBoard(Array(9).fill(null));
    setWinCombo([]);
    setMatchResult(null);
    setGamePhase("playing");
    setFrozenCells({});
    setHiddenCells({});
    setShieldedCells({});
    setActiveSkill(null);
    setDoubleMove(false);
    setInvisibleNext(false);
    setStatusMsg("");
    setBombEffect(null);
    setMatchCount(prev => prev + 1);
    setCurrentPlayer(firstPlayer);
  };

  const useSkill = (skillId) => {
    if (skillId === "double") {
      setDoubleMove(true);
      removeUsedSkill("double");
      setStatusMsg("⚡ Double move aktif! Jalan sekarang.");
      return;
    }
    if (skillId === "invisible") {
      setInvisibleNext(true);
      setStatusMsg("👻 Invisible aktif! Jalan ke kotak manapun — simbolmu tersembunyi.");
      return;
    }
    setActiveSkill(skillId);
    const skill = SKILLS.find(s => s.id === skillId);
    setStatusMsg(`${skill?.emoji} ${skill?.name} aktif! Pilih kotak target.`);
  };

  const loserName = matchResult?.winner
    ? (matchResult.winner.name === player1.name ? player2.name : player1.name)
    : "";

  const cellSize = isMobile ? "clamp(80px, 28vw, 100px)" : "clamp(85px, 12vw, 110px)";
  const symbolSize = isMobile ? "clamp(18px, 7vw, 26px)" : "clamp(22px, 4vw, 30px)";

  return (
    <main style={{
      ...styles.container,
      background: theme?.boardBg || "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    }}>

      {/* Scoreboard */}
      <div style={styles.scoreBoard}>
        <ScoreCard
          player={player1}
          score={scores[player1.name]}
          isActive={currentPlayer?.name === player1.name && gamePhase === "playing"}
          accentColor={p1Color}
          skills={p1Skills}
          onUseSkill={currentPlayer?.name === player1.name ? useSkill : null}
          isMobile={isMobile}
        />
        <div style={styles.matchInfo}>
          <p style={styles.vsSmall}>VS</p>
          <p style={styles.matchCountText}>MATCH {matchCount + 1}</p>
          <p style={styles.bestOf}>BEST OF 5</p>
        </div>
        <ScoreCard
          player={player2}
          score={scores[player2.name]}
          isActive={currentPlayer?.name === player2.name && gamePhase === "playing"}
          accentColor={p2Color}
          skills={p2Skills}
          onUseSkill={currentPlayer?.name === player2.name ? useSkill : null}
          isMobile={isMobile}
        />
      </div>

      {/* Turn Indicator */}
      {gamePhase === "playing" && (
        <div style={{
          ...styles.turnIndicator,
          borderColor: currentColor + "44",
          boxShadow: `0 0 12px ${currentColor}22`,
        }}>
          <span style={{ fontSize: "18px" }}>{CHARACTERS[currentPlayer?.character]}</span>
          <p style={{ ...styles.turnText, color: currentColor }}>
            giliran {currentPlayer?.name.toUpperCase()}
          </p>
        </div>
      )}

      {statusMsg !== "" && (
        <p style={styles.statusMsg}>{statusMsg}</p>
      )}

      {/* Board Area */}
      <div style={styles.boardWrapper}>
        {!isMobile && (
          <div style={styles.characterSide}>
            <span style={{
              fontSize: "48px",
              display: "block",
              animation: currentPlayer?.name === player1.name && gamePhase === "playing"
                ? "bounce 0.8s ease-in-out infinite alternate" : "none",
            }}>
              {CHARACTERS[player1.character]}
            </span>
            <p style={{ ...styles.playerNameSide, color: p1Color }}>{player1.name}</p>
          </div>
        )}

        {/* Grid */}
        <div style={{
          ...styles.board,
          border: `2px solid ${theme?.boardBorder || "rgba(255,255,255,0.08)"}44`,
        }}>
          {board.map((cell, index) => {
            const isFrozen = frozenCells[index] > 0;
            const isShielded = shieldedCells[index];
            const isWinCell = winCombo.includes(index);
            const isHidden = hiddenCells[index];
            const isBombCenter = bombEffect?.center === index;
            const isBombAffected = bombEffect?.affected?.includes(index);
            const cellColor = cell === p1Symbol ? p1Color : p2Color;

            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  border: "2px solid",
                  borderColor: isWinCell
                    ? "#ffd700"
                    : isBombAffected ? "#ff4400"
                    : isFrozen ? "#88ccff"
                    : isShielded ? "#00ff88"
                    : theme?.cellBorder || "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  transition: "all 0.15s ease",
                  cursor: (cell && !isHidden) || isFrozen ? "not-allowed" : "pointer",
                  background: isWinCell
                    ? "rgba(255,215,0,0.2)"
                    : isBombAffected ? "rgba(255,68,0,0.3)"
                    : isBombCenter ? "rgba(255,68,0,0.5)"
                    : isFrozen ? "rgba(136,204,255,0.12)"
                    : isShielded ? "rgba(0,255,136,0.08)"
                    : theme?.cellBg || "rgba(255,255,255,0.04)",
                  animation: isBombAffected ? "shake 0.4s ease" : "none",
                  transform: isBombCenter ? "scale(0.9)" : "scale(1)",
                }}
              >
                {isFrozen && !cell && (
                  <span style={{ fontSize: "20px" }}>❄️</span>
                )}
                {isShielded && cell && (
                  <span style={{
                    fontSize: "9px",
                    position: "absolute",
                    top: 3,
                    right: 4,
                  }}>🛡️</span>
                )}
                {cell && (
                  <span style={{
                    fontSize: symbolSize,
                    opacity: isHidden ? 0.25 : 1,
                    filter: isHidden ? "blur(2px)" : "none",
                    transition: "all 0.3s ease",
                    color: cellColor,
                  }}>
                    {cell}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!isMobile && (
          <div style={styles.characterSide}>
            <span style={{
              fontSize: "48px",
              display: "block",
              animation: currentPlayer?.name === player2.name && gamePhase === "playing"
                ? "bounce 0.8s ease-in-out infinite alternate" : "none",
            }}>
              {CHARACTERS[player2.character]}
            </span>
            <p style={{ ...styles.playerNameSide, color: p2Color }}>{player2.name}</p>
          </div>
        )}
      </div>

      {/* Mobile char row */}
      {isMobile && (
        <div style={styles.mobileCharRow}>
          <div style={styles.mobileCharItem}>
            <span style={{
              fontSize: "32px",
              animation: currentPlayer?.name === player1.name && gamePhase === "playing"
                ? "bounce 0.8s ease-in-out infinite alternate" : "none",
            }}>
              {CHARACTERS[player1.character]}
            </span>
            <p style={{ ...styles.playerNameSide, color: p1Color }}>{player1.name}</p>
          </div>
          <div style={styles.mobileCharItem}>
            <span style={{
              fontSize: "32px",
              animation: currentPlayer?.name === player2.name && gamePhase === "playing"
                ? "bounce 0.8s ease-in-out infinite alternate" : "none",
            }}>
              {CHARACTERS[player2.character]}
            </span>
            <p style={{ ...styles.playerNameSide, color: p2Color }}>{player2.name}</p>
          </div>
        </div>
      )}

      {/* Match End Overlay */}
      {gamePhase === "matchEnd" && matchResult && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            {matchResult.type === "win" ? (
              <>
                <p style={{ fontSize: "52px" }}>{CHARACTERS[matchResult.winner.character]}</p>
                <p style={styles.overlayTitle}>{matchResult.winner.name.toUpperCase()} MENANG!</p>
                <p style={styles.overlaySub}>match ini milikmu 🎉</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: "52px" }}>🤝</p>
                <p style={styles.overlayTitle}>SERI!</p>
                <p style={styles.overlaySub}>main lagi yuk...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Punishment Overlay */}
      {gamePhase === "punishment" && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <p style={{ fontSize: "48px" }}>🎲</p>
            <p style={styles.overlayTitle}>PUNISHMENT!</p>
            <p style={{ ...styles.overlaySub, color: "#aaaaaa" }}>
              untuk {loserName.toUpperCase()}:
            </p>
            <div style={styles.punishmentBox}>
              <p style={styles.punishmentText}>{punishment}</p>
            </div>
            <button style={styles.overlayButton} onClick={handlePunishmentDone}>
              ✅ SUDAH DILAKUKAN
            </button>
            <button style={styles.skipButton} onClick={handlePunishmentDone}>
              🚫 SKIP
            </button>
          </div>
        </div>
      )}

      {/* Skill Gacha Overlay */}
      {gamePhase === "skillGacha" && skillReward && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <p style={{ fontSize: "48px" }}>🎰</p>
            <p style={styles.overlayTitle}>SKILL REWARD!</p>
            <p style={{ ...styles.overlaySub, color: "#aaaaaa" }}>
              {matchResult?.winner?.name.toUpperCase()} mendapat:
            </p>
            <div style={styles.skillBox}>
              <p style={{ fontSize: "40px" }}>{skillReward.emoji}</p>
              <p style={styles.skillName}>{skillReward.name}</p>
              <p style={styles.skillDesc}>{skillReward.desc}</p>
            </div>
            <button style={styles.overlayButton} onClick={handleSkillAcknowledged}>
              ✨ SIMPAN SKILL
            </button>
            <button style={styles.skipButton} onClick={resetMatch}>
              🚫 SKIP
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0px); }
          to { transform: translateY(-10px); }
        }
        @keyframes shake {
          0% { transform: translate(0,0) scale(1); }
          20% { transform: translate(-3px,3px) scale(0.95); }
          40% { transform: translate(3px,-3px) scale(0.9); }
          60% { transform: translate(-3px,3px) scale(0.95); }
          80% { transform: translate(3px,-3px) scale(1); }
          100% { transform: translate(0,0) scale(1); }
        }
      `}</style>
    </main>
  );
}

function ScoreCard({ player, score, isActive, accentColor, skills, onUseSkill, isMobile }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "2px solid",
      borderColor: isActive ? accentColor : "rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: isMobile ? "8px 10px" : "12px 16px",
      minWidth: isMobile ? "100px" : "130px",
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: isActive ? `0 0 20px ${accentColor}44` : "none",
    }}>
      <p style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: isMobile ? "7px" : "8px",
        color: accentColor,
        marginBottom: "6px",
      }}>
        {CHARACTERS[player.character]} {player.name}
      </p>
      <p style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: isMobile ? "22px" : "28px",
        color: "#ffffff",
      }}>{score}</p>
      {skills.length > 0 && (
        <div style={{
          display: "flex",
          gap: "4px",
          justifyContent: "center",
          marginTop: "6px",
          flexWrap: "wrap",
        }}>
          {skills.map((skill, i) => (
            <button
              key={i}
              onClick={() => onUseSkill && onUseSkill(skill.id)}
              title={skill.name}
              style={{
                fontSize: "16px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                padding: "3px 5px",
                cursor: onUseSkill ? "pointer" : "default",
                opacity: onUseSkill ? 1 : 0.4,
              }}
            >
              {skill.emoji}
            </button>
          ))}
        </div>
      )}
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
    gap: "16px",
    padding: "16px",
    position: "relative",
  },
  scoreBoard: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    alignItems: "center",
    width: "100%",
    maxWidth: "560px",
    justifyContent: "center",
  },
  matchInfo: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  vsSmall: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "10px",
    color: "rgba(255,255,255,0.4)",
  },
  matchCountText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
    color: "#ffd700",
  },
  bestOf: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "6px",
    color: "rgba(255,255,255,0.3)",
  },
  turnIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.06)",
    padding: "8px 18px",
    borderRadius: "30px",
    border: "1px solid",
    transition: "all 0.3s ease",
  },
  turnText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "8px",
  },
  statusMsg: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
    color: "#ffd700",
    textAlign: "center",
    padding: "0 16px",
  },
  boardWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "20px",
  },
  characterSide: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  playerNameSide: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    background: "rgba(0,0,0,0.2)",
    padding: "12px",
    borderRadius: "16px",
  },
  mobileCharRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: "320px",
    marginTop: "4px",
  },
  mobileCharItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    backdropFilter: "blur(4px)",
  },
  overlayCard: {
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    border: "2px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "32px 28px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    maxWidth: "340px",
    width: "90%",
  },
  overlayTitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "clamp(14px, 4vw, 20px)",
    color: "#ffd700",
    letterSpacing: "2px",
  },
  overlaySub: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "8px",
    color: "#ffffff",
  },
  punishmentBox: {
    background: "rgba(255,107,157,0.15)",
    border: "1px solid rgba(255,107,157,0.4)",
    borderRadius: "12px",
    padding: "14px 18px",
    maxWidth: "280px",
  },
  punishmentText: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    color: "#ff6b9d",
    lineHeight: "1.8",
  },
  skillBox: {
    background: "rgba(107,157,255,0.15)",
    border: "1px solid rgba(107,157,255,0.4)",
    borderRadius: "12px",
    padding: "14px 18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    maxWidth: "280px",
  },
  skillName: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "10px",
    color: "#6b9dff",
  },
  skillDesc: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "7px",
    color: "#aaaaaa",
    lineHeight: "1.6",
    textAlign: "center",
  },
  overlayButton: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: "9px",
    padding: "12px 24px",
    background: "linear-gradient(135deg, #ff6b9d, #ff8e53)",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    cursor: "pointer",
    letterSpacing: "1px",
    marginTop: "6px",
  },
  skipButton: {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: "9px",
  padding: "12px 24px",
  background: "rgba(255,255,255,0.08)",
  border: "2px solid rgba(255,255,255,0.2)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.6)",
  cursor: "pointer",
  letterSpacing: "1px",
  marginTop: "0px",
},
};