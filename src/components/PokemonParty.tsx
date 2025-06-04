"use client";

import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import { useEffect, useState } from "react";

type PokemonParty = {
  partySize: number;
  onPartyGenerated?: (party: Pokemon[]) => void;
};

const PokemonParty = ({ partySize = 0, onPartyGenerated }: PokemonParty) => {
  //   const pokeAPI = `https://pokeapi.co/api/v2/pokemon/`;

  const [currentParty, setCurrentParty] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchPokemon() {
    let calls = partySize;
    const newParty: Pokemon[] = [];

    while (calls) {
      try {
        setIsLoading(true);
        const id = Math.ceil(Math.random() * 100);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error("Couldn't get Pokemon from API");
        const data = await res.json();
        newParty.push(data);
      } catch (error) {
        console.log(`catch block in PokemonParty -> fetchPokemon: ${error}`);
      } finally {
        setIsLoading(false);
      }
      calls--;
    }

    setCurrentParty(newParty);
    onPartyGenerated?.(newParty);
  }

  useEffect(() => {
    fetchPokemon();
  }, [partySize]);

  return (
    <div className="border-orange-500 p-6 m-2 ">
      <h2>Current Party</h2>
      {isLoading && <h3>Loading...</h3>}
      <div className="flex">
        {currentParty &&
          currentParty.map((mon) => (
            <div key={mon.id} className="m-2">
              <h3>{mon.name}</h3>
              <Image
                src={mon.sprites.front_default}
                alt={mon.name}
                width={50}
                height={50}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PokemonParty;
