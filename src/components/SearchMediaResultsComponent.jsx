import React, { useCallback, useMemo, useEffect, useState } from 'react';
import update from 'immutability-helper';
import Button from 'react-bootstrap/esm/Button';
import { ImageFill } from 'react-bootstrap-icons';

class Card {
    constructor(id, data, label, image) {
        this.id = id;
        this.data = data;
        this.label = label;
        this.image = image;
    }
}

export function SearchResultsRender ({ data, imageBaseUrl, query, addItem, checkItemExists, showResultsText, }) {
    const [ localData, setLocalData ] = useState(data);
    const [ cards, setCards ] = useState();
    const [ localList, setLocalList ] = useState([]);
    const array = [];

    useEffect(() => {
        if (!data) {
            return;
        };

        setLocalData(data);
        console.log('Received data from parent component and updated localData', localData);

    }, [data]);

    useEffect(() => {
        if (localData) {
            showResultsText(true);
        } else {
            showResultsText(false);
        }
    }, [localData]);

    const isTrue = (property, customProp) => {
        if (property === null || property === undefined || property === "") {
            return "N/A";
        };
        
        if (customProp) {
            return property.substring(0, 4);
        }

        return property;
    };

    const customList = useMemo(() => {
        console.log("Assessing localData...");

        if (!localData || !localData.results) {
            return;
        };

        return localData.results.map((item) => ({
            id: item.id,
            internalId: `movie-${item.title.replaceAll(' ', "_")}-${isTrue(item.release_date, true)}`,
            label: item.title,
            release: isTrue(item.release_date),
            synopsis: item.overview,
            image: item.poster_path,
        }));

    }, [localData]);

    

    if (customList) {
        console.log('customList after pushing', customList);
    }

    const handleAddItem = (item) => {
        if (!item) return;
        addItem(item);
    };

    return (
        <>
            <div className="searchResultsRender_wrapper d-flex flex-column gap-2 pe-2">
                {customList && customList.filter(movie => checkItemExists(movie.id) === false).map(movie => (

                        <div key={movie.id} className="resultsCard card shadow-sm">

                            <div className="resultsCardContent_wrapper">
                                <div className="resultsCard_img">
                                    {movie.image && (<img src={`${imageBaseUrl}${movie.image}`} className="img-fluid rounded-start movie-img" alt={`Poster for ${movie.label}`} />)}
                                    {movie.image === null && (
                                        <div className="resultCardImgBgColor">
                                            <ImageFill className="svg-gray-300" size={24} />
                                        </div> 
                                    )}
                                </div>
                                <div className="resultsCard_Info">
                                    <div className="card-body p-0 m-0 ps-2 pe-2">
                                        <h6 className="card-title pt-2 fw-bold">{movie.label}</h6>
                                        <div className="releaseDate d-inline-flex">
                                            <p className="card-text m-0">{movie.release.substring(0, 4)}</p>
                                        </div>
                                    </div>
                                    <div className="d-grid resultsCard_btn">
                                        <Button variant='success' className="rounded-0" size="lg" onClick={() => handleAddItem(movie)}>
                                            <p className='text-light fs-6 m-0 fw-bold'>Add to list</p>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    ))
                }
            </div>
        </>
    )
}