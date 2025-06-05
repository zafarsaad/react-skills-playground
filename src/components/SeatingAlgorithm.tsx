import { forwardRef, useImperativeHandle } from "react";
import { Seat } from "@/types/seat";
import { AlgorithmType } from "@/types/algorithm";
import { SelectedSeat } from "@/types/selectedSeat";

type SeatingAlgorithmProps = {
  matrix: Seat[][];
  partySize: number;
  algorithmType: AlgorithmType;
  onSeatsSelected?: (selectedSeats: { row: number; col: number }[]) => void;
};

export type SeatingAlgorithmHandle = {
  findSeats: () => void;
};

const SeatingAlgorithm = forwardRef<
  SeatingAlgorithmHandle,
  SeatingAlgorithmProps
>(({ matrix, partySize, algorithmType, onSeatsSelected }, ref) => {
  useImperativeHandle(ref, () => ({
    findSeats: () => {
      const selectedSeats =
        algorithmType === "simple"
          ? findSimpleSeats(matrix, partySize)
          : findIdealSeats(matrix, partySize);

      onSeatsSelected?.(selectedSeats);
    },
  }));

  const findSimpleSeats = (matrix: Seat[][], partySize: number) => {
    console.log(`findSimpleSeats running with ${matrix.length}, ${partySize}`);
    if (matrix.length === 0) return [];

    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      let l: number = -1;
      for (let r = 0; r < row.length; r++) {
        if (row[r].open === true) {
          if (l === -1) l = r;
          if (r - l + 1 >= partySize) {
            // return { found: true, row: i, start: l, end: r };
            return Array.from({ length: partySize }, (_, index) => ({
              row: i,
              col: l + index,
            }));
            // new data type returned
          }
        } else if (row[r].open === false) {
          l = -1;
        }
      }
    }
    return [];
  };

  const findIdealSeats = (matrix: Seat[][], partySize: number) => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c].open === true) {
          const currPartySelection: SelectedSeat[] = [];
          const visited = new Set<string>();

          if (
            dfsHelper(
              r,
              c,
              partySize,
              currPartySelection,
              visited,
              matrix,
              rows,
              cols
            )
          ) {
            return currPartySelection;
          }
        }
      }
    }
    return [];
  };

  const DFS_DIRECTIONS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // Right, Down, Left, Up

  const dfsHelper = (
    currentRow: number,
    currentCol: number,
    seatsNeeded: number,
    currPartySelection: SelectedSeat[],
    visited: Set<string>,
    matrix: Seat[][],
    rows: number,
    cols: number
  ): boolean => {
    if (seatsNeeded === 0) return true;

    const key = `${currentRow}, ${currentCol}`;
    if (
      currentRow < 0 ||
      currentRow >= rows ||
      currentCol < 0 ||
      currentCol >= cols ||
      !matrix[currentRow][currentCol].open ||
      visited.has(key)
    )
      return false;

    visited.add(key);
    currPartySelection.push({ row: currentRow, col: currentCol });

    for (const [dr, dc] of DFS_DIRECTIONS) {
      if (
        dfsHelper(
          currentRow + dr,
          currentCol + dc,
          seatsNeeded - 1,
          currPartySelection,
          visited,
          matrix,
          rows,
          cols
        )
      ) {
        return true;
      }
    }

    currPartySelection.pop();
    visited.delete(key);
    return false;
  };

  return <h1>Hey, it is Algo-bot. Beep. Boop!</h1>;
});

SeatingAlgorithm.displayName = "SeatingAlgorithm";

export default SeatingAlgorithm;
