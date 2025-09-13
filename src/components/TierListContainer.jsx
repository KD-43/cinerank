import update from 'immutability-helper';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { ArrowClockwise, ArrowCounterclockwise, ArrowRepeat, FileEarmarkArrowDownFill, PlusCircle, PlusCircleFill, PlusSquare, PlusSquareFill, PencilSquare, Eraser } from 'react-bootstrap-icons';
import { useDrop } from 'react-dnd';
import { ErrorBoundary } from 'react-error-boundary';
import { ItemTypes } from './ItemTypes';
import { UnrankedItems } from './UnrankedItems';
import { TierRow } from './TierRow';
import { useAdvStateManager } from '../hooks/useUndo';
import { ColorPicker } from './TierColorPicker';
import { useModify } from '../hooks/useModify';

const INITIAL_CARDS = [
    { id: 1, text: 'Movie Poster A' },
    { id: 2, text: 'Movie Poster B' },
    { id: 3, text: 'Movie Poster C' },
    { id: 4, text: 'Movie Poster D' },
];

class Tier {
    constructor(id, label, color, items) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.items = items;
    }
}

const colorTheme = ['bg-pink-300', 'bg-red-300', 'bg-orange-300', 'bg-yellow-300', 'bg-green-300', 'bg-teal-300', 'bg-cyan-300', 'bg-blue-300', 'bg-indigo-300', 'bg-purple-300', 'bg-gray-300', 'bg-black'];

// const initialTierList = {
//     id: 'list-123',
//     title: 'My Favorite Movies',
//     rows: [
//         { id: 'row-s', label: 'S Tier', color: 'bg-pink-300', items: [] },
//         { id: 'row-a', label: 'A Tier', color: 'bg-red-300', items: [] },
//         { id: 'row-b', label: 'B Tier', color: 'bg-orange-300', items: [] },
//         { id: 'row-c', label: 'C Tier', color: 'bg-yellow-300', items: [] },
//     ],
//     unranked: [
//         { id: 'item-1', text: 'Godzilla' },
//         { id: 'item-2', text: 'Kong' },
//         { id: 'item-3', text: 'Ghidora' },
//         { id: 'item-4', text: 'MUTO' },
//         { id: 'item-5', text: 'Draken' },
//         { id: 'item-6', text: 'Walu' },
//         { id: 'item-7', text: 'Doha' },
//         { id: 'item-8', text: 'Test-8' },
//         { id: 'item-9', text: 'Test-9' },
//         { id: 'item-10', text: 'Test-10' },
//     ]
// };

// const tierListBasicTemplate = {
//     id: 'list-123',
//     title: 'Movie Title',
//     rows: [
//         { id: 'row-s', label: 'S Tier', color: 'bg-pink-300', items: [] },
//         { id: 'row-a', label: 'A Tier', color: 'bg-red-300', items: [] },
//         { id: 'row-b', label: 'B Tier', color: 'bg-orange-300', items: [] },
//         { id: 'row-c', label: 'C Tier', color: 'bg-yellow-300', items: [] },
//     ],
//     unranked: [],
// };

