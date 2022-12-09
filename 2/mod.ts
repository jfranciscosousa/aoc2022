import { _ } from "../deps.ts";

type Play = "rock" | "paper" | "scissor";

interface Round {
  opponent: Play;
  self: Play;
}

const OPPONENT_PLAYS: Record<string, Play> = {
  A: "rock",
  B: "paper",
  C: "scissor",
};

const SELF_PLAYS: Record<string, Play> = {
  X: "rock",
  Y: "paper",
  Z: "scissor",
};

const input = Deno.readTextFileSync("2/input");
const rounds: Round[] = _.compact(
  input.split("\n").map((unparsedRound) => {
    const [opponent, self] = unparsedRound.split(" ");

    // Ignore empty stuff
    if (!opponent || !self) return;

    return {
      opponent: OPPONENT_PLAYS[opponent],
      self: SELF_PLAYS[self],
    };
  })
);

function calculateScore(round: Round) {
  let score = 0;

  if (round.self == "rock") score += 1;
  if (round.self == "paper") score += 2;
  if (round.self == "scissor") score += 3;

  // Draw
  if (round.self == round.opponent) return score + 3;
  // We win with rock
  if (round.self == "rock" && round.opponent == "scissor") return score + 6;
  // We win with paper
  if (round.self == "paper" && round.opponent == "rock") return score + 6;
  // We win with scissor
  if (round.self == "scissor" && round.opponent == "paper") return score + 6;

  // We lose
  return score;
}

const scores = rounds.map(calculateScore);
const totalScore = _.sum(scores);

console.log(`Total score (part 1): ${totalScore}`);

// Part 2

type Outcome = "loss" | "draw" | "win";

interface UnplayedRound {
  opponent: Play;
  outcome: Outcome;
}

const OUTCOMES: Record<string, Outcome> = {
  X: "loss",
  Y: "draw",
  Z: "win",
};

const unplayedRounds: UnplayedRound[] = _.compact(
  input.split("\n").map((unparsedRound) => {
    const [opponent, self] = unparsedRound.split(" ");

    // Ignore empty stuff
    if (!opponent || !self) return;

    return {
      opponent: OPPONENT_PLAYS[opponent],
      outcome: OUTCOMES[self],
    };
  })
);

function playRound({ opponent, outcome }: UnplayedRound): Round {
  // If draw, play the same as the opponent
  if (outcome === "draw") {
    return { opponent, self: opponent };
  }

  if (outcome === "win") {
    if (opponent === "rock") return { opponent, self: "paper" };
    if (opponent === "paper") return { opponent, self: "scissor" };
    return { opponent, self: "rock" };
  }

  // If it's a loss, just lose lol

  if (opponent === "rock") return { opponent, self: "scissor" };
  if (opponent === "paper") return { opponent, self: "rock" };

  return { opponent, self: "paper" };
}

const roundsAfterPlaying: Round[] = unplayedRounds.map(playRound);
const scoresAfterPlaying = roundsAfterPlaying.map(calculateScore);
const totalScoreAfterPlaying = _.sum(scoresAfterPlaying);

console.log(`Total score (part 2): ${totalScoreAfterPlaying}`);
