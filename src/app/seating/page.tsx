"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { Seat } from "@/types/seat";
import { AlgorithmType } from "@/types/algorithm";
import { SelectedSeat } from "@/types/selectedSeat";
import { Pokemon } from "@/types/pokemon";
import SeatingAlgorithm, {
  SeatingAlgorithmHandle,
} from "@/components/SeatingAlgorithm";
import PokemonParty from "@/components/PokemonParty";
import Image from "next/image";

type Theater = {
  rows: number;
  cols: number;
};

const algorithmOptions: AlgorithmType[] = ["simple", "dfs"];

const Seating = () => {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [seatMatrix, setSeatMatrix] = useState<Seat[][] | null>(null);
  const [takenChance, setTakenChance] = useState<number>(50);

  const [currentAlgo, setCurrentAlgo] = useState<"simple" | "dfs">("simple");
  const [partySize, setPartySize] = useState<number>(3);

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const algorithmRef = useRef<SeatingAlgorithmHandle>(null);

  const [fetchedPokemon, setFetchedPokemon] = useState<Pokemon[]>([]);

  const [lostSalesSet, setLostSalesSet] = useState<Pokemon[][]>([]);

  function handleAddTheater(rows: number, cols: number) {
    const newTheater = {
      rows: rows,
      cols: cols,
    };
    setTheater(newTheater);
  }

  function handleChanceInput(chance: number) {
    setTakenChance(chance);
  }

  function handlePartyInput(partySize: number) {
    setPartySize(partySize);
  }

  function handlePopulateRandom(chance: number) {
    if (!theater) return;
    setSeatMatrix(createSeatMatrix(theater.rows, theater.cols, chance));
  }

  const handleSeatsFound = useCallback(
    (seats: SelectedSeat[]) => {
      if (seats.length > 0 && seatMatrix) {
        const newMatrix = [...seatMatrix];
        seats.forEach((s, index) => {
          if (index < fetchedPokemon.length) {
            newMatrix[s.row][s.col] = {
              open: false,
              highlighted: true,
              pokemon: {
                name: fetchedPokemon[index].name,
                image: fetchedPokemon[index].sprites.front_default,
              },
            };
          }
        });
        setSeatMatrix(newMatrix);
        setSelectedSeats(seats);
      } else {
        handleLostSales(fetchedPokemon);
        setSelectedSeats([]);
      }
    },
    [seatMatrix, fetchedPokemon]
  );

  function handleLostSales(lostParty: Pokemon[]) {
    const moreLost = lostSalesSet;
    moreLost.push(lostParty);
    setLostSalesSet(moreLost);
  }

  const generateMatrix = useCallback(() => {
    if (!theater) {
      console.log("No Theater details");
      return;
    }
    setSeatMatrix(createSeatMatrix(theater.rows, theater.cols));
  }, [theater]);

  useEffect(() => {
    generateMatrix();
  }, [generateMatrix]);

  function handleSeatClick(rowIndex: number, seatIndex: number) {
    if (!seatMatrix) {
      console.log("No seat matrix");
      return;
    }
    const newMatrix: Seat[][] = [...seatMatrix];
    newMatrix[rowIndex][seatIndex].open = !newMatrix[rowIndex][seatIndex].open;
    newMatrix[rowIndex][seatIndex].highlighted = false; // adding a highlight reset
    setSeatMatrix(newMatrix);
  }

  function createSeatMatrix(
    rows: number,
    cols: number,
    chance?: number
  ): Seat[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        open: chance !== undefined ? Math.random() * 100 > chance : true,
        highlighted: false,
      }))
    );
  }

  const clearHighlights = useCallback(() => {
    if (!seatMatrix) return;

    const newMatrix = seatMatrix.map((row) =>
      row.map((seat) => ({ ...seat, highlighted: false }))
    );
    setSeatMatrix(newMatrix);
  }, [seatMatrix]);

  return (
    <main className="p-6 space-y-8">
      <h2 className="text-xl font-semibold">Seating Simulation</h2>
      <section>
        <p>The controls will go here.</p>
      </section>
      <section className="flex">
        <button
          className="bg-gray-700 p-2 rounded m-2"
          onClick={() => handleAddTheater(5, 10)}
        >
          Load a 5x10 Theater!
        </button>
        <button
          className="bg-gray-700 p-2 rounded m-2"
          onClick={() => handlePopulateRandom(takenChance)}
        >
          Randomly populate seats!
        </button>
        <button
          className="bg-gray-700 p-2 rounded m-2"
          onClick={() => {
            clearHighlights();
            algorithmRef.current?.findSeats();
          }}
        >
          Run Seating Algorithm!
        </button>
      </section>
      <section>
        <h3>Chance of Seat being taken:</h3>
        <input
          className="bg-white text-black"
          type="number"
          name="chance"
          placeholder="50"
          value={takenChance}
          onChange={(e) => {
            const value = +e.target.value;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              handleChanceInput(value);
            }
          }}
        />
      </section>
      <section>
        <h3>Party Size:</h3>
        <input
          className="bg-white text-black"
          type="number"
          name="party"
          placeholder="3"
          value={partySize}
          onChange={(e) => {
            const value = +e.target.value;
            if (!isNaN(value) && value >= 0 && value <= 100) {
              handlePartyInput(value);
            }
          }}
        />
      </section>
      <section>
        <h3>Choose algoritm type:</h3>
        {algorithmOptions.map((algo) => (
          <label key={algo} className="flex item-center gap-1">
            <input
              className="bg-white text-red"
              type="radio"
              name="algorithm"
              value={algo}
              checked={currentAlgo === algo}
              onChange={() => setCurrentAlgo(algo)}
            />
            {algo.charAt(0).toUpperCase() + algo.slice(1)}
          </label>
        ))}
      </section>
      <section>
        <PokemonParty
          partySize={partySize}
          onPartyGenerated={(returned) => {
            setFetchedPokemon(returned);
          }}
        />
      </section>
      <section>
        {seatMatrix &&
          seatMatrix.map((row, rowIndex) => {
            return (
              <div key={rowIndex} style={styles.row}>
                {row.map((seat, seatIndex) => {
                  return (
                    <div
                      key={seatIndex}
                      style={{
                        ...styles.seat,
                        ...(seat.open ? styles.seatOpen : styles.seatTaken),
                        ...(seat.highlighted ? styles.seatHighlighted : {}), // added highlighting
                      }}
                      onClick={() => {
                        console.log(`clicked ${rowIndex}, ${seatIndex}`);
                        handleSeatClick(rowIndex, seatIndex);
                      }}
                    >
                      {seat.pokemon ? (
                        <div>
                          <Image
                            src={seat.pokemon.image}
                            alt={seat.pokemon.name}
                            width={50}
                            height={50}
                          />
                        </div>
                      ) : seat.open ? (
                        "Open"
                      ) : (
                        "X"
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </section>
      <section>
        <SeatingAlgorithm
          ref={algorithmRef}
          matrix={seatMatrix || []}
          partySize={partySize}
          algorithmType={currentAlgo}
          onSeatsSelected={handleSeatsFound}
          //   onSeatsSelected={(seats) => {
          //     setSelectedSeats(seats);
          //   }}
        />
      </section>
      <section>
        <h3>Algorithm Results:</h3>
        <div>
          {selectedSeats &&
            selectedSeats.map((seat) => (
              <div key={`${seat.row}-${seat.col}`}>
                Row: {seat.row + 1}, Seat: {seat.col + 1}
              </div>
            ))}
        </div>
      </section>
      <section>
        <h2>Lost Sales</h2>
        {lostSalesSet &&
          lostSalesSet.map((set, index) => (
            <div key={index} className="flex">
              {set.map((mon, monIndex) => (
                <div key={monIndex}>
                  <Image
                    src={mon.sprites.front_default}
                    alt={mon.name}
                    width={50}
                    height={50}
                  />
                </div>
              ))}
            </div>
          ))}
      </section>
    </main>
  );
};

export default Seating;

const styles = {
  row: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "10px",
    marginBottom: "10px",
    // border: "1px dotted blue",
  },
  seat: {
    width: "50px",
    height: "50px",
    border: "1px solid green",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  seatOpen: {
    border: "2px dotted green",
  },
  seatTaken: {
    border: "2px solid red",
  },
  seatHighlighted: {
    border: "2px solid blue",
  },
};
