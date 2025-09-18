import { useReducer, useCallback, useEffect, useState, useRef } from "react";
import { useImmer } from 'use-immer';
import { current, produce } from 'immer';

class Tier {
    constructor(id, label, color, items) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.items = items;
    }
}

const colorTheme = ['bg-pink-300', 'bg-red-300', 'bg-orange-300', 'bg-yellow-300', 'bg-green-300', 'bg-teal-300', 'bg-cyan-300', 'bg-blue-300', 'bg-indigo-300', 'bg-purple-300', 'bg-gray-300', 'bg-black'];

const tierListReducer = (draft, action) => {
    
    switch (action.type) {
        case 'SET_STATE':
            return action.payload;

        case 'UPDATE_ROW':
            const { rowId, newRowData } = action.payload;
            const row = draft.rows.find(r => r.id === rowId);
            if (row) Object.assign(row, newRowData);
            return;

        case 'CREATE_TIER':
            const newRow = () => {
                const str = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const index = draft.rows.length;
                const strAtIndex = str[index];
                const color = colorTheme[index];

                console.log(`str(${str}), index(${index}), strIndex(${strAtIndex}), and color(${color}), created!`);

                const newTier = new Tier(`row-${strAtIndex}`, `${strAtIndex} Tier`, color, []);
                console.log('newTier object created: ', newTier);
                
                return newTier
            };
            draft.rows.push(newRow());
            return;

        case 'DELETE_TIER':
            const { targetId } = action.payload;
            console.log('deleteTier function called, received targetId: ', targetId);
            const rowIndex = draft.rows.findIndex(r => r.id === targetId);
            if (rowIndex || rowIndex !== -1) {
                draft.rows.splice(rowIndex, 1);
            };
            return;

        case 'MOVE_ITEM':
            const { dragIndex, hoverIndex, containerId } = action.payload;
            console.log(`--- moveItem called --- `);
            const unranked = draft.unranked;
            const tiers = draft.rows;
            console.log(`[PREFACE 0A]: 'unranked' shorthand const created to access 'draft.unranked': `, unranked);
            console.log(`[PREFACE 0B]: 'tiers' shorthand const created to access 'draft.rows': `, tiers);

            console.log('[1A]: movieItem function called, received at dragIndex of: ', dragIndex);
            console.log(`[1B]: parameters available[ dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}, containerId: ${containerId} ]`);
            if (containerId === 'unranked') {
                console.log(`[2A]: containerId is 'unranked', moving forward with swap.`);
                const draggedItem = unranked[dragIndex];
                if (draggedItem) {
                    console.log(`[2AI]: draggedItem var(${draggedItem}), created from 'draft.unranked[dragIndex]': unranked(${draft.unranked}) + dragIndex(${dragIndex})`);
                } else {
                    console.log("[2AI]: Could not find item at this dragIndex: ", dragIndex);
                }

                const updateDraft = () => {
                    unranked.splice(dragIndex, 1);
                    unranked.splice(hoverIndex, 0, draggedItem);
                }

                console.log('[2C]: updateDraft created -- returning function...', updateDraft);
                
                updateDraft();

            } else {
                console.log(`[2A]: containerId is NOT 'unranked', moving forward with swap.`);
                const rowIndex = tiers.findIndex(r => r.id === containerId);
                if (!rowIndex || rowIndex === -1) {
                    console.log(`[2AI]: ABORT - rowIndex invalid, returned false or -1`);
                    return;
                };

                console.log(`[2B]: rowIndex(${rowIndex}), created from tiers.findIndex(): tiers(${tiers}) + findIndex(${rowIndex})`);
                
                const draggedItem = tiers[rowIndex].items[dragIndex];
                console.log(`[2C]: draggedItem(${draggedItem}), created from draft.rows[rowIndex].items[dragIndex]: 'rows' at Index(${tiers[rowIndex]}) + items at Index(${tiers[rowIndex].items[dragIndex]})`);
                
                if (!draggedItem || draggedItem === undefined) {
                    console.log(`[2CI]: Could not find 'draggedItem' at the given parameters: 'draft.rows'(${tiers}), at the 'index'(${rowIndex}), in its 'items' array at 'dragIndex'(${dragIndex}) --- returning...`);
                    return;
                }

                const itemsAtRowIndex = tiers[rowIndex].items;
                console.log("[2D]: Created 'itemsAtRowIndex' for shorthand access to 'items' array at specified 'rows' index: ", itemsAtRowIndex);

                const updateDraft = () => {
                    itemsAtRowIndex.splice(dragIndex, 1);
                    itemsAtRowIndex.splice(hoverIndex, 0, draggedItem);
                }

                console.log('[2E]: updateDraft created -- returning function...', updateDraft);

                updateDraft();
            }
            return;

        case 'DROP_ITEM':
            const { draggedItem, targetContainerId, targetIndex } = action.payload;
            console.log(`--- dropItem called --- `);
            const dropItemLever = (draggedItem, targetContainerId, targetIndex) => {
                const tiers = draft.rows;
                const unranked = draft.unranked;
                const { id: itemId, container: sourceContainerId } = draggedItem;

                console.log(`--- Gathering variables --- `);
                console.log(`'tiers' as a shorthand for tierList.rows, and 'unranked' for tierList.unranked`);
                console.log(`[BEFORE CHANGE] -- tiers: `, tiers);
                console.log(`[BEFORE CHANGE] -- unranked: `, unranked);
                console.log(`'draggedItem' has the id of: ${itemId}, coming from: ${sourceContainerId}`);
                console.log(`Current parameters: [draggedItem]: which provides 'itemId'(${itemId}) and 'sourceContainerId'(${sourceContainerId}), [targetContainerId]: ${targetContainerId}, [targetIndex]: ${targetIndex}`);

                console.log(`---`);

                if (sourceContainerId === targetContainerId) {
                    console.log(`sourceContainerId(${sourceContainerId}) and targetContainerId(${targetContainerId}) are the same, returning...`);
                    return;
                };

                let itemToMove;
                console.log(`created 'itemToMove' and 'sourceUpdateCommand' variables`);

                if (sourceContainerId === 'unranked') {
                    console.log(`sourceContainerId === 'unranked'`);
                    const itemIndex = unranked.findIndex(i => i.id === itemId);
                    if (itemIndex === -1) {
                        console.log(`Item's index could NOT be found, returning...`);
                        return;
                    }
                    console.log(`Found index of item at ${itemIndex} of 'unranked'`);

                    itemToMove = unranked[itemIndex];
                    console.log(`Item moving: `, itemToMove);

                    unranked.splice(itemIndex, 1);

                    console.log(`--- MOVING TO INSERTION ---`);
                } else {
                    console.log(`sourceContainerId !== 'unranked'`);
                    const sourceRowIndex = tiers.findIndex(r => r.id === sourceContainerId);
                    if (sourceRowIndex === -1) {
                        console.log(`sourceRowIndex could NOT be found, returning...`);
                        return;
                    };
                    console.log(`sourceRowIndex created: at index(${sourceRowIndex}) of 'rows'`);

                    const itemIndex = tiers[sourceRowIndex].items.findIndex(i => i.id === itemId);
                    if (itemIndex === -1) {
                        console.log(`Item's index in the specified 'row' index of: ${sourceRowIndex}, could NOT be found, returning...`);
                        return;
                    };
                    console.log(`Item found at index(${itemIndex}) at row Index(${sourceRowIndex})`);

                    itemToMove = tiers[sourceRowIndex].items[itemIndex];
                    console.log(`Item moving: `, itemToMove);

                    const indexToRemove = tiers[sourceRowIndex].items;

                    indexToRemove.splice(itemIndex, 1);

                    console.log(`--- MOVING TO INSERTION ---`);
                }

                if (targetContainerId === 'unranked') {
                    console.log(`Target destination: 'unranked', pushing...`);
                    if (targetIndex !== null || !(!targetIndex)) {
                        unranked.splice(targetIndex, 0, itemToMove);
                    } else {
                        unranked.push(itemToMove);
                    }
                    console.log(`--- MOVING TO FUNCTION INVOCATION --- `);
                } else {
                    console.log(`Target destination NOT 'unranked', finding row index...`);
                    const rowIndex = tiers.findIndex(r => r.id === targetContainerId);
                    if (rowIndex === -1) {
                        console.log(`rowIndex could NOT be found in 'rows', returning...`);
                        return;
                    }
                    console.log(`rowIndex created, destination for item found at index(${rowIndex}) of 'rows' which has the id of: ${tiers[rowIndex].id}`);

                    const indexToAdd = tiers[rowIndex].items;

                    if (targetIndex !== null || !(!targetIndex)) {
                        indexToAdd.splice(targetIndex, 0, itemToMove);
                    } else {
                        indexToAdd.push(itemToMove);
                    }

                    console.log(`--- MOVING TO FUNCTION INVOCATION --- `);
                }
            }
            dropItemLever(draggedItem, targetContainerId, targetIndex);
            return;
        
        default:
            return draft;
    }
}

