import React, { useState, useEffect, memo } from 'react';
import '../../node_modules/bootstrap/scss/bootstrap.scss'
import { useFetch } from '../hooks/useFetch';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { PersonCircle, PlusCircle } from 'react-bootstrap-icons';
import FetchPopular from '../components/FetchPopular';
import FetchTrending from '../components/FetchTrending';
import AuthenticateModal from '../components/AuthenticateModal';
import { ErrorBoundary } from 'react-error-boundary';
import SearchFunction from '../components/SearchbarFunction';
import AppVersion from '../components/DevVersion';
import { TierListManager } from '../components/TierListManager';
import TierListContainer from '../components/TierListContainer';
import TierList from '../components/TierList';
import { getAnonUserId } from '../utils/userSession';
import { SearchMedia } from '../components/SearchMediaComponent';
import { useAdvStateManager } from '../hooks/useUndo';
import { useModify } from '../hooks/useModify';

const Home = memo(function HomePage () {

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    const [ visible, setVisible ] = useState(false);
    const [ isCreateButtonVisible, setIsCreateButtonVisible ] = useState(false); // set back to true for production
    const [ isTierListVisible, setIsTierListVisible ] = useState(false); //set to false on production please
    const [ movies, setMovies ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ isFormType, setFormType ] = useState('default');
    const [ isInput, setInput ] = useState('');
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isQuickSignIn, setIsQuickSignIn ] = useState(false);

    const userId = getAnonUserId();
    const navigate = useNavigate();

    const handleNavigate = (event) => {
        const nodeId = event.target.id;
        if (nodeId && nodeId !== null && nodeId !== undefined) {
            switch(nodeId) {
                case '_home':
                    navigate('/');
                    break;
                case '_template':
                    navigate('/');
                    break;
                default:
                    console.log("It works!");
            };
        }
    }

    const handleUserLogIn = () => {
        setIsLoggedIn(true);
        const id = userId;

        return id;
    }

    const handleUserLogOut = () => {
        setIsLoggedIn(false);
    }
    
    const handleInputChange = (newValue) => {
        console.log("Input Changed", newValue);
        setInput(newValue);
    }

    const handleCreateTierListButton = () => {
        setIsCreateButtonVisible(false);
        setIsTierListVisible(true);
    }

    const hideTierList = () => {
        setIsTierListVisible(false);
        setIsCreateButtonVisible(true);
    }

    // const handleClose = () => setVisible(false);
    // const handleOpen = () => setVisible(true);
    

    // useEffect(() => {
    //     const fetchTrendingMovies = async () => {
    //         try {
    //             setIsLoading(true);
    //             setError(null);

    //             const response = await fetch('/api/trending/movie/day');

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }

    //             const data = await response.json();

    //             setMovies(data.results);

    //         } catch (err) {
    //             setError(err.message);
    //             console.error("Failed to fetch trending movies:", err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }

    //     fetchTrendingMovies();
        
    // }, []);

    // useEffect(() => {
    //     const fetchTrendingMovies = async () => {
    //         try {
    //             setIsLoading(true);
    //             setError(null);

    //             const response = await fetch('/api/trending/movie/day');

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }

    //             const data = await response.json();

    //             setMovies(data.results.slice(0, 12));

    //         } catch (err) {
    //             setError(err.message);
    //             console.error("Failed to fetch trending movies:", err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }

    //     fetchTrendingMovies();
        
    // }, []);

    console.log(movies);
    
    return (
        <>
            <ErrorBoundary fallbackRender={<div>An error occurred here</div>}>
                
                <div className="parent">

                    <div className="leftSide">
                        <div className="container pt-5">
                            <Link to={'/'} className={"text-decoration-none m-0"}>
                                <h3 className="text-light type-karasuma-Black m-0 mb-4 ">CineRank</h3>
                            </Link>
                            <div className="d-flex flex-column align-items-center">
                                <PersonCircle size={48} color={"white"} className="mb-1" />
                                <div className="userIdDisplay">
                                    <h5 className='text-light'>{`User: ${userId.substring(0, 4)}`}</h5>
                                </div>
                            </div>

                            <div className="userOptions d-flex flex-column pt-5">
                                <Button onClick={handleNavigate} id="_home" active variant="secondary" className='mb-3'>Personal Lists</Button>
                                <Button disabled onClick={handleNavigate} id="_template" variant="secondary" className='mb-3'>Template Lists</Button>
                            </div>
                    
                        </div>
                    </div>

                    <main className="d-flex justify-content-center pt-5 ps-5 pe-5">
                        {isCreateButtonVisible ? 
                            (<Button variant={"outline-dark"} onClick={handleCreateTierListButton} className='align-self-center'>
                                <div className="d-inline-flex align-items-center gap-2">
                                    <PlusCircle size={64} className="svg-gray-700" />
                                    <h4 className="text-gray-700 mb-0">Create a Tier List</h4>
                                </div>
                            </Button>):
                            // <TierList onOpen={isTierListVisible} onClose={hideTierList} />
                            // <TierListContainer />
                            <TierListManager userId={userId} />
                        }

                        {/* {isLoggedIn &&
                            (<TierListManager userId={userId} />)
                        } */}

                        {/* <TierList onOpen={isTierListVisible} onClose={hideTierList} /> */}

                    </main>

                </div>
                
            </ErrorBoundary >
        </>
    );
})

export default Home