import { forwardRef, useImperativeHandle } from "react";
import { Seat } from "@/types/seat";
import { AlgorithmType } from "@/types/algorithm";

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
    console.log(`${matrix.length} and ${partySize}`);
    return [];
  };

  return <h1>Hey, it is Algo-bot. Beep. Boop!</h1>;
});

SeatingAlgorithm.displayName = "SeatingAlgorithm";

export default SeatingAlgorithm;
