import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';

function FetchPopular () {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    
    const { data, isLoading, error } = useFetch(`/api/movie/popular`);

    // console.log(data);

    if (isLoading) {
        return <div className='text-center'><div className='spinner-border'></div></div>
    }

    if (error) {
        return <div className='alert alert-danger'>Error fetching popular movies: {error}</div>
    }

    return (
        <ErrorBoundary fallbackRender={<div>An error occurred in FetchPopular Component</div>}>
            <div className="pb-5">
                <h1>Popular Movies Today</h1>
                <div className="row g-4">
                    {data.results.map(movie => (
                        <div key={movie.id} className="col-sm-6 col-md-6 col-lg-1">
                            <div className="card h-100 shadow-sm">
                                <img src={`${imageBaseUrl}${movie.poster_path}`} className="card-img-top" alt={`Poster for ${movie.title}`} />
                                <div className="card-body">
                                    <h6 className="card-title">{movie.title}</h6>
                                    <p className="card-text text-muted">Released: {movie.release_date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            
            </div>
        </ErrorBoundary>
    );
}

export default FetchPopular;