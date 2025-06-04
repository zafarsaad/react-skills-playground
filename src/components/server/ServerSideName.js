import React from 'react';

async function fetchPokemonData(pokemonName) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        if (!res.ok) {
            throw new Error('Failed to fetch pokemon');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching pokemon data:', error);
        return null;
    }
}

export default async function ServerSideName({ pokemonName }) {
    const pokemonData = await fetchPokemonData(pokemonName);

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>Server-Side - Fetch by Name</h3>
            {pokemonData ? (
                <p>Name: {pokemonData.name}</p>
            ) : (
                <p style={{ color: 'red' }}>Failed to load Pokémon data for {pokemonName}.</p>
            )}
        </div>
    );
}