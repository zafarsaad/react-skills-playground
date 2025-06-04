'use client'

import { useState, useEffect } from 'react'

export default function ClientSideImage() {
    const [pokemonId, setPokemonId] = useState(1);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemonImage = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch pokemon: ${res.status}`);
                }
                const data = await res.json();
                setImageUrl(data.sprites.front_default);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPokemonImage();
    }, [pokemonId]);

    const handleNext = () => {
        setPokemonId(prevId => prevId + 1);
    }

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>Client-Side - Fetch Image by ID</h3>
            {loading && <p>Loading image...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {imageUrl && <img src={imageUrl} alt={`Pokemon ${pokemonId}`} />}
            <button onClick={handleNext} disabled={loading}>
                Next Pokémon
            </button>
        </div>
    );
}