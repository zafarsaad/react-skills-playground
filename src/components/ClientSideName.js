'use client'

import { useState } from 'react'

export default function ClientSideName() {
    const [pokemonName, setPokemonName] = useState('');
    const [pokemonData, setPokemonData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPokemon = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (!res.ok) {
                throw new Error('Failed to fetch pokemon');
            }
            const data = await res.json();
            setPokemonData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchPokemon();
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>Client-Side - Fetch by Name</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={pokemonName}
                    onChange={(e) => setPokemonName(e.target.value)}
                    placeholder="Enter Pokémon name"
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Fetch'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {pokemonData && (
                <div>
                    <p>Name: {pokemonData.name}</p>
                    <p>Height: {pokemonData.height}</p>
                    <p>Weight: {pokemonData.weight}</p>
                </div>
            )}
        </div>
    );
}