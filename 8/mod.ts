import { _ } from "../deps.ts";

const input = Deno.readTextFileSync("8/input");
const treesMap = _.compact(input.split("\n").map(_.trim)).map((line) =>
  line.split("").map(Number)
);

// Let's assume all arrays of trees are equal
const sizeOfMap = treesMap[0].length;

function isGreaterThanAll(number: number, array: number[]) {
  return array.every((value) => number > value);
}

function calculateVisibleTreesFromEdges() {
  let sum = 0;

  treesMap.forEach((trees, rowIndex) =>
    trees.forEach((tree, columnIndex) => {
      // If the columnIndex is 0 it means the tree is already at the edge
      if (columnIndex === 0) {
        sum += 1;
        return;
      }

      // If the rowIndex is 0 it means the tree is already at the edge
      if (rowIndex === 0) {
        sum += 1;
        return;
      }

      // If the columnIndex is the same as the size of the map (minus 1, arrays start at 0) it's the edge as well
      if (columnIndex === sizeOfMap - 1) {
        sum += 1;
        return;
      }

      // If the rowIndex is the same as the size of the map (minus 1, arrays start at 0) it's the edge as well
      if (rowIndex === sizeOfMap) {
        sum += 1;
        return;
      }

      const treesToTheLeft = trees.slice(0, columnIndex);
      const treesToTheRight = trees.slice(columnIndex + 1);

      // Check if there is a bigger tree to the left or right
      if (
        isGreaterThanAll(tree, treesToTheLeft) ||
        isGreaterThanAll(tree, treesToTheRight)
      ) {
        sum += 1;
        return;
      }

      const treesToTheTop = _.range(0, rowIndex).map(
        (i) => treesMap[i][columnIndex]
      );
      const treesToTheBottom = _.range(rowIndex + 1, sizeOfMap).map(
        (i) => treesMap[i][columnIndex]
      );

      // Same deal
      if (
        isGreaterThanAll(tree, treesToTheTop) ||
        isGreaterThanAll(tree, treesToTheBottom)
      ) {
        sum += 1;
        return;
      }
    })
  );

  return sum;
}

function calculateViewingDistance(tree: number, treesNextToIt: number[]) {
  if (!treesNextToIt.length) return 0;

  let count = 0;

  treesNextToIt.some((t) => {
    count += 1;

    // Break the some loop if we hit a tree that is same or greater height
    return tree <= t;
  });

  return count;
}

function calculateHighestScenicScorePossible() {
  const scores = _.cloneDeep(treesMap);

  treesMap.forEach((trees, rowIndex) =>
    trees.forEach((tree, columnIndex) => {
      // If we are at the edge, ignore
      if (
        columnIndex === 0 ||
        rowIndex === 0 ||
        columnIndex === sizeOfMap - 1 ||
        rowIndex === sizeOfMap - 1
      ) {
        scores[rowIndex][columnIndex] = 0;
        return;
      }

      // Reverse the top trees to mantain order of the matrix
      const treesToTheLeft = trees.slice(0, columnIndex).reverse();
      const treesToTheRight = trees.slice(columnIndex + 1);
      // Reverse the top trees to mantain order of the matrix
      const treesToTheTop = _.range(0, rowIndex)
        .map((i) => treesMap[i][columnIndex])
        .reverse();
      const treesToTheBottom = _.range(rowIndex + 1, sizeOfMap).map(
        (i) => treesMap[i][columnIndex]
      );
      const viewingDistanceLeft = calculateViewingDistance(
        tree,
        treesToTheLeft
      );
      const viewingDistanceRight = calculateViewingDistance(
        tree,
        treesToTheRight
      );
      const viewingDistanceTop = calculateViewingDistance(tree, treesToTheTop);
      const viewingDistanceBottom = calculateViewingDistance(
        tree,
        treesToTheBottom
      );

      scores[rowIndex][columnIndex] =
        viewingDistanceLeft *
        viewingDistanceRight *
        viewingDistanceTop *
        viewingDistanceBottom;
    })
  );

  return _.max(_.flattenDeep(scores));
}

console.log(`Final result (part1): ${calculateVisibleTreesFromEdges()}`);
console.log(`Final result (part2): ${calculateHighestScenicScorePossible()}`);
