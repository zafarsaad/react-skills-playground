"use client";

import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import { useRequestStore } from "@/lib/store/requestStore";

export default function RestDemo() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [query, setQuery] = useState("");

  const addRequest = useRequestStore((state) => state.addRequest);

  const fetchPokemon = async () => {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Pokemon not found!");
      const data = await res.json();
      setPokemon(data);
      addRequest({
        type: "REST",
        endpoint: `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(error);
      setPokemon(null);
    }
  };

  return (
    <div>
      <h2>REST API Demo</h2>
      <input
        style={{
          border: "1px solid white",
          padding: "2px",
          marginRight: "5px",
        }}
        type="text"
        placeholder="Enter Pokémon name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={fetchPokemon}
        style={{ background: "orange", borderRadius: "5px", padding: "2px" }}
      >
        Search
      </button>
      {pokemon && (
        <div>
          <h3>{pokemon.name}</h3>
          <Image
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={150}
            height={150}
          />
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
        </div>
      )}
    </div>
  );
}
