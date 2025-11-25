import { NextRequest, NextResponse } from 'next/server';

// In-memory game state (for a single game session)
// In production, you might want to use a database or Redis
let gameState = {
  players: [] as string[],
  scores: {} as Record<string, number>,
  gameState: 'lobby' as 'lobby' | 'playing' | 'finished',
  currentQuestionIndex: 0,
  selectedAnswers: {} as Record<string, number>,
};

export async function GET() {
  return NextResponse.json(gameState);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, playerName, answerIndex, questionIndex } = body;

  switch (action) {
    case 'join':
      if (playerName && !gameState.players.includes(playerName)) {
        gameState.players.push(playerName);
        gameState.scores[playerName] = 0;
      }
      break;

    case 'start':
      if (gameState.players.length > 0) {
        gameState.gameState = 'playing';
        gameState.currentQuestionIndex = 0;
        gameState.selectedAnswers = {};
      }
      break;

    case 'answer':
      if (playerName && questionIndex === gameState.currentQuestionIndex) {
        gameState.selectedAnswers[playerName] = answerIndex;
      }
      break;

    case 'nextQuestion':
      gameState.currentQuestionIndex += 1;
      gameState.selectedAnswers = {};
      break;

    case 'updateScore':
      if (playerName) {
        gameState.scores[playerName] = (gameState.scores[playerName] || 0) + 10;
      }
      break;

    case 'finish':
      gameState.gameState = 'finished';
      break;

    case 'reset':
      gameState = {
        players: [],
        scores: {},
        gameState: 'lobby',
        currentQuestionIndex: 0,
        selectedAnswers: {},
      };
      break;
  }

  return NextResponse.json(gameState);
}