export default function TierListContainer ({ tierList, checks, actions, saveList, updateList, isNewList, handleResetList }) {
    // const { state: tierList, set: setTierList, undo, redo, reset, canUndo, canRedo } = useAdvStateManager(initialTierList);
    // const { createNewTier, deleteTier, moveItem, dropItem, updateRow, } = useModify(setTierList);
    const { canUndo, canRedo, } = checks;
    const { updateRow, updateTitle, createNewTier, deleteTier, moveItem, dropItem, deleteItem, undo, redo, reset, clear } = actions;
    const [ isSaving, setIsSaving ] = useState(false);
    const [ isColorPickerOpen, setIsColorPickerOpen ] = useState(false);
    const [ isMouseOverAddBtn, setIsMouseOverAddBtn ] = useState(false);
    const [ isMouseOverTierListOption, setIsMouseOverTierListOption ] = useState(false);
    const [ isOptionLabel, setIsOptionLabel ] = useState('');
    const [ localTitle, setLocalTitle ] = useState(tierList.title);
    const [ isHoverIconVisible, setIsHoverIconVisible ] = useState(false);
    const [ isPencilIconVisible, setIsPencilIconVisible ] = useState(false);
    const [ isInputFocused, setIsInputFocused ] = useState(false);

    if (!tierList || tierList === null || tierList === undefined) {
        return <p>initializing Tier List Editor</p>
    }

    useEffect(() => {
        if (!tierList || tierList === null || tierList === undefined) {
            console.log("In the TierListContainer, this TierList doesn't exist: ", tierList);
            return;
        }

        console.log("In the TierListContainer, this is the TierList: ", tierList);

    }, [tierList]);

    useEffect(() => {
        if (tierList.title === null || tierList.title === undefined) {
            return;
        };

        setLocalTitle(tierList.title);

    }, [tierList, setLocalTitle]);

    const handleMouseOverAddBtn = () => {
        setIsMouseOverAddBtn(true);
    };

    const handleMouseOutAddBtn = () => {
        setIsMouseOverAddBtn(false);
    };

    const handleMouseOverTierListOption = (event) => {
        setIsMouseOverTierListOption(true);
        const id = event.currentTarget.id;
        const label = () => {
            if (id && isNewList) {
                return 'Save New List'
            } else if (id === '_save') {
                return 'Update List';
            } else if (id === '_undo') {
                return 'Undo';
            } else if (id === '_redo') {
                return 'Redo';
            } else if (id === '_reset') {
                return 'Reset';
            } else {
                return '';
            }
        }
        setIsOptionLabel(label);
    };

    const handleMouseOutTierListOption = () => {
        setIsMouseOverTierListOption(false);
        setIsOptionLabel('');
    };

    const handleTitleChange = (event) => {
        setLocalTitle(event.target.value);
    };

    const handleTitleBlur = () => {
        if (localTitle !== tierList.title) {
            updateTitle(localTitle);
        };
        setIsPencilIconVisible(false);
        setIsInputFocused(false);
    };

    const iconVisible = isPencilIconVisible ? "iconVisible" : null;
    const bgColorOnHover = isPencilIconVisible ? "hoverBgColor" : null;
    const bgColorOnFocus = isInputFocused ? "focusBgColor" : null;
    // const hoverFocusBgColor = is

    const handleFocus = () => {
        setIsInputFocused(true);
        setIsPencilIconVisible(true);
        console.log("Input is focused!");
    }

    const handleMouseOverInput = () => {
        setIsPencilIconVisible(true);
    };

    const handleMouseOutInput = () => {
        if (isInputFocused) {
            return
        } else {
            setIsPencilIconVisible(false);
        }
    };

    const handleTierTitleBgColor = () => {
        if (isInputFocused) {
            return "focusBgColor"
        }

        if (isPencilIconVisible) {
            return "hoverBgColor"
        }
    };

    return (
        <ErrorBoundary fallbackRender={<div>An error occurred in the 'DndContainer' component</div>}>
            <div className="tierListWrapper">
                <div className="tierListHeader_wrapper d-flex justify-content-between">
                    <div className={`d-inline-flex tierListTitle ${bgColorOnHover} ${bgColorOnFocus}`} onMouseOver={handleMouseOverInput} onMouseOut={handleMouseOutInput}>
                        <div className={`tierListEditTitleIcon iconNotVisible ${iconVisible}`}>
                            <PencilSquare className="svg-gray-100"/>
                        </div>
                        <div className="d-inline-flex">
                            <input id="tierList-title" className='text-light fs-1 fw-bold' type="text" placeholder={`${tierList.title}`} value={localTitle} onChange={handleTitleChange} onBlur={handleTitleBlur} onFocus={handleFocus} autoComplete='off'/>
                        </div>
                    </div>
                    <div className="tierListOptions_wrapper">
                        {/* <div className="tierListOptionFeedback ps-4">
                            <h3 className="text-light m-0 ">{isOptionLabel ? isOptionLabel : null}</h3>
                        </div> */}

                            <div id="_save" className="tierListOptions d-inline-flex align-items-center justify-content-center" onClick={!isNewList ? updateList : saveList} onMouseOver={handleMouseOverTierListOption} onMouseOut={handleMouseOutTierListOption}>
                                <FileEarmarkArrowDownFill className='svg-gray-100' size={25} disabled={isSaving} />
                            </div>
                            <div id="_undo" className="tierListOptions d-inline-flex align-items-center justify-content-center" onClick={undo} onMouseOver={handleMouseOverTierListOption} onMouseOut={handleMouseOutTierListOption}>
                                <ArrowCounterclockwise className='svg-gray-100' size={28} disabled={!canUndo} />
                            </div>
                            <div id="_redo" className="tierListOptions d-inline-flex align-items-center justify-content-center" onClick={redo} onMouseOver={handleMouseOverTierListOption} onMouseOut={handleMouseOutTierListOption}>
                                <ArrowClockwise className='svg-gray-100' size={28} disabled={!canRedo} />
                            </div>
                            <div id="_reset" className="tierListOptions d-inline-flex align-items-center justify-content-center" onClick={reset} onMouseOver={handleMouseOverTierListOption} onMouseOut={handleMouseOutTierListOption}>
                                <ArrowRepeat className='svg-gray-100' size={28} />
                            </div>
                            <div id="_clear" className="tierListOptions d-inline-flex align-items-center justify-content-center" onClick={clear} onMouseOver={handleMouseOverTierListOption} onMouseOut={handleMouseOutTierListOption}>
                                <Eraser className='svg-gray-100' size={28} />
                            </div>

                    </div>
                </div>

                <hr className='pb-3 text-light' />
                <div className="card bg-gray-900 border-0 overflow-auto tierListBase">
                    <div className="card bg-gray-900 border-0 tierListBase">
                        <ul className="list-group tierListGroup list-group-flush">
                            {tierList && (tierList.rows.map(row => (
                                <>
                                    <TierRow
                                        key={row.id}
                                        rowId={row.id}
                                        label={row.label}
                                        color={row.color}
                                        items={row.items}
                                        onUpdateRow={updateRow}
                                        dropItem={dropItem}
                                        moveItem={moveItem}
                                        deleteTier={deleteTier}
                                        deleteItem={deleteItem}
                                    />
                                </>
                            )))}
                        </ul>
                    </div>
                </div>
                <div className="container pt-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <div onClick={() => createNewTier()} className='flex-item addRow_style'>
                            <PlusSquare id="plusSquare" className="cursorPointer text-blue-500" />
                            <PlusSquareFill id="plusSquareFill" className="cursorPointer svg-blue-500" />
                        </div>
                    </div>
                </div>
                {/* <hr className='pb-3 text-light' /> */}
                <h3 className="text-light fw-bold  mt-5">Unranked Items</h3>
                <UnrankedItems 
                    items={tierList.unranked}
                    dropItem={dropItem}
                    moveItem={moveItem}
                    deleteItem={deleteItem}
                />
            </div>
        </ErrorBoundary>
    );
}