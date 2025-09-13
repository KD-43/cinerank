import React, { useEffect, useState, useRef, use, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useFetchExecute } from '../hooks/useFetch';
import { SearchResultsRender } from './SearchMediaResultsComponent';
import { CaretRightFill } from 'react-bootstrap-icons';

export function SearchMedia ({ addItem, checkItemExists }) {

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    const [ searchTerm, setSearchTerm ] = useState('');
    // const { data, isLoading, error } = useFetch(`/api/search/movie?query=${encodeURIComponent(searchTerm)}`);
    const { data, isLoading, error, execute } = useFetchExecute();
    const [ resultsText, setResultsText ] = useState(null);
    const [ isResultsTextVisible, setIsResultsTextVisible ] = useState(false);
    const [ showNoResultsText, setShowNoResultsText ] = useState(false);
    const searchBtnRef = useRef(null);

    useEffect(() => {
        if (searchTerm) {
            console.log(`Fetching results for: ${searchTerm}`);
        }

    }, [searchTerm]);
    
    const handleClick = async () => {
        try {
            console.log('Fetching data...');
            const responseData = await execute(`/api/search/movie?query=${encodeURIComponent(searchTerm)}`);
            setResultsText(searchTerm);
            console.log('Data grabbed for immediate use:', responseData);

        } catch (err) {
            console.error('Failed to fetch data!', err);
        }
    };

    const showResultsText = useCallback((dataAvailable) => {
        if (dataAvailable === true) {
            setIsResultsTextVisible(true);
        } else {
            setIsResultsTextVisible(false);
        }
    });

    // if (isLoading) {
    //     return <div className='text-center'><div className='spinner-border'></div></div>
    // }

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            handleClick();
            e.preventDefault();
        }
    }


    if (error) {
        return <div className='alert alert-danger'>Error fetching movies: {error}</div>
    }

    return (
        <ErrorBoundary fallbackRender={<div>Error in Searchbar Function Component</div>}>

            <div className="searchBar_wrapper d-inline-flex flex-column align-items-center pt-4">
                <div className="searchBar_group">
                    <div className="input-group searchBar">
                        <input id="searchBarActual" type="search" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className="form-control" placeholder="Search for a movie" aria-label="Search Bar for finding movies" onKeyDown={handleSearchEnter} autoComplete='off'/>
                    
                        <Button ref={searchBtnRef} variant="primary" onClick={handleClick}>Search</Button>
                    </div>
                    {isResultsTextVisible && (<div className="d-inline-flex mt-3 pt-2">
                        <CaretRightFill className="text-light align-self-center pe-2" size={20} />
                        <h5 className="text-light align-self-start m-0 fs-6">Search Results for: "{resultsText}"</h5>
                    </div>)}
                </div>
                <br />
                {/* {showNoResultsText && (
                    <h6 className="noResults text-light fw-bold">No results found!</h6>
                )} */}
                {isLoading && (
                    <div className="loadingSpinner_wrapper">
                        <div class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <div className="p-1">
                    <SearchResultsRender
                        data={data}
                        imageBaseUrl={imageBaseUrl}
                        query={searchTerm}
                        addItem={addItem}
                        checkItemExists={checkItemExists}
                        showResultsText={showResultsText}
                    />
                </div>
            </div>

        </ErrorBoundary>
    )
};