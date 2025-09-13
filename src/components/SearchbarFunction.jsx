import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function SearchFunction () {

    const [ searchTerm, setSearchTerm ] = useState('');
    const navigate = useNavigate();
    function handleClick (event) {
        event.preventDefault();

        if (!searchTerm.trim()) {
            return;
        }

        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <ErrorBoundary fallbackRender={<div>Error in Searchbar Function Component</div>}>

            <div className="input-group">
                <input type="search" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className="form-control" placeholder="Search for a movie" aria-label="Search Bar for finding movies" />
                
                <Button variant="primary" onClick={handleClick}>Search</Button>
            </div>

        </ErrorBoundary>
    )
};