"use client";
import { useState } from "react";
import MainLobby from "./components/MainLobby";
import LobbyScreen from "./games/tictactoe/LobbyScreen";
import CoinFlipScreen from "./games/tictactoe/CoinFlipScreen";
import GameScreen from "./games/tictactoe/GameScreen";
import EndScreen from "./games/tictactoe/EndScreen";

export default function Home() {
  const [screen, setScreen] = useState("main");
  const [selectedGame, setSelectedGame] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [firstPlayer, setFirstPlayer] = useState(null);
  const [finalWinner, setFinalWinner] = useState(null);
  const [finalScores, setFinalScores] = useState(null);
  const [theme, setTheme] = useState(null);

  const handleSelectGame = (gameId) => {
    setSelectedGame(gameId);
    setScreen("lobby");
  };

  const handleLobbyStart = (p1, p2, selectedTheme) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setTheme(selectedTheme);
    setScreen("coinflip");
  };

  const handleFlipDone = (winner) => {
    setFirstPlayer(winner);
    setScreen("game");
  };

  const handleGameEnd = (winner, scores) => {
    setFinalWinner(winner);
    setFinalScores(scores);
    setScreen("end");
  };

  const handlePlayAgain = () => {
    setPlayer1(null);
    setPlayer2(null);
    setFirstPlayer(null);
    setFinalWinner(null);
    setFinalScores(null);
    setTheme(null);
    setScreen("lobby");
  };

  const handleBackToMain = () => {
    setPlayer1(null);
    setPlayer2(null);
    setFirstPlayer(null);
    setFinalWinner(null);
    setFinalScores(null);
    setTheme(null);
    setSelectedGame(null);
    setScreen("main");
  };

  if (screen === "main") return (
    <MainLobby onSelectGame={handleSelectGame} />
  );

  if (screen === "lobby") return (
    <LobbyScreen onStart={handleLobbyStart} onBack={handleBackToMain} />
  );

  if (screen === "coinflip") return (
    <CoinFlipScreen player1={player1} player2={player2} onFlipDone={handleFlipDone} />
  );

  if (screen === "game") return (
    <GameScreen
      player1={player1}
      player2={player2}
      firstPlayer={firstPlayer}
      theme={theme}
      onGameEnd={handleGameEnd}
    />
  );

  if (screen === "end") return (
    <EndScreen
      winner={finalWinner}
      scores={finalScores}
      player1={player1}
      player2={player2}
      onPlayAgain={handlePlayAgain}
      onBackToMain={handleBackToMain}
    />
  );
}