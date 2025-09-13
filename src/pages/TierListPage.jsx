import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import TierListContainer from "../components/TierListContainer";
import { getAnonUserId } from '../utils/userSession';
import { useAdvStateManager } from '../hooks/useUndo';
import { useModify } from '../hooks/useModify';
import update from 'immutability-helper';
import { Link } from 'react-router-dom';
import { useDataManager } from '../hooks/useDataManager';
import { useTierList } from '../hooks/useTierList';
import RightSideComponent from '../components/RightSideComponent';
import { PersonCircle, Search } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/esm/Button';

const basicTierList = {
    id: '',
    title: 'Insert Title',
    rows: [
        { id: 'row-s', label: 'S Tier', color: 'bg-pink-300', items: [] },
        { id: 'row-a', label: 'A Tier', color: 'bg-red-300', items: [] },
        { id: 'row-b', label: 'B Tier', color: 'bg-orange-300', items: [] },
        { id: 'row-c', label: 'C Tier', color: 'bg-yellow-300', items: [] },
    ],
    unranked: [],
};

export default function TierListPage () {
    const { listId } = useParams();
    const navigate = useNavigate();
    const userId = getAnonUserId();
    const shortId = userId.substring(0, 4);

    const isNewList = !listId;
    const apiUrl = isNewList ? null : `/api/tierlists/${userId}/${listId}`;

    const { data: fetchedTierList, isLoading, error, setData: setFetchedTierList } = useFetch(apiUrl);

    const { tierList, actions, checks } = useTierList(isNewList ? basicTierList : fetchedTierList);

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

    const handleSaveNewList = async () => {
        try {
            const response = await fetch(`/api/tierlists/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tierList),
            })

            if (!response.ok) {
                throw new Error('Failed to save list');
            }

            const savedList = await response.json();

            navigate(`/user/${shortId}/tierlist/${savedList.id}`, { replace: true });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateExistingList = async () => {
        try {
            const response = await fetch(`/api/tierlists/${userId}/${listId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tierList),
            })

            if (!response.ok) {
                throw new Error('Failed to save list');
            }

            const savedList = await response.json();

            setFetchedTierList(savedList);
        } catch (err) {
            console.error(err);
        }
    };

    const handleResetList = () => {
        reset(tierList);
    }

    if (isLoading) {
        return (
            <div className="loadingSpinner_wrapper">
                <div class="spinner-border text-light" role="status" style={{width: 3 + 'rem', height: 3 + 'rem'}}>
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    };
    if (error) {
        return <p className='text-light'>There was an error retrieving the tierlist!</p>
    }
    if (!tierList) {
        return <p className='text-light'>initializing TierList</p>
    };
    

    return (
        <>
            <div className="parent">

                <div className="leftSide">
                    <div className="container pt-5">
                        <Link to={'/'} className={"text-decoration-none m-0"}>
                            <h3 className="text-light type-karasuma-Black m-0 mb-4 ">CineRank</h3>
                        </Link>
                        <div className="d-flex flex-column align-items-center">
                            <PersonCircle size={48} color={"white"} className="mb-1" />
                            <div className="userIdDisplay">
                                <h5 className='text-light'>{`User: ${shortId}`}</h5>
                            </div>
                        </div>

                        <div className="userOptions d-flex flex-column pt-5">
                            <Button onClick={handleNavigate} id="_home" variant="secondary" className='mb-3'>Personal Lists</Button>
                            <Button disabled onClick={handleNavigate} id="_template" variant="secondary" className='mb-3'>Template Lists</Button>
                        </div>
                
                    </div>
                </div>
                <main className="main">
                    <TierListContainer
                        tierList={tierList}
                        checks={checks}
                        actions={actions}
                        saveList={handleSaveNewList}
                        updateList={handleUpdateExistingList}
                        isNewList={isNewList}
                        handleResetList={handleResetList}
                    
                    />
                </main>

                <div className="rightSide">
                    <div className="rightSideHeader_wrapper d-flex bg-gray-700 align-items-center justify-content-center pt-4 pb-4 position-relative overflow-hidden">
                        <h4 className="rightSideHeader_title text-light fw-bold m-0 position-absolute">Find Movies</h4>
                        <Search className="rightSideHeader_icon position-absolute svg-gray-600" size={64} />
                    </div>
                    <RightSideComponent checks={checks} actions={actions} />
                </div>
            </div>
        </>
    )
};