const tierListMainReducer = (state, action) => {

    switch (action.type) {
        case 'UNDO':
            console.log("--- UNDO Triggered! ---");
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            console.log("--- UNDO Finished! ---");
            return {
                past: newPast,
                present: previous,
                future: [state.present, ...state.future],
            };

        case 'REDO':
            console.log("--- REDO Triggered! ---");
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            console.log("--- REDO Finished! ---");
            return {
                past: [...state.past, state.present],
                present: next,
                future: newFuture,
            };

        case 'RESET':
            console.log("--- RESET Triggered! ---");
            if (action.newPresent === state.present) return state;
            console.log("--- RESET Finished! ---");
            return {
                past: [],
                present: action.newPresent,
                future: [],
            };

        case 'SET_STATE':
            console.log("--- SET Triggered! ---");
            if (action.newPresent === state.present) return state;
            console.log("--- SET Finished! ---");
            return {
                past: [],
                present: action.newPresent,
                future: [],
            };
    }

    let newPresent = state.present;

    switch (action.type) {

        case 'UPDATE_ROW': {
            console.log("--- UPDATE ROW Triggered! ---");
            const { rowId, newRowData } = action.payload;
            const row = state.present.rows.find(r => r.id === rowId);
            if (row) Object.assign(row, newRowData);
            console.log("--- UPDATE ROW Finished! ---");
            break;
        }

        case 'CREATE_TIER': {
            console.log("--- CREATE TIER Triggered! ---");
            const newRow = () => {
                const str = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const index = state.present.rows.length;
                const strAtIndex = str[index];
                const color = colorTheme[index];

                console.log(`str(${str}), index(${index}), strIndex(${strAtIndex}), and color(${color}), created!`);

                const newTier = new Tier(`row-${strAtIndex}`, `${strAtIndex} Tier`, color, []);
                console.log('newTier object created: ', newTier);
                
                return newTier
            };
            state.present.rows.push(newRow());
            console.log("--- CREATE TIER Finished! ---");
            break;
        }

        case 'DELETE_TIER': {
            console.log("--- DELETE TIER Triggered! ---");
            const { targetId } = action.payload;
            console.log('deleteTier function called, received targetId: ', targetId);
            const rowIndex = state.present.rows.findIndex(r => r.id === targetId);
            if (rowIndex || rowIndex !== -1) {
                state.present.rows.splice(rowIndex, 1);
            };
            console.log("--- DELETE TIER Finished! ---");
            break;
        }

        case 'MOVE_ITEM': {
            console.log("--- MOVE ITEM Triggered! ---");
            const { dragIndex, hoverIndex, containerId } = action.payload;
            console.log(`--- moveItem called --- `);
            console.log("Current state: ", state);
            const unranked = state.present.unranked;
            const tiers = state.present.rows;
            console.log(`[PREFACE 0A]: 'unranked' shorthand const created to access 'state.unranked': `, unranked);
            console.log(`[PREFACE 0B]: 'tiers' shorthand const created to access 'state.rows': `, tiers);

            console.log('[1A]: movieItem function called, received at dragIndex of: ', dragIndex);
            console.log(`[1B]: parameters available[ dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}, containerId: ${containerId} ]`);
            if (containerId === 'unranked') {
                console.log(`[2A]: containerId is 'unranked', moving forward with swap.`);
                const draggedItem = unranked[dragIndex];
                if (draggedItem) {
                    console.log(`[2AI]: draggedItem var(${draggedItem}), created from 'state.unranked[dragIndex]': unranked(${state.unranked}) + dragIndex(${dragIndex})`);
                } else {
                    console.log("[2AI]: Could not find item at this dragIndex: ", dragIndex);
                }

                console.log(`--- moveItem Executing --- `);

                unranked.splice(dragIndex, 1);
                unranked.splice(hoverIndex, 0, draggedItem);

                console.log(`--- moveItem Finished --- `);

            } else {
                console.log(`[2A]: containerId is NOT 'unranked', moving forward with swap.`);
                const rowIndex = tiers.findIndex(r => r.id === containerId);
                if (!rowIndex || rowIndex === -1) {
                    console.log(`[2AI]: ABORT - rowIndex invalid, returned false or -1`);
                    return;
                };

                console.log(`[2B]: rowIndex(${rowIndex}), created from tiers.findIndex(): tiers(${tiers}) + findIndex(${rowIndex})`);
                
                const draggedItem = tiers[rowIndex].items[dragIndex];
                console.log(`[2C]: draggedItem(${draggedItem}), created from state.rows[rowIndex].items[dragIndex]: 'rows' at Index(${tiers[rowIndex]}) + items at Index(${tiers[rowIndex].items[dragIndex]})`);
                
                if (!draggedItem || draggedItem === undefined) {
                    console.log(`[2CI]: Could not find 'draggedItem' at the given parameters: 'state.rows'(${tiers}), at the 'index'(${rowIndex}), in its 'items' array at 'dragIndex'(${dragIndex}) --- returning...`);
                    return;
                }

                const itemsAtRowIndex = tiers[rowIndex].items;
                console.log("[2D]: Created 'itemsAtRowIndex' for shorthand access to 'items' array at specified 'rows' index: ", itemsAtRowIndex);

                console.log(`--- moveItem Executing --- `);

                itemsAtRowIndex.splice(dragIndex, 1);
                itemsAtRowIndex.splice(hoverIndex, 0, draggedItem);

                console.log(`--- moveItem Finished  --- `);
            }
            console.log("--- MOVE ITEM Finished! ---");
            break;
        }

        case 'DROP_ITEM': {
            console.log("--- DROP ITEM Triggered! ---");
            const { draggedItem, targetContainerId, targetIndex } = action.payload;
            console.log(`--- dropItem called --- `);
            const tiers = state.present.rows;
            const unranked = state.present.unranked;
            const { id: itemId, container: sourceContainerId } = draggedItem;

            console.log(`--- Gathering variables --- `);
            console.log(`'tiers' as a shorthand for tierList.rows, and 'unranked' for tierList.unranked`);
            console.log(`[BEFORE CHANGE] -- tiers: `, tiers);
            console.log(`[BEFORE CHANGE] -- unranked: `, unranked);
            console.log(`'draggedItem' has the id of: ${itemId}, coming from: ${sourceContainerId}`);
            console.log(`Current parameters: [draggedItem]: which provides 'itemId'(${itemId}) and 'sourceContainerId'(${sourceContainerId}), [targetContainerId]: ${targetContainerId}, [targetIndex]: ${targetIndex}`);

            console.log(`---`);

            if (sourceContainerId === targetContainerId) {
                console.log(`sourceContainerId(${sourceContainerId}) and targetContainerId(${targetContainerId}) are the same, returning...`);
                return;
            };

            let itemToMove;
            console.log(`created 'itemToMove' variable`);

            if (sourceContainerId === 'unranked') {
                console.log(`sourceContainerId === 'unranked'`);
                const itemIndex = unranked.findIndex(i => i.id === itemId);
                if (itemIndex === -1) {
                    console.log(`Item's index could NOT be found, returning...`);
                    return;
                }
                console.log(`Found index of item at ${itemIndex} of 'unranked'`);

                itemToMove = unranked[itemIndex];
                console.log(`Item moving: `, itemToMove);

                unranked.splice(itemIndex, 1);

                console.log(`--- SPLICE COMPLETED, MOVING TO INSERTION ---`);
            } else {
                console.log(`sourceContainerId !== 'unranked'`);
                const sourceRowIndex = tiers.findIndex(r => r.id === sourceContainerId);
                if (sourceRowIndex === -1) {
                    console.log(`sourceRowIndex could NOT be found, returning...`);
                    return;
                };
                console.log(`sourceRowIndex created: at index(${sourceRowIndex}) of 'rows'`);

                const itemIndex = tiers[sourceRowIndex].items.findIndex(i => i.id === itemId);
                if (itemIndex === -1) {
                    console.log(`Item's index in the specified 'row' index of: ${sourceRowIndex}, could NOT be found, returning...`);
                    return;
                };
                console.log(`Item found at index(${itemIndex}) at row Index(${sourceRowIndex})`);

                itemToMove = tiers[sourceRowIndex].items[itemIndex];
                console.log(`Item moving: `, itemToMove);

                const indexToRemove = tiers[sourceRowIndex].items;

                indexToRemove.splice(itemIndex, 1);

                console.log(`--- SPLICE COMPLETED, MOVING TO INSERTION ---`);
            }

            if (targetContainerId === 'unranked') {
                console.log(`Target destination: 'unranked', pushing...`);
                if (targetIndex !== null || !(!targetIndex)) {
                    console.log("--- VALID TARGET INDEX FOUND, INSERTING AT SPECIFIED INDEX ---");
                    unranked.splice(targetIndex, 0, itemToMove);
                } else {
                    console.log("--- VALID TARGET INDEX NOT FOUND, PERFORMING SIMPLE PUSH ---");
                    unranked.push(itemToMove);
                }
                console.log(`--- ITEM DROP COMPLETED --- `);
            } else {
                console.log(`Target destination NOT 'unranked', finding row index...`);
                const rowIndex = tiers.findIndex(r => r.id === targetContainerId);
                if (rowIndex === -1) {
                    console.log(`rowIndex could NOT be found in 'rows', returning...`);
                    return;
                }
                console.log(`rowIndex created, destination for item found at index(${rowIndex}) of 'rows' which has the id of: ${tiers[rowIndex].id}`);

                const indexToAdd = tiers[rowIndex].items;

                if (targetIndex !== null || !(!targetIndex)) {
                    console.log("--- VALID TARGET INDEX FOUND, INSERTING AT SPECIFIED INDEX ---");
                    indexToAdd.splice(targetIndex, 0, itemToMove);
                } else {
                    console.log("--- VALID TARGET INDEX NOT FOUND, PERFORMING SIMPLE PUSH ---");
                    indexToAdd.push(itemToMove);
                }

                console.log(`--- ITEM DROP COMPLETED --- `);
            }
            console.log("--- DROP ITEM FINISHED! ---");
            break;
        }
        
        default:
            return state;
    }

    if (state.present === null) {
        return { ...state, present: newPresent }
    }

    return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
    }


}

