import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import { ArrowUpRightSquare, Trash, TrashFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ModalComponent } from './ControlledModal';

export function TierListManager ({userId}) {
    const [ userLists, setUserLists ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const shortId = userId.substring(0, 4);
    const [ isOverDeleteIcon, setIsOverDeleteIcon ] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const [ listToDelete, setListToDelete ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/tierlists/${userId}`);
                if (!response.ok) throw new Error('Failed to load user data');
                const data = await response.json();
                setUserLists(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLists();
 
    }, [userId]);

    if (isLoading) {
        return (
            <div className="loadingSpinner_wrapper">
                <div class="spinner-border text-light" role="status" style={{width: 3 + 'rem', height: 3 + 'rem'}}>
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (userLists) {
        console.log('Current User lists',userLists);
    }

    const handleShowModal = (listId) => {
        setListToDelete(listId);
        console.log("listId to delete:", listId);
        setShowModal(true)
    };
    const handleCloseModal = () => {
        setShowModal(false)
        setListToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!listToDelete) return;
        console.log("List to delete: ", listToDelete);
        try {
            const response = await fetch(`/api/tierlists/${userId}/${listToDelete}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete the list on the server.');
            }
            setUserLists(prevLists => {
                return prevLists.filter(list => list.id !== listToDelete);
            });
        } catch (err) {
            console.log(err)
        } finally {
            handleCloseModal();
        }
    }

    // const deleteActive = showModal && listToDelete ? { backgroundColor: '#dc3545', color: '#f8f9fa', borderColor: '#dc3545' }: null;
    // const deleteActive = showModal && listToDelete ? "deleteActive": null;

    return (
        <div className="container">
            <div className="d-flex justify-content-between text-light">
                <h3 className='fw-bold fs-2'>Your Saved Tier Lists</h3>
                {userLists.length > 0 && (
                    <div className="d-inline-flex">
                        <Link to={`/user/${shortId}/tierlist/new`} className="text-decoration-none">
                            <Button variant={'primary'}>
                                Create <ArrowUpRightSquare size={24} />
                            </Button>
                        </Link>
                    </div>)
                }
            </div>

            {!userLists || userLists.length === 0 ? 
                (
                    <div className="tierListStarter_wrapper d-flex flex-column align-items-center justify-content-center">
                        <h5 className="text-gray-100">Looks like you don't have any lists. Create one!</h5>
                        <Button className='mt-3' size='lg' variant={'primary'} onClick={() => navigate(`/user/${shortId}/tierlist/new`)}>
                            Create <ArrowUpRightSquare size={24} />
                        </Button>
                    </div>
                ) 
                :
                (
                    <>
                        <div className="card bg-transparent border-0 pt-4">
                            <ul className="list-group bg-transparent">
                                <li className="list-group-item bg-transparent border-0 text-light">
                                    <div className="row">
                                        <div className="col-11">
                                            <div className="row">
                                                <div className="col">Name</div>
                                                <div className="col">Description</div>
                                                <div className="col">Updated</div>
                                            </div>
                                        </div>
                                        <div className="col-1"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="card userTierLists_wrapper">
                            <ul className="list-group">
                                {userLists && userLists.map((list) =>
                                        <>
                                            <li id={list.id} key={list.id} className={`list-group-item tierListManager_listItem`} onClick={() => navigate(`/user/${shortId}/tierlist/${list.id}`)}>
                                                <div className="row">
                                                    <div className="col-11">
                                                        <div className="row">
                                                            <div className="col m-0">{list.title}</div>
                                                            <div className="col m-0">{list.description}</div>
                                                            {list.lastUpdated ? <div className="col m-0">{new Date(list.lastUpdated).toLocaleString()}</div> : <div className="col m-0">{new Date(list.dateCreated).toLocaleString()}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-1">
                                                        <div className="deleteIcon_wrapper" onClick={(e) => {e.stopPropagation(); handleShowModal(list.id);}}>
                                                            <Trash className='svg-black deleteIcon_idle' size={24} />
                                                            <TrashFill className="svg-white deleteIcon_hover" size={24} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </>
                                    )
                                }
                        
                            </ul>
                        </div>

                        <ModalComponent
                            show={showModal}
                            onHide={handleCloseModal}
                            onConfirm={handleConfirmDelete}
                            title={'Deleting Tier List'}
                            children={'Are you sure you want to delete?'}
                        />
                    </>
                )
            }
        </div>
    )
}