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
    <main className="p-8 space-y-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-orange-400 mb-8">
        Seating Simulation
      </h2>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-orange-300 mb-4">
          Theater Controls
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => handleAddTheater(5, 10)}
          >
            Load a 5x10 Theater
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => handlePopulateRandom(takenChance)}
          >
            Randomly Populate Seats
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => {
              clearHighlights();
              algorithmRef.current?.findSeats();
            }}
          >
            Run Seating Algorithm
          </button>
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-orange-300 mb-4">
          Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Chance of Seat being taken:
            </label>
            <input
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Party Size:
            </label>
            <input
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
          </div>
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-orange-300 mb-4">
          Algorithm Selection
        </h3>
        <div className="flex gap-4">
          {algorithmOptions.map((algo) => (
            <label
              key={algo}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500"
                type="radio"
                name="algorithm"
                value={algo}
                checked={currentAlgo === algo}
                onChange={() => setCurrentAlgo(algo)}
              />
              <span className="text-gray-300">
                {algo.charAt(0).toUpperCase() + algo.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <PokemonParty
          partySize={partySize}
          onPartyGenerated={(returned) => {
            setFetchedPokemon(returned);
          }}
        />
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-orange-300 mb-4">
          Theater Layout
        </h3>
        <div className="flex justify-center w-full">
          <div className="flex flex-col items-center">
            {seatMatrix &&
              seatMatrix.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 mb-2">
                  {row.map((seat, seatIndex) => (
                    <div
                      key={seatIndex}
                      className={`
                        w-12 h-12 flex items-center justify-center rounded-lg
                        ${
                          seat.open
                            ? "border-2 border-dotted border-green-500 bg-gray-700"
                            : "border-2 border-red-500 bg-gray-600"
                        }
                        ${
                          seat.highlighted
                            ? "!border-2 !border-blue-500 !bg-blue-900/30"
                            : ""
                        }
                        transition-all duration-200 ease-in-out
                        hover:scale-105 cursor-pointer
                      `}
                      onClick={() => {
                        console.log(`clicked ${rowIndex}, ${seatIndex}`);
                        handleSeatClick(rowIndex, seatIndex);
                      }}
                    >
                      {seat.pokemon ? (
                        <div className="relative">
                          <Image
                            src={seat.pokemon.image}
                            alt={seat.pokemon.name}
                            width={40}
                            height={40}
                            className="rounded-lg"
                          />
                        </div>
                      ) : seat.open ? (
                        <span className="text-xs text-gray-300">Open</span>
                      ) : (
                        <span className="text-xs text-red-400">X</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-orange-300 mb-4">
          Algorithm Results
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedSeats &&
            selectedSeats.map((seat) => (
              <div
                key={`${seat.row}-${seat.col}`}
                className="bg-gray-700 p-3 rounded-lg"
              >
                Row: {seat.row + 1}, Seat: {seat.col + 1}
              </div>
            ))}
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-orange-300 mb-4">
          Lost Sales
        </h3>
        <div className="space-y-4">
          {lostSalesSet &&
            lostSalesSet.map((set, index) => (
              <div
                key={index}
                className="flex flex-wrap gap-4 p-4 bg-gray-700 rounded-lg"
              >
                {set.map((mon, monIndex) => (
                  <div key={monIndex} className="flex flex-col items-center">
                    <Image
                      src={mon.sprites.front_default}
                      alt={mon.name}
                      width={50}
                      height={50}
                    />
                    <span className="text-sm text-gray-300 mt-1">
                      {mon.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </section>

      <SeatingAlgorithm
        ref={algorithmRef}
        matrix={seatMatrix || []}
        partySize={partySize}
        algorithmType={currentAlgo}
        onSeatsSelected={handleSeatsFound}
      />
    </main>
  );
};

export default Seating;