// export const useTierList = (initialPresent) => {
//     const [ history, updateHistory ] = useImmer({
//         past: [],
//         present: initialPresent,
//         future: [],
//     });

//     useEffect(() => {
//         if (initialPresent !== undefined && initialPresent !== history.present) {
//             updateHistory(draft => {
//                 draft.past = [];
//                 draft.present = initialPresent;
//                 draft.future = [];
//             });
//         }
//     }, [initialPresent, history.present, updateHistory]);

//     useEffect(() => {
//         if (history) {
//             console.log("History object updated: ", history);
//         }
//     }, [history]);

//     const set = useCallback((updater) => {
//         updateHistory(draft => {
//             const newPresent = updater(draft.present);

//             if (draft.present !== null || newPresent !== draft.present) {
//                 draft.past.push(draft.present);
//                 draft.future = [];
//             }
//             draft.present = newPresent;
//         });
//     }, [updateHistory]);

//     const updateRow = useCallback((rowId, newRowData) => {
//         set(draft => {

//             if (!draft) {
//                 console.log("Draft not available, returning...", draft);
//                 return;
//             };
//             const row = draft.rows.find(r => r.id === rowId);
//             if (row) {
//                 Object.assign(row, newRowData);
//             };
//         });
//     }, [set]);

//     const createNewTier = useCallback(() => {
//         set(draft => {
//             if (!draft) {
//                 console.log("Draft not available, returning...", draft);
//                 return;
//             };
//             const newRow = () => {
//                 const str = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ';
//                 const index = draft.rows.length;
//                 const strAtIndex = str[index];
//                 const color = colorTheme[index];

