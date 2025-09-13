import React from 'react';
import { useFetch } from '../hooks/useFetch';
import Button from 'react-bootstrap/Button';
import { useParams, Link } from 'react-router-dom';
import AuthenticateModal from '../components/AuthenticateModal';
import AppVersion from '../components/DevVersion';

function MovieDetailsPage () {

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    const { movieId } = useParams();

    const { data: movie, isLoading: isMovieLoading, error: movieError } =
        useFetch(movieId ? `/api/movie/${movieId}` : null);

    const { data: credits, isLoading: isCreditsLoading, error: creditsError } =
        useFetch(movieId ? `/api/movie/${movieId}/credits` : null);
    
    // const cast = credits.id;

    if (isMovieLoading) {
        return (
            <div className="text-center"><div className="spinner-border"></div></div>
        )
    }
    if (isCreditsLoading) {
        return (
            <div className="text-center"><div className="spinner-border"></div></div>
        )
    }
    if (movieError) {
        return (
            <div className="alert alert-danger">Error loading movie details: {movieError}</div>
        )
    }
    if (creditsError) {
        return (
            <div className="alert alert-danger">Error loading movie credits: {movieError}</div>
        )
    }
    if (!movie) {
        return (
            <div className="alert alert-warning">Movie not found</div>
        )
    }
    if (!credits) {
        return (
            <div className="alert alert-warning">Movie not found</div>
        )
    }

    const cast = credits.cast;
    console.log(cast);
    
    return (
        <>
            <div className="parent">
                <header>
                    <Link to={"/"} className="text-decoration-none">
                        <AppVersion />
                    </Link>
                    <div className="container d-flex justify-content-between">
                        <AuthenticateModal />
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search for a movie" aria-label="Search Bar for finding movies" />
                            <Button variant="primary">Search</Button>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="container">
                        <div className="row">
                            <div className="col-6 col-lg-3">
                                <img src={`${imageBaseUrl}/${movie.poster_path}`} alt={`Movie Poster for ${movie.title}`} className={"img-fluid"} />
                            </div>
                            <div className="col-6 col-lg-9">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">{movie.title}</h3>
                                        <h6 className="card-subtitle text-body-secondary">Released: {movie.release_date}</h6>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{movie.overview}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row pt-3">
                            <div className="col">
                                <div className="card h-100">
                                    <div className="card-header">
                                        Cast
                                    </div>
                                    <div className="card-body">
                                        {cast ? cast.map((actor) => (
                                            <div key={actor.id}>{actor.name}</div>
                                        )) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default MovieDetailsPage;