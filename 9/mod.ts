import { _ } from "../deps.ts";

class Knot {
  x = 0;
  y = 0;

  get pos(): [number, number] {
    return [this.x, this.y];
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

class Head extends Knot {
  step(direction: string) {
    switch (direction) {
      case "U":
        this.y += 1;
        break;
      case "D":
        this.y -= 1;
        break;
      case "L":
        this.x -= 1;
        break;
      case "R":
        this.x += 1;
        break;
    }
  }
}

class Tail extends Knot {
  history = new Set<String>();

  follow(pos: [number, number]) {
    const [x, y] = pos;
    const distX = x - this.x;
    const distY = y - this.y;
    if (Math.abs(distX) === 2 && !distY) {
      // Move horizontally
      const xv = distX > 0 ? 1 : -1;
      this.x += xv;
    } else if (Math.abs(distY) === 2 && !distX) {
      // Move vertically
      const yv = distY > 0 ? 1 : -1;
      this.y += yv;
    } else if (
      (Math.abs(distY) === 2 && [1, 2].includes(Math.abs(distX))) ||
      (Math.abs(distX) === 2 && [1, 2].includes(Math.abs(distY)))
    ) {
      // Follow diagonally
      const xv = distX > 0 ? 1 : -1;
      this.x += xv;
      const yv = distY > 0 ? 1 : -1;
      this.y += yv;
    }
    this.history.add(this.toString());
  }
}

const head = new Head();
const tail = new Tail();

const directions = Deno.readTextFileSync("9/input")
  .split("\n")
  .filter((l) => !!l)
  .map(_.trim);

for (const direction of directions) {
  const [dir, steps] = direction.split(" ");
  for (let i = 0; i < parseInt(steps); i++) {
    head.step(dir);
    tail.follow(head.pos);
  }
}
console.log(`Final result(part1): ${tail.history.size}`);

// Part 2
const head2 = new Head();
const tails = [...Array(9)].map(() => new Tail());

for (const direction of directions) {
  const [dir, steps] = direction.split(" ");
  for (let i = 0; i < parseInt(steps); i++) {
    head2.step(dir);
    tails[0].follow(head2.pos);
    for (let j = 1; j < 9; j++) {
      tails[j].follow(tails[j - 1].pos);
    }
  }
}
console.log(`Final result(part2): ${tails[8].history.size}`);