//                 console.log(`str(${str}), index(${index}), strIndex(${strAtIndex}), and color(${color}), created!`);

//                 const newTier = new Tier(`row-${strAtIndex}`, `${strAtIndex} Tier`, color, []);
//                 console.log('newTier object created: ', newTier);
                
//                 return newTier
//             }

//             draft.rows.push(newRow());
//         });
//     }, [set]);

//     const deleteTier = useCallback((targetId) => {
//         set(draft => {
//             if (!draft) {
//                 console.log("Draft not available, returning...", draft);
//                 return;
//             };
//             console.log('deleteTier function called, received targetId: ', targetId);
//             const rowIndex = draft.rows.findIndex(r => r.id === targetId);
//             if (rowIndex || rowIndex !== -1) {
//                 draft.rows.splice(rowIndex, 1);
//             }
//         })
//     }, [set]);

//     const moveItem = useCallback((dragIndex, hoverIndex, containerId) => {
//         set(draft => {
//             if (!draft) {
//                 console.log("Draft not available, returning...", draft);
//                 return;
//             }
//             console.log(`--- moveItem called --- `);
//             const unranked = draft.unranked;
//             const row = draft.rows;
//             console.log(`[PREFACE 0A]: 'unranked' shorthand const created to access 'draft.unranked': `, unranked);
//             console.log(`[PREFACE 0B]: 'row' shorthand const created to access 'draft.rows': `, row);

//             console.log('[1A]: movieItem function called, received at dragIndex of: ', dragIndex);
//             console.log(`[1B]: parameters available[ dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}, containerId: ${containerId} ]`);
//             if (containerId === 'unranked') {
//                 console.log(`[2A]: containerId is 'unranked', moving forward with swap.`);
//                 const draggedItem = unranked[dragIndex];
//                 if (draggedItem) {
//                     console.log(`[2AI]: draggedItem var(${draggedItem}), created from 'draft.unranked[dragIndex]': unranked(${draft.unranked}) + dragIndex(${dragIndex})`);
//                 } else {
//                     console.log("[2AI]: Could not find item at this dragIndex: ", dragIndex);
//                 }
                
//                 unranked.splice(dragIndex, 1);
//                 unranked.splice(hoverIndex, 0, draggedItem);

//                 console.log('[2B]: Move complete');
//             } else {
//                 console.log(`[2A]: containerId is NOT 'unranked', moving forward with swap.`);
//                 const rowIndex = row.findIndex(r => r.id === containerId);
//                 if (!rowIndex || rowIndex === -1) {
//                     console.log(`[2AI]: ABORT - rowIndex invalid, returned false or -1`);
//                     return;
//                 };

//                 console.log(`[2B]: rowIndex(${rowIndex}), created from draft.rows.findIndex(): rows(${row}) + findIndex(${rowIndex})`);
                
//                 const draggedItem = row[rowIndex].items[dragIndex];
//                 console.log(`[2C]: draggedItem(${draggedItem}), created from draft.rows[rowIndex].items[dragIndex]: 'rows' at Index(${row[rowIndex]}) + items at Index(${row[rowIndex].items[dragIndex]})`);
                
//                 if (!draggedItem || draggedItem === undefined) {
//                     console.log(`[2CI]: Could not find 'draggedItem' at the given parameters: 'draft.rows'(${row}), at the 'index'(${rowIndex}), in its 'items' array at 'dragIndex'(${dragIndex}) --- returning...`);
//                     return;
//                 }

//                 const itemsAtRowIndex = row[rowIndex].items;
//                 console.log("[2D]: Created 'itemsAtRowIndex' for shorthand access to 'items' array at specified 'rows' index: ", itemsAtRowIndex);

//                 itemsAtRowIndex.splice(dragIndex, 1);
//                 itemsAtRowIndex.splice(hoverIndex, 0, draggedItem);
                
//                 console.log('[2E]: Move complete');
//             }
//         })
//     }, [set]);

//     const dropItem = useCallback((draggedItem, targetContainerId, targetIndex) => {
//         set(draft => {
//             if (!draft) {
//                 console.log("Draft not available, returning...", draft);
//                 return;
//             };

//             // console.clear();
//             console.log(`--- dropItem called --- `);

//             const tiers = draft.rows;
//             const unranked = draft.unranked;
//             const { id: itemId, container: sourceContainerId } = draggedItem;

//             console.log(`--- Gathering variables --- `);
//             console.log(`'tiers' as a shorthand for tierList.rows, and 'unranked' for tierList.unranked`);
//             console.log(`[BEFORE CHANGE] -- tiers: `, tiers);
//             console.log(`[BEFORE CHANGE] -- unranked: `, unranked);
//             console.log(`'draggedItem' has the id of: ${itemId}, coming from: ${sourceContainerId}`);
//             console.log(`Current parameters: [draggedItem]: which provides 'itemId'(${itemId}) and 'sourceContainerId'(${sourceContainerId}), [targetContainerId]: ${targetContainerId}, [targetIndex]: ${targetIndex}`);

//             console.log(`---`);

//             if (sourceContainerId === targetContainerId) {
//                 console.log(`sourceContainerId(${sourceContainerId}) and targetContainerId(${targetContainerId}) are the same, returning...`);
//                 return;
//             };

//             let itemToMove;
//             console.log(`created 'itemToMove' and 'sourceUpdateCommand' variables`);

//             if (sourceContainerId === 'unranked') {
//                 console.log(`sourceContainerId === 'unranked'`);
//                 const itemIndex = unranked.findIndex(i => i.id === itemId);
//                 if (itemIndex === -1) {
//                     console.log(`Item's index could NOT be found, returning...`);
//                     return;
//                 }
//                 console.log(`Found index of item at ${itemIndex} of 'unranked'`);

//                 itemToMove = unranked[itemIndex];
//                 console.log(`Item moving: `, itemToMove);

//                 unranked.splice(itemIndex, 1);
//                 console.log("Unranked item removed from original position. Proceeding with new insertion...");
//             } else {
//                 console.log(`sourceContainerId !== 'unranked'`);
//                 const sourceRowIndex = tiers.findIndex(r => r.id === sourceContainerId);
//                 if (sourceRowIndex === -1) {
//                     console.log(`sourceRowIndex could NOT be found, returning...`);
//                     return;
//                 };
//                 console.log(`sourceRowIndex created: at index(${sourceRowIndex}) of 'rows'`);

