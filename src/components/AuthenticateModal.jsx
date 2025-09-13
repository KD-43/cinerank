import React, { useState } from 'react';
import LogIn from './LogInComponent';
import Form from '../../node_modules/react-bootstrap/Form'
import Button from '../../node_modules/react-bootstrap/Button';

export default function AuthenticateModal ({ handleLoggedIn, handleLoggedOut, isLoggedIn }) {
    const [ authView, setAuthView ] = useState('logIn');

    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const openModal = () => {
        setAuthView('logIn');
        setIsModalOpen(true);

    };
    
    const closeModal = () => setIsModalOpen(false);

    const handleSwitchFormType = () => {
        console.log("Switching Form Type!");
        setAuthView('createAccount');
    };

    // const modalFooter = () => {

    //     return (
    //         <>
    //             <Button variant="success" type="submit">
    //                 {authView === 'signIn' ? 'Sign In' : 'Create Account'}
    //             </Button>
    //         </>
    //     )
    // }

    return (
        <div className="">
            {!isLoggedIn ? (<Button variant="primary" onClick={openModal}>Log In</Button>)
                : (<Button variant="danger" onClick={handleLoggedOut}>Log out</Button>)
            }

            {!isLoggedIn && (<LogIn
                show={isModalOpen}
                onHide={closeModal}
                title={authView === 'logIn' ? 'Log In' : 'Create A User ID'}
                onSwitchFormType={handleSwitchFormType}
                onLogIn={handleLoggedIn}
            >

                <Form>
                    <Form.Group className='pb-3 pt-1'>
                        <Form.Label><span className="fs-5 fw-bold">Disclaimer:</span> You can delete/lose your data if you do any of the following:</Form.Label>
                        <ul className="">
                            <li>Visit site from a different device.</li>
                            <li>Visit site from a different browser (Chrome vs Firefox)</li>
                            <li>Visit site in "Incognito" or "Private" browsing window</li>
                            <li>Manually clear browser's cache and site data</li>
                        </ul>
                    </Form.Group>

                </Form>

            </LogIn>)}
        </div>
    )
};