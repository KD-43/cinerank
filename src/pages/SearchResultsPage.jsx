import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import SearchFunction from '../components/SearchbarFunction';
import AppVersion from '../components/DevVersion';
import AuthenticateModal from '../components/AuthenticateModal';

function SearchResultsPage () {

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    const [ searchParams ] = useSearchParams();
    const query = searchParams.get('query');
    const { data, isLoading, error } = useFetch(`/api/search/movie?query=${encodeURIComponent(query)}`);

    useEffect(() => {
        if (query) {
            console.log(`Fetching results for: ${query}`);
        }

        // useFetch(`/api/search/movie?query=${encodeURIComponent(query)}`);

    }, [query]);

    if (isLoading) {
        return <div className='text-center'><div className='spinner-border'></div></div>
    }

    if (error) {
        return <div className='alert alert-danger'>Error fetching movies: {error}</div>
    }

    return (
        <>
            <div className="parent">
                <header>
                    <Link to={"/"} className="text-decoration-none">
                        <AppVersion />
                    </Link>
                    <div className="container d-flex justify-content-between">
                        <AuthenticateModal />
                        <SearchFunction />
                    </div>
                </header>
                <main>
                    <div className="container">
                        <h2>Search Results for: "{query}"</h2>
                        <div className="row g-2">
                            {data.results.map(movie => (
                                <div key={movie.id} className="col-6 col-md-4 col-lg-2">
                                    <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                                        <div className="card h-100 shadow-sm">
                                            <img src={`${imageBaseUrl}${movie.poster_path}`} className="card-img-top" alt={`Poster for ${movie.title}`} />
                                            <div className="card-body">
                                                <h6 className="card-title">{movie.title}</h6>
                                                <p className="card-text text-muted">Released: {movie.release_date}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default SearchResultsPage;