//                 const itemIndex = tiers[sourceRowIndex].items.findIndex(i => i.id === itemId);
//                 if (itemIndex === -1) {
//                     console.log(`Item's index in the specified 'row' index of: ${sourceRowIndex}, could NOT be found, returning...`);
//                     return;
//                 };
//                 console.log(`Item found at index(${itemIndex}) at row Index(${sourceRowIndex})`);

//                 itemToMove = tiers[sourceRowIndex].items[itemIndex];
//                 console.log(`Item moving: `, itemToMove);

//                 const indexToRemove = tiers[sourceRowIndex].items;

//                 indexToRemove.splice(itemIndex, 1);

//                 console.log("Tier item removed from original position. Proceeding with new insertion...");
//             }

//             if (targetContainerId === 'unranked') {
//                 console.log(`Target destination: 'unranked', pushing...`);
//                 if (targetIndex !== null || !(!targetIndex)) {
//                     console.log("Target Index legible, performing specific insertion...");
//                     unranked.splice(targetIndex, 0, itemToMove);
//                     console.log("--- Drop Finished ---");
//                 } else {
//                     console.log("Target Index NOT legible, performing standard insertion...");
//                     unranked.push(itemToMove);
//                     console.log("--- Drop Finished ---");
//                 }
//             } else {
//                 console.log(`Target destination NOT 'unranked', finding row index...`);
//                 const rowIndex = tiers.findIndex(r => r.id === targetContainerId);
//                 if (rowIndex === -1) {
//                     console.log(`rowIndex could NOT be found in 'rows', returning...`);
//                     return;
//                 }
//                 console.log(`rowIndex created, destination for item found at index(${rowIndex}) of 'rows' which has the id of: ${tiers[rowIndex].id}`);

//                 const indexToAdd = tiers[rowIndex].items;

//                 if (targetIndex !== null || !(!targetIndex)) {
//                     console.log("Target Index legible, performing specific insertion...");
//                     indexToAdd.splice(targetIndex, 0, itemToMove);
//                     console.log("--- Drop Finished ---");
//                 } else {
//                     console.log("Target Index NOT legible, performing standard insertion...");
//                     indexToAdd.push(itemToMove);
//                     console.log("--- Drop Finished ---");
//                 }
//             }
//         })
//     }, [set]);

//     const undo = useCallback(() => {
//         updateHistory(draft => {
//             if (draft.past.length > 0) {
//                 console.log("draft.past.length is greater than 0 -- the draft:", draft.past);
//             }
//             if (draft.past.length === 0) {
//                 console.log('draft.past.length is 0, returning');
//                 return;
//             };
//             const previous = draft.past.pop();
//             draft.future.unshift(draft.present);
//             draft.present = previous;
//         });
//     }, [updateHistory]);

//     const redo = useCallback(() => {
//         updateHistory(draft => {
//             if (draft.future.length === 0) return;
//             const next = draft.future.shift();
//             draft.past.push(draft.present);
//             draft.present = next;
//         });
//     }, [updateHistory]);

//     const reset = useCallback((newPresent) => {
//         updateHistory(draft => {
//             draft.past = [];
//             draft.present = newPresent;
//             draft.future = [];
//         });
//     }, [updateHistory]);

//     return {
//         tierList: history.present,
//         checks: {
//             canUndo: history.past.length > 0,
//             canRedo: history.future.length > 0,
//         },
//         actions: {
//             updateRow,
//             createNewTier,
//             deleteTier,
//             moveItem,
//             dropItem,
//             undo,
//             redo,
//             reset,
//         }
//     }
// }

const history = {
    past: [],
    present: [],
    future: [],
}

