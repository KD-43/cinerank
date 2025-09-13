import React, { useState, useEffect } from 'react';
import { TierListManager } from '../components/TierListManager';
import { ErrorBoundary } from 'react-error-boundary';

export default function Profile ({userId}) {
    const shortId = userId.substring(0, 4);

    return (
        <>
            <ErrorBoundary fallbackRender={<div>An error occurred here</div>}>
                
                <div className="parent">
                    <header>
                        <Link to={"/"} className="text-decoration-none">
                            <AppVersion />
                        </Link>
                        <div className="d-flex justify-content-between">
                            <h3 className="text-light ps-3">Guest {shortId}'s lists</h3>
                            {/* <div className="d-inline-flex">
                                <SearchFunction />
                            </div> */}
                        </div>
                    </header>

                    <div className="leftSide ps-4 pe-4">
                        <div className="container pt-5">
                            <div className="d-flex flex-column align-items-center">
                                <PersonCircle size={64} color={"white"} />
                                <h5 className='text-light'>Guest {shortId}</h5>
                                <AuthenticateModal handleLoggedIn={handleUserLogIn} handleLoggedOut={handleUserLogOut} isLoggedIn={isLoggedIn} />
                            </div>

                            <div className="d-flex flex-column pt-5">
                                <Button variant="secondary" className='mb-3'>Personal Lists</Button>
                                <Button variant="secondary" className='mb-3'>Template Lists</Button>
                            </div>
                    
                        </div>
                    </div>

                    <main className="d-flex align-items-center justify-content-center ps-5 pe-5">

                        {!isLoggedIn ? 
                            (<Button variant={"outline-dark"} onClick={handleCreateTierListButton}>
                                <div className="d-inline-flex align-items-center gap-2">
                                    <PlusCircle size={64} className="svg-gray-700" />
                                    <h4 className="text-gray-700 mb-0">Create a Tier List</h4>
                                </div>
                            </Button>)
                            :
                            (<TierListManager userId={userId} />)
                        }

                        

                        <TierList onOpen={isTierListVisible} onClose={hideTierList} />

                    </main>

                </div>
                
            </ErrorBoundary >
        </>
    );
}