import { _ } from "../deps.ts";

const input = Deno.readTextFileSync("10/input")
  .split("\n")
  .filter((l) => !!l)
  .map(_.trim);

abstract class Instruction<T = unknown> {
  public abstract readonly cycles: number;
  public readonly payload: T;

  constructor(payload: T) {
    this.payload = payload;
  }
}

class Noop extends Instruction<void> {
  cycles = 1;
}

class Addx extends Instruction<{ value: number }> {
  cycles = 2;
}

function parseInstructions(lines: string[]): Instruction[] {
  return _.compact(
    lines.map((line) => {
      const matchNoop = line.match(/^noop/);

      if (matchNoop) return new Noop();

      const matchAddx = line.match(/^addx (.*)$/);

      if (matchAddx) return new Addx({ value: Number(matchAddx[1]) });

      return null;
    })
  );
}

function computeSignalStrength(instructions: Instruction[]) {
  let currentCycle = 1;
  let currentSignalStrength = 1;
  const state: number[] = [];

  instructions.forEach((instruction) => {
    if (instruction instanceof Noop) {
      state[currentCycle] = currentSignalStrength * currentCycle;
      currentCycle += 1;
    } else if (instruction instanceof Addx) {
      state[currentCycle] = currentSignalStrength * currentCycle;
      state[currentCycle + 1] = currentSignalStrength * (currentCycle + 1);
      currentCycle += 2;
      currentSignalStrength += instruction.payload.value;
    }
  });

  return state;
}

const instructions = parseInstructions(input);
const computedState = computeSignalStrength(instructions);

console.log(
  `Signal strength (part1): ${
    computedState[20] +
    computedState[60] +
    computedState[100] +
    computedState[140] +
    computedState[180] +
    computedState[220]
  }`
);

function drawInstructions(instructions: Instruction[]) {
  const computedState = computeSignalStrength(instructions);
  const crt = _.range(0, 6).map(() => _.range(0, 40).map(() => "."));

  computedState.forEach((signalStrength, index) => {
    if (index === 0) return;

    const verticalPosition = Math.floor(index / 40);
    const horizontalPosition = (index % 40) - 1;
    const spritePosition = signalStrength / index;
    const validSprite = [
      spritePosition - 1,
      spritePosition,
      spritePosition + 1,
    ].filter((p) => p >= 0);

    if (validSprite.includes(horizontalPosition)) {
      crt[verticalPosition][horizontalPosition] = "#";
    }
  });

  return crt;
}

function prettifyCrt(crt: string[][]) {
  return crt.map((line) => line.join("")).join("\n");
}

console.log(prettifyCrt(drawInstructions(instructions)));
