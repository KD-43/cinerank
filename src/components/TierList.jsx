import update from 'immutability-helper';
import React, { useState, useEffect, useCallback, } from 'react';
import '../../node_modules/bootstrap/scss/bootstrap.scss';
import { PlusCircle, DashCircle } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import { TierRender } from './TierListRender';
import { getAnonUserId } from '../utils/userSession';
import { TierListManager } from './TierListManager';

const colorTheme = {
    pink: 'bg-pink-300',
    red: 'bg-red-300',
    orange: 'bg-orange-300',
    yellow: 'bg-yellow-300',
};

class Tier {
    constructor(id, label, color) {
        this.id = id;
        this.label = label;
        this.color = color;
    }
}

const colorThemeList = (theme) => {
    const array = [];
    
    for (const [key, value] of Object.entries(theme)) {
        array.push(value);
    }

    return array;
}

const colorThemeArray = colorThemeList(colorTheme);

const INITIAL_TIERS = [
    { id: 1, label: "S", color: colorTheme.pink},
    { id: 2, label: "A", color: colorTheme.red},
    { id: 3, label: "B", color: colorTheme.orange},
    { id: 4, label: "C", color: colorTheme.yellow},
];

export default function TierList ({ onOpen, onClose }) {

    const [ addRowCount, setAddRowCount ] = useState(0);
    const [ newTierId, setNewTierId ] = useState(5);
    const [ colorIndex, setColorIndex ] = useState(0);
    const [ isTierObject, setTierObject ] = useState(null);
    const [ tierList, setTierList ] = useState({
        initial: INITIAL_TIERS,
        additional: [],
    })

    if (!onOpen) {
        return null;
    }

    

    // const handleSaveNewList = async () => {
    //     const newList = {
    //         title: `My New List #${userLists.length + 1}`,
    //         description: "blah blah blah",
    //         timeData: { dateCreated: "7-23-25", lastUpdated: "2:44 PM", },
    //         data: [ 
    //             { tierId: 1, tierLabel: "S", tierColor: "color", 
    //             tierContent: [ 
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},

    //             ]},
    //             { tierId: 1, tierLabel: "A", tierColor: "color", 
    //             tierContent: [ 
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},

    //             ]},
    //             { tierId: 1, tierLabel: "B", tierColor: "color", 
    //             tierContent: [ 
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},

    //             ]},
    //             { tierId: 1, tierLabel: "C", tierColor: "color", 
    //             tierContent: [ 
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},
    //                 {movieId: 1234567, movieImg: "/movieImg.png"},

    //             ]},
    //         ]
    //     };

    //     try {
    //         const response = await fetch(`/api/tierlists/${userId}`, {
    //             method: 'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(newList),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to save new list');
    //         };

    //         const savedList = await response.json();
    //         setUserLists(prevLists => [...prevLists, { ...newList, id: savedList.id }]);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const createNewTier = () => {
        console.log('Previous Tier object: ', isTierObject);

        const newTierLabel = `This is tier ${newTierId}`;

        const newTier = new Tier(newTierId, newTierLabel, colorThemeArray[colorIndex]);
        console.log('Created Tier object: ', newTier);
        
        setNewTierId(newTierId + 1);
        
        if (colorIndex < 3) {
            setColorIndex(colorIndex + 1);
        } else {
            setColorIndex(0);
        }
        

        setTierObject(newTier);
    }

    const insertNewTier = useCallback((item, targetContainer) => {
        const { id: tierId, label: tierLabel, color: tierColor } = item;
        console.log('Passed item into insertNewTier: ', item);

        if (!item) {
            console.log("[ERROR]: Tier Object wasn't passed or doesn't exist! Returning!");
            return;
        };

        if (!tierId || !tierLabel || !tierColor) {
            console.log(`[ERROR]: One of the follow returned null: tierId[${tierId}], tierLabel[${tierLabel}], tierColor[${tierColor}]; Returning!`);
            return;
        }

        const newTierListState = update(tierList, {
            [targetContainer]: { $push: [item] },
        })

        setTierList(newTierListState);

    }, [tierList]);

    const groupName = (id) => {
        if (typeof id !== 'number') {
            console.log("Invalid id");
            return;
        }
        let group;

        if (id < 5) {
            group = 'initial';
            return group;
        } else if (id >= 5) {
            group = 'additional';
            return group;
        }
    };

    const deleteTier = useCallback(() => {
        setTierList((tierList) => {
            if (tierList.additional.length === 0 && tierList.initial.length === 0) {
                return tierList;
            }

            if (tierList.additional.length === 0 && tierList.initial.length > 0) {
                return update(tierList, {
                    initial: {
                        $splice: [[tierList.initial.length - 1, 1]]
                    }
                });
            }

            if (tierList.additional.length > 0) {
                setNewTierId(newTierId === 5 ? 5 : newTierId - 1);
                return update(tierList, {
                    additional: {
                        $splice: [[tierList.additional.length - 1, 1]]
                    }
                });
            } else {
                return tierList;
            }
        });
        
    }, []);

    return (
        <>
            <div className="tierListWrapper">
                <Button variant="danger" onClick={onClose} className='pb-2'>X</Button>
                <div className="card bg-gray-900 border-0 overflow-auto tierListBase">

                    <ul className="list-group tierListGroup list-group-flush">
                        
                        <TierRender
                            tiers={tierList}
                            newTier={isTierObject}
                            insertNewTier={insertNewTier}
                            group={groupName}
                        />
                        
                    </ul>
                    
                </div>

                <div className="container pt-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <div onClick={createNewTier} className='flex-item'>
                            <PlusCircle size={64} color={"white"} />
                        </div>
                        <div onClick={deleteTier} className='flex-item'>
                            <DashCircle size={64} color={"white"} />
                        </div>
                    </div>
                </div>

                <div className="container d-flex align-items-center justify-content-center pt-3">
                    <p className="h3 text-light">{addRowCount}</p>
                </div>

            </div>
        </>
    )
}