export function useTierList (initialData) {
    const [ state, setState ] = useImmer({
        past: [],
        present: initialData,
        future: [],
    });

    console.log("initialData: ", initialData);
    console.log("state: ", state);
    
    useEffect(() => {
        if (initialData === null || initialData === undefined) {
            return;
        }
        console.log("useEffect: initialData exists - ", initialData);
        setState(draft => {
            draft.past = [];
            draft.present = initialData;
            draft.future = [];
        })
    }, [initialData, setState]);

    useEffect(() => {
        if (!initialData) {
            return;
        };

        console.log("initialData received: ", initialData);
    }, [initialData]);

    const set = useCallback((update) => {
        console.log("|( useTierList )| SET | Function called!");
        setState(draft => {
            console.log("|( useTierList )|> SET <|[setState]: Mutating Draft -> Creating 'newData' and 'currentPresent' to store the new state and current state respectively...");
            const currentPresent = current(draft.present);
            // const newData = update(draft.present);
            
            update(draft.present);

            console.log("|( useTierList )|> SET <|[setState]: currentData: ", currentPresent);
            // console.log("|( useTierList )|> SET <|[setState]: newData: ", newData);

            // if (newData === draft.present) {
            //     console.log(`The resulting state from 'newData' is the same as 'draft.present', returning...`);
            //     return;
            // };

            draft.past.push(currentPresent);
            draft.future = [];

            console.log("draft.past", current(draft.past));
            console.log("draft.present", current(draft.present));
        });

    }, [setState]);

    const station = useCallback((modify) => {
        console.log("|( useTierList )| MODIFY | Function called!");
        setState(draft => {
            console.log("|( useTierList )|> MODIFY <|[setState]: Mutating draft -> Saving 'currentState' and pushing it to 'draft.future' -> removing last element of 'draft.past' and saving it as 'newPresent' to modify 'draft.present'...");
            modify(draft);
        });

    }, [setState]);

    const updateRow = useCallback((rowId, newRowData) => {
        console.log("|( useTierList )| UPDATE ROW | Function called!");

        set(draft => {
            if (!draft || draft === null || draft === undefined) {
                console.log("|( useTierList )|> UPDATE ROW <|[SET STATE]: No 'draft' state object available: ", draft);
                return;
            }

            console.log("|( useTierList )|> UPDATE ROW <|[SET STATE]: 'draft' exists: ", draft);
            console.log("|( useTierList )|> UPDATE ROW <|[SET STATE]: Locating changing row...");

            const row = draft.rows.find(r => r.id === rowId);

            if (!row || row === null || row === undefined) {
                console.log("|( useTierList )|> UPDATE ROW <|[SET STATE]: Row could NOT be found or is invalid, returning...", row);
                return;
            };

            console.log("|( useTierList )|> UPDATE ROW <|[SET STATE]: Row located, proceeding with Object assignment...", row);
            
            if (row) Object.assign(row, newRowData);
        });
        console.log("|( useTierList )| UPDATE ROW | Function Done! Returning state!");

    }, [set]);

    const updateTitle = useCallback((newTitle) => {
        console.log("|( useTierList )| UPDATE TITLE | Function called!");

        set(draft => {
            if (!draft) {
                console.log("|( useTierList )|> UPDATE TITLE <|[SET STATE]: No 'draft' state object available: ", draft);
                return;
            };

            if (newTitle === undefined || newTitle === null) {
                console.log("|( useTierList )|> UPDATE TITLE <|[SET STATE]: No 'newTitle' input available: ", draft);
                return;
            };

            const currentTitle = draft.title;

            if (currentTitle === newTitle) {
                console.log("|( useTierList )|> UPDATE TITLE <|[SET STATE]: currentTitle is the same the newTitle, returning...");
                return;
            };

            draft.title = newTitle;
        });
        console.log("|( useTierList )| UPDATE TITLE | Function finished! Returning state!");

    }, [set]);

    const createNewTier = useCallback(() => {
        console.log("|( useTierList )| CREATE NEW TIER | Function called!");

        set(draft => {
            if (!draft || draft === null || draft === undefined) {
                console.log("|( useTierList )|> CREATE NEW TIER <|[SET STATE]: No 'draft' state object available: ", draft);
                return;
            }

            console.log("|( useTierList )|> CREATE NEW TIER <|[SET STATE]: 'draft' exists: ", draft);
            console.log("|( useTierList )|> CREATE NEW TIER <|[SET STATE]: Creating new tier row object from template...");

            const str = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const index = draft.rows.length;
            const strAtIndex = str[index];
            const color = colorTheme[index];

            console.log(`|( useTierList )|> CREATE NEW TIER <|-| SET |-[ newRow ]: str(${str}), index(${index}), strIndex(${strAtIndex}), and color(${color}), created! Inserting parameters...`);

            const newTier = { id: `row-${strAtIndex}`, label: `${strAtIndex} Tier`, color: color, items: [] };

            console.log('|( useTierList )|> CREATE NEW TIER <|-| SET |-[ newRow ]: newTier object created: ', newTier);
            console.log("|( useTierList )|> CREATE NEW TIER <|[SET STATE]: Pushing new Tier Object to 'rows' array...");

            const rows = draft.rows;
            rows.push(newTier);
        });
        console.log("|( useTierList )| CREATE NEW TIER | Function Done! Returning state!");

    }, [set]);

    const deleteTier = useCallback((targetId) => {
        console.log("|( useTierList )| DELETE TIER | Function called at targetId: ", targetId);

        set(draft => {
            if (!draft || draft === null || draft === undefined) {
                console.log("|( useTierList )|> DELETE TIER <|[SET STATE]: No 'draft' state object available: ", draft);
                return;
            };

            console.log("|( useTierList )|> DELETE TIER <|[SET STATE]: 'draft' exists: ", draft);
            console.log('|( useTierList )|> DELETE TIER <|[SET STATE]: Finding row index...');

            const rowIndex = draft.rows.findIndex(r => r.id === targetId);
            const rowItems = draft.rows[rowIndex].items;
            const unranked = draft.unranked;

            if (rowItems.length > 0 && unranked) {
                for (let i = 0; i < rowItems.length; i++) {
                    unranked.push(rowItems[i]);
                }
            };

            if (rowIndex || rowIndex !== -1) {
                draft.rows.splice(rowIndex, 1);
            } else {
                console.log("|( useTierList )|> DELETE TIER <|[SET STATE]: rowIndex note found! Returning...");
            }
        });
        console.log("|( useTierList )| DELETE TIER | Function Done! Returning state!");

    }, [set]);

    const moveItem = useCallback((dragIndex, hoverIndex, containerId) => {
        // console.clear();
        console.log("|( useTierList )| MOVE ITEM | Function called!");
        console.log(`|( useTierList )| MOVE ITEM | Parameters available: (dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}, containerId: ${containerId})`);

        if (dragIndex === undefined || hoverIndex === undefined  || !containerId) {
            console.log("|( useTierList )|> MOVE ITEM <|[ CHECK ]: One of the parameters is false, returning");
            return;
        };

        set(draft => {
            if (!draft || draft === null || draft === undefined) {
                console.log("Draft not available, returning...", draft);
                return;
            }
            console.log("|( useTierList )|> MOVE ITEM <|[SET STATE]: 'draft' exists: ", draft);
            const unranked = draft.unranked;
            const row = draft.rows;
            console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: 'unranked' shorthand const created to access 'draft.unranked': `, unranked);
            console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: 'row' shorthand const created to access 'draft.rows': `, row);

            if (containerId === 'unranked') {
                console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: containerId is 'unranked', moving forward with swap.`);
                const draggedItem = unranked[dragIndex];
                if (draggedItem) {
                    console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: draggedItem created: `, draggedItem);
                } else {
                    console.log("|( useTierList )|> MOVE ITEM <|[SET STATE]: Could not find item at this dragIndex: ", dragIndex);
                    return;
                }
                
                console.log('|( useTierList )|> MOVE ITEM <|[SET STATE]: Moving draggedItem at index: ', dragIndex, ",  and placing it at hoverIndex: ", hoverIndex);

                unranked.splice(dragIndex, 1);
                unranked.splice(hoverIndex, 0, draggedItem);

                console.log('|( useTierList )|> MOVE ITEM <|[SET STATE]: Move complete');
            } else {
                console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: containerId is NOT 'unranked', moving forward with swap.`);
                const rowIndex = row.findIndex(r => r.id === containerId);
                if (rowIndex === -1) {
                    console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: ABORT - rowIndex invalid, returned -1`);
                    return;
                };

                console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: rowIndex found: `, rowIndex);
                
                const draggedItem = row[rowIndex].items[dragIndex];
                
                if (!draggedItem || draggedItem === undefined) {
                    console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: Could not find 'draggedItem' at the given parameters: 'draft.rows'(${row}), at the 'index'(${rowIndex}), in its 'items' array at 'dragIndex'(${dragIndex}) --- returning...`);
                    return;
                }

                console.log(`|( useTierList )|> MOVE ITEM <|[SET STATE]: draggedItem created: `, draggedItem);

                const itemsAtRowIndex = row[rowIndex].items;

                console.log("|( useTierList )|> MOVE ITEM <|[SET STATE]: Created 'itemsAtRowIndex' for shorthand access to 'items' array at specified 'rows' index: ", itemsAtRowIndex);
                console.log('|( useTierList )|> MOVE ITEM <|[SET STATE]: Moving draggedItem at index: ', dragIndex, ",  and placing it at hoverIndex: ", hoverIndex);

                itemsAtRowIndex.splice(dragIndex, 1);
                itemsAtRowIndex.splice(hoverIndex, 0, draggedItem);

                console.log('|( useTierList )|> MOVE ITEM <|[SET STATE]: Move complete');
            }
        })
        console.log("|( useTierList )| MOVE ITEM | Function Done! Returning state!");

    }, [set]);

    const dropItem = useCallback((draggedItem, targetContainerId, targetIndex) => {
        console.log("|( useTierList )| DROP ITEM | Function called!");
        console.log(`|( useTierList )| DROP ITEM | Parameters available [1/2]: dragIndex: `, draggedItem);
        console.log(`|( useTierList )| DROP ITEM | Parameters available [2/2]: targetContainerId: ${targetContainerId}, targetIndex: ${targetIndex} `);

        set(draft => {
            if (!draft) {
                console.log("|( useTierList )|> DROP ITEM <|[SET STATE]-| ERROR |: Draft not available, returning...", draft);
                return;
            };

            const tiers = draft.rows;
            const unranked = draft.unranked;
            const { id: itemId, container: sourceContainerId } = draggedItem;

            console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Gathering variables...`);
            console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: For -draft.rows- -> 'tiers': `, tiers);
            console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: For -draft.unranked- -> 'unranked': `, unranked);
            console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Destructuring 'draggedItem' -> Has the id of: ${itemId}, coming from: ${sourceContainerId}`);

            console.log(`|( useTierList )|> DROP ITEM <|[SET STATE] Evaluating 'sourceContainer' of 'draggedItem'...`);

            if (sourceContainerId === targetContainerId) {
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]-| ERROR |: Item's sourceContainerId(${sourceContainerId}) and targetContainerId(${targetContainerId}) are the same, returning...`);
                return;
            };

            let itemToMove;
            console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Created empty var 'itemToMove', defining...`);

            if (sourceContainerId === 'unranked') {
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: 'sourceContainerId' IS 'unranked', finding index...`);
                const itemIndex = unranked.findIndex(i => i.id === itemId);
                if (itemIndex === -1) {
                    console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]-| ERROR |: Item's index could NOT be found, returning...`);
                    return;
                }
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Found index of item at ${itemIndex} of 'unranked', defining 'itemToMove'...`);

                itemToMove = unranked[itemIndex];
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Item moving: `, itemToMove);

                unranked.splice(itemIndex, 1);
                console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Unranked item removed from original position. Proceeding with new insertion...");
            } else {
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: sourceContainerId IS NOT 'unranked', finding row index...`);
                const sourceRowIndex = tiers.findIndex(r => r.id === sourceContainerId);
                if (sourceRowIndex === -1) {
                    console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]-| ERROR |: sourceRowIndex could NOT be found, returning...`);
                    return;
                };
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: 'sourceRowIndex' found at ${sourceRowIndex} of 'rows', locating item index...`);

                const itemIndex = tiers[sourceRowIndex].items.findIndex(i => i.id === itemId);
                if (itemIndex === -1) {
                    console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]-| ERROR |: Item's index in the specified 'row' index of: ${sourceRowIndex}, could NOT be found, returning...`);
                    return;
                };
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Item found at index(${itemIndex}) at row Index(${sourceRowIndex}), defining 'itemToMove'...`);

                itemToMove = tiers[sourceRowIndex].items[itemIndex];
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Item moving: `, itemToMove);

                const indexToRemove = tiers[sourceRowIndex].items;
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Created 'indexToRemove' as shorthand access to 'tiers' (draft.rows) -> sourceRowIndex (rows array at specific index) -> items array, splicing using the 'itemIndex'...`);

                indexToRemove.splice(itemIndex, 1);

                console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Tier item removed from original position. Proceeding with new insertion...");
            }

            if (targetContainerId === 'unranked') {
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Target destination IS 'unranked', splicing...`);
                if (targetIndex !== null || !(!targetIndex)) {
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Target Index legible, performing 'splice'...");
                    unranked.splice(targetIndex, 0, itemToMove);
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Drop Finished!");
                } else {
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Target Index NOT legible, performing standard 'push'...");
                    unranked.push(itemToMove);
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Drop Finished!");
                }
            } else {
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: Target destination is NOT 'unranked', finding row index...`);
                const rowIndex = tiers.findIndex(r => r.id === targetContainerId);
                if (rowIndex === -1) {
                    console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]-| ERROR |: rowIndex could NOT be found in 'rows', returning...`);
                    return;
                }
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: 'rowIndex created', destination for item found at index(${rowIndex}) of 'rows' which has the id of: ${tiers[rowIndex].id}, generating 'indexToAdd' for item splicing...`);

                const indexToAdd = tiers[rowIndex].items;
                console.log(`|( useTierList )|> DROP ITEM <|[SET STATE]: 'indexToAdd: `, indexToAdd);

                if (targetIndex !== null || !(!targetIndex)) {
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Target Index legible, performing 'splice'...");
                    indexToAdd.splice(targetIndex, 0, itemToMove);
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Drop Finished!");
                } else {
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Target Index NOT legible, performing standard 'push'...");
                    indexToAdd.push(itemToMove);
                    console.log("|( useTierList )|> DROP ITEM <|[SET STATE]: Drop Finished!");
                }
            }
        })
        console.log("|( useTierList )| DROP ITEM | Function Done! Returning state!");

    }, [set]);

    const addItem = useCallback((item) => {
        console.log("|( useTierList )| ADD ITEM | Function called!");
        set(draft => {
            if (!draft) {
                console.log("|( useTierList )|> ADD ITEM <|[SET STATE]-| ERROR |: Draft not available, returning...", draft);
                return;
            };

            if (!item || item === null) {
                console.log("|( useTierList )|> ADD ITEM <|[SET STATE]-| ERROR |: 'item' parameter is missing, returning...");
                return;
            };

            const unranked = draft.unranked;
            const { id, label: text, image } = item;

            console.log(`|( useTierList )|> ADD ITEM <|[SET STATE]: Referencing 'unranked' array by accessing 'draft.unranked' - `, unranked);
            console.log(`|( useTierList )|> ADD ITEM <|[SET STATE]: Destructured 'item' into - id: ${id}, text: ${text}, image: ${image}`);

            console.log("|( useTierList )|> ADD ITEM <|[SET STATE]: Pushing object into unranked array...");
            unranked.push({ id: id, text: text, image: image });
            console.log("|( useTierList )|> ADD ITEM <|[SET STATE]: Push complete!");
        });
        console.log("|( useTierList )| ADD ITEM | Function finished! Returning state!");
    }, [set]);

    const deleteItem = useCallback((targetId, sourceContainerId) => {
        console.log("|( useTierList )| DELETE ITEM | Function called!");
        set(draft => {
            if (!draft) {
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]-| ERROR |: Draft not available, returning...", draft);
                return;
            };

            if (!targetId || targetId === null) {
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]-| ERROR |: 'targetId' parameter is missing, returning...");
                return;
            };

            if (!sourceContainerId || sourceContainerId === null) {
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]-| ERROR |: 'sourceContainerId' parameter is missing, returning...");
                return;
            };
            
            const unranked = draft.unranked;
            const rows = draft.rows;

            if (sourceContainerId === 'unranked') {
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]: 'sourceContainerId' is unranked, finding item's index for deletion...");
                const itemIndex = unranked.findIndex(i => i.id === targetId);

                if (itemIndex === -1 || itemIndex === null || itemIndex === undefined || !itemIndex) {
                    console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]-| ERROR |: Could not find the item's index to delete based on the specified targetId: ", targetId);
                };

                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]: Found itemIndex: ", itemIndex);
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]: Proceeding with deletion...");

                unranked.splice(itemIndex, 1);
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]: Deletion completed!");
            } else {
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]: 'sourceContainerId' is NOT unranked, finding row index...");
                const rowActual = rows.find(r => r.id === sourceContainerId);

                if (rowActual === -1 || rowActual === null || rowActual === undefined || !rowActual) {
                    console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]-| ERROR |: Could not find the row object based on the specified sourceContainerId: ", sourceContainerId);
                    return;
                };

                console.log(`|( useTierList )|> DELETE ITEM <|[SET STATE]: 'rowActual' found at ${rowActual}`);
                console.log(`|( useTierList )|> DELETE ITEM <|[SET STATE]: Finding item within rowIndex...`);

                // const itemToDelete = rowActual.items.find(i => i.id === targetId);

                // if (itemToDelete === -1 || itemToDelete === null || itemToDelete === undefined || !itemToDelete) {
                //     console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]-| ERROR |: Could not find the item's index based on the specified targetId: ", targetId);
                //     return;
                // };

                const itemToDeleteIndex = rowActual.items.findIndex(item => String(item.id) === String(targetId));
                if (itemToDeleteIndex === -1 || itemToDeleteIndex === null || itemToDeleteIndex === undefined) {
                    console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]-| ERROR |: Could not find the item's index based on the specified targetId: ", targetId);
                    return;
                };

                console.log(`|( useTierList )|> DELETE ITEM <|[SET STATE]: 'itemToDelete' found at ${itemToDeleteIndex}`);
                console.log(`|( useTierList )|> DELETE ITEM <|[SET STATE]: Proceeding with deletion...`);

                rowActual.items.splice(itemToDeleteIndex, 1);
                console.log("|( useTierList )|> DELETE ITEM <|[SET STATE]: Deletion completed!");
            };
            
        })
        console.log("|( useTierList )| DELETE ITEM | Function finished! Returning state!");
    }, [set]);

    const undo = useCallback(() => {
        console.log("|( useTierList )| UNDO | Function called!");
        station(draft => {
            console.log("|( useTierList )|> UNDO <|[station]: Mutating draft -> Saving 'currentPresent' and pushing it to 'draft.future' -> removing last element of 'draft.past' and saving it as 'newPresent' to update 'draft.present'...");
            if (draft.past.length === 0) {
                console.log("|( useTierList )| REDO | draft.future is empty, returning!");
                return;
            }
            const currentPresent = draft.present;
            const newPresent = draft.past.pop();
            // const newPast = draft.past.slice(0, -1);

            // draft.past = newPast;
            draft.present = newPresent;
            draft.future = [...draft.future, currentPresent];
        });
        console.log("|( useTierList )| UNDO | Function finished! Returning state!");
    }, [station]);

    const redo = useCallback(() => {
        console.log("|( useTierList )| REDO | Function called!");
        station(draft => {
            if (draft.future.length === 0) {
                console.log("|( useTierList )| REDO | draft.future is empty, returning!");
                return;
            }
            const currentPresent = current(draft.present);
            const newPresent = draft.future.pop();
            const newFuture = draft.future.slice(0, -1);

            draft.past = [...draft.past, currentPresent];
            draft.present = newPresent;
            // draft.future = newFuture;
        });
        console.log("|( useTierList )| REDO | Function finished! Returning state!");
    }, [station]);

    const reset = useCallback(() => {
        console.log("|( useTierList )| REDO | Function called!");
        station(draft => {
            if (draft.present === initialData) {
                console.log("|( useTierList )|> REDO <|[STATION]: 'draft.present' is the same as the 'initialData'! Returning!");
                return;
            };

            draft.past = [];
            draft.present = initialData;
            draft.future = [];
        });
        console.log("|( useTierList )| REDO | Function Finished! Returning state!");
    }, [station, initialData]);

    const clear = useCallback(() => {
        console.log("|( useTierList )| CLEAR | Function called!");
        set(present => {
            if (present === undefined || present === null) {
                console.log("|( useTierList )|> REDO <|[STATION]: 'present' is not available! Returning!");
                return;
            };

            const rows = present.rows;
            const unranked = present.unranked;

            if (rows.length === 0) {
                console.log("Draft.present has no rows or is undefined, returning!");
                return;
            };

            rows.forEach(row => {
                if (row.items && row.items.length > 0) {
                    unranked.push(...row.items);
                    row.items = [];
                }
            });
        });
    },[set]);

    const checkItemExists = useCallback((itemId) => {
        console.log("|( useTierList )| CHECK ITEM EXISTS | Function called!");
        
        if (!itemId || itemId === null) {
            console.log("|( useTierList )|> CHECK ITEM EXISTS <|[ ERROR ]: 'itemId' parameter is missing, returning...");
            return;
        };

        const unranked = state.present.unranked;
        const rows = state.present.rows;

        const isItemInUnranked = unranked.some(i => i.id === itemId);

        if (isItemInUnranked) {
            console.log("|( useTierList )|> CHECK ITEM EXISTS <|[ POSITIVE ]: Item exists in unranked container, returning TRUE");
            return true;
        }
        
        const searchRows = (element) => element.items.some(i => i.id === itemId);
        const isItemInRows = rows.some(searchRows);

        if (isItemInRows) {
            console.log("|( useTierList )|> CHECK ITEM EXISTS <|[ POSITIVE ]: Item exists in rows, returning TRUE");
            return true;
        } else {
            console.log("|( useTierList )|> CHECK ITEM EXISTS <|[ NEGATIVE ]: Item NOT found in either container, returning FALSE");
            return false;
        }
    }, [state]);

    return {
        tierList: state.present,
        checks: {
            canUndo: state.past.length > 0,
            canRedo: state.future.length > 0,
            checkItemExists,
        },
        actions: {
            updateRow,
            updateTitle,
            createNewTier,
            deleteTier,
            moveItem,
            dropItem,
            addItem,
            deleteItem,
            undo,
            redo,
            reset,
            clear,
        }
    }
}