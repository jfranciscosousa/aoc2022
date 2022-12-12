import { _ } from "../deps.ts";

function gcd(a: number, b: number) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

function lcm(numbers: number[]) {
  // Create a variable to store the LCM as we calculate it
  let result = 1;

  // Iterate through each number in the array
  for (const num of numbers) {
    // Calculate the LCM of result and the current number
    result = (result * num) / gcd(result, num);
  }

  // Return the final result
  return result;
}

interface MonkeyArgs {
  monkeyNumber: string;
  items: string;
  operation: string;
  divisibleBy: string;
  ifTrue: string;
  ifFalse: string;
}

class Monkey {
  public monkeyNumber: number;
  private items: number[];
  private operation: string;
  public divisibleBy: number;
  private ifTrue: number;
  private ifFalse: number;
  private numberOfInspections = 0;

  constructor({
    monkeyNumber,
    items,
    operation,
    divisibleBy,
    ifTrue,
    ifFalse,
  }: MonkeyArgs) {
    this.monkeyNumber = Number(monkeyNumber);
    this.items = items.split(",").map(_.trim).map(Number);
    this.operation = operation;
    this.divisibleBy = Number(divisibleBy);
    this.ifTrue = Number(ifTrue);
    this.ifFalse = Number(ifFalse);
  }

  performOperation(old: number) {
    return eval(this.operation.replaceAll("old", String(old)));
  }

  performTest(worryLevel: number) {
    return worryLevel % this.divisibleBy === 0 ? this.ifTrue : this.ifFalse;
  }

  inspectItem(): number | undefined {
    if (this.items.length === 0) return;

    const [item, ...restOfItems] = this.items;

    this.items = restOfItems;
    this.numberOfInspections += 1;

    return item;
  }

  get inspections() {
    return this.numberOfInspections;
  }

  addItem(item: number) {
    this.items.push(item);
  }

  hasItems() {
    return this.items.length > 0;
  }
}

function parseNotes() {
  const input = Deno.readTextFileSync("11/input")
    .split("\n")
    .filter((l) => !!l)
    .map(_.trim);
  const monkeys: Monkey[] = [];
  let currentMonkeyData: Partial<MonkeyArgs> = {};

  input.forEach((input) => {
    const noteStartMatch = input.match(/^Monkey (\d+):$/);

    if (noteStartMatch) {
      if (Object.keys(currentMonkeyData).length > 0) {
        monkeys.push(new Monkey(currentMonkeyData as MonkeyArgs));
        currentMonkeyData = {};
      }

      currentMonkeyData.monkeyNumber = noteStartMatch[1];
      return;
    }

    const startingItemsMatch = input.match(/^Starting items: ([\d, ]+)$/);

    if (startingItemsMatch) {
      currentMonkeyData.items = startingItemsMatch[1];
      return;
    }

    const operationMatch = input.match(
      /^Operation: new = ((old|\d+) (\*|\+) (old|\d+))$/
    );

    if (operationMatch) {
      currentMonkeyData.operation = operationMatch[1];
      return;
    }

    const testMatch = input.match(/^Test: divisible by (\d+)$/);
    if (testMatch) {
      currentMonkeyData.divisibleBy = testMatch[1];
      return;
    }

    const ifTrueMatch = input.match(/^If true: throw to monkey (\d+)$/);
    if (ifTrueMatch) {
      currentMonkeyData.ifTrue = ifTrueMatch[1];
      return;
    }

    const ifFalseMatch = input.match(/^If false: throw to monkey (\d+)$/);
    if (ifFalseMatch) {
      currentMonkeyData.ifFalse = ifFalseMatch[1];
      return;
    }
  });

  monkeys.push(new Monkey(currentMonkeyData as MonkeyArgs));

  return monkeys;
}

function performPart1() {
  const monkeys = parseNotes();

  let worryLevel = 0;

  _.range(0, 20).forEach(() => {
    monkeys.forEach((note) => {
      while (note.hasItems) {
        const item = note.inspectItem();

        if (!item) return;

        worryLevel = item;
        worryLevel = note.performOperation(worryLevel);
        worryLevel = Math.floor(worryLevel / 3);

        const monkeyToThrow = note.performTest(worryLevel);

        monkeys
          .find((note) => note.monkeyNumber === monkeyToThrow)
          ?.addItem(worryLevel);
      }
    });
  });

  const monkeysOrderedByInspetions = monkeys.sort(
    (a, b) => b.inspections - a.inspections
  );

  return (
    monkeysOrderedByInspetions[0].inspections *
    monkeysOrderedByInspetions[1].inspections
  );
}

console.log(`Final result (part1): ${performPart1()}`);

function performPart2() {
  const monkeys = parseNotes();

  let worryLevel = 0;
  let commonMultiple = 1;
  monkeys.forEach((monkey) => {
    commonMultiple *= monkey.divisibleBy;
  });

  _.range(0, 10000).forEach(() => {
    monkeys.forEach((note) => {
      while (note.hasItems) {
        const item = note.inspectItem();

        if (!item) return;

        worryLevel = item;
        worryLevel = note.performOperation(worryLevel);
        worryLevel = worryLevel % commonMultiple;

        const monkeyToThrow = note.performTest(worryLevel);

        monkeys
          .find((note) => note.monkeyNumber === monkeyToThrow)
          ?.addItem(worryLevel);
      }
    });
  });

  const monkeysOrderedByInspetions = monkeys.sort(
    (a, b) => b.inspections - a.inspections
  );

  return (
    monkeysOrderedByInspetions[0].inspections *
    monkeysOrderedByInspetions[1].inspections
  );
}

console.log(`Final result (part2): ${performPart2()}`);
