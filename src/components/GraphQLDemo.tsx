"use client";

import Image from "next/image";
import { useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { useRequestStore } from "@/lib/store/requestStore";

const GraphQLDemo = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [query, setQuery] = useState("");

  const addRequest = useRequestStore((state) => state.addRequest);

  const fetchPokemon = async () => {
    const graphqlQuery = {
      query: `
        query getPokemon($name: String!) {
          pokemon(name: $name) {
            id
            name
            height
            weight
            sprites {
              front_default
            }
          }
        }
      `.trim(),
      variables: {
        name: query.toLowerCase(),
      },
    };

    try {
      const res = await fetch("https://graphql-pokeapi.graphcdn.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });

      // const { data } = await res.json();
      const { data } = await res.json();
      console.log("Response", data);
      setPokemon(data.pokemon);
      addRequest({
        type: "GraphQL",
        endpoint: `https://graphql-pokeapi.graphcdn.app/`,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(error);
      setPokemon(null);
    }
  };

  return (
    <div>
      <h2>GraphQL API Demo</h2>
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
};

export default GraphQLDemo;
