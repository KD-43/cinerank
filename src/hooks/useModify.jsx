import { useCallback, useEffect, useMemo, useState } from 'react';
import update from 'immutability-helper';
import { produce } from 'immer';

class Tier {
    constructor(id, label, color, items) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.items = items;
    }
}

const colorTheme = ['bg-pink-300', 'bg-red-300', 'bg-orange-300', 'bg-yellow-300', 'bg-green-300', 'bg-teal-300', 'bg-cyan-300', 'bg-blue-300', 'bg-indigo-300', 'bg-purple-300', 'bg-gray-300', 'bg-black'];

export function useModify (setTierList) {

    const updateRow = (rowId, newRowData) => {

        setTierList(prevState => {

            const newState = produce(prevState, draft => {
                if (!draft) {
                    console.log("Draft not available, returning...", draft);
                    return;
                };
                const row = draft.rows.find(r => r.id === rowId);
                if (row) {
                    Object.assign(row, newRowData);
                };
            });

            return newState;
        });
    };

    const createNewTier = () => {

        const newState = produce(tierList, draft => {
            if (!draft) {
                console.log("Draft not available, returning...", draft);
                return;
            };
            const newRow = () => {
                const str = 'SABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const index = draft.rows.length;
                const strAtIndex = str[index];
                const color = colorTheme[index];

                console.log(`str(${str}), index(${index}), strIndex(${strAtIndex}), and color(${color}), created!`);

                const newTier = new Tier(`row-${strAtIndex}`, `${strAtIndex} Tier`, color, []);
                console.log('newTier object created: ', newTier);
                
                return newTier
            }

            draft.rows.push(newRow());
        });

        setTierList(newState);
    };

    const deleteTier = (targetId) => {

        const newState = produce(tierList, draft => {
            if (!draft) {
                console.log("Draft not available, returning...", draft);
                return;
            };
            console.log('deleteTier function called, received targetId: ', targetId);
            const rowIndex = draft.rows.findIndex(r => r.id === targetId);
            if (rowIndex || rowIndex !== -1) {
                draft.rows.splice(rowIndex, 1);
            }
        })

        setTierList(newState);
    };

    const moveItem = (dragIndex, hoverIndex, containerId) => {

        const newState = produce(tierList, draft => {
            if (!draft) {
                console.log("Draft not available, returning...", draft);
                return;
            }
            console.log(`--- moveItem called --- `);
            const unranked = draft.unranked;
            const row = draft.rows;
            console.log(`[PREFACE 0A]: 'unranked' shorthand const created to access 'draft.unranked': `, unranked);
            console.log(`[PREFACE 0B]: 'row' shorthand const created to access 'draft.rows': `, row);

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
                const rowIndex = row.findIndex(r => r.id === containerId);
                if (!rowIndex || rowIndex === -1) {
                    console.log(`[2AI]: ABORT - rowIndex invalid, returned false or -1`);
                    return;
                };

                console.log(`[2B]: rowIndex(${rowIndex}), created from draft.rows.findIndex(): rows(${row}) + findIndex(${rowIndex})`);
                
                const draggedItem = row[rowIndex].items[dragIndex];
                console.log(`[2C]: draggedItem(${draggedItem}), created from draft.rows[rowIndex].items[dragIndex]: 'rows' at Index(${row[rowIndex]}) + items at Index(${row[rowIndex].items[dragIndex]})`);
                
                if (!draggedItem || draggedItem === undefined) {
                    console.log(`[2CI]: Could not find 'draggedItem' at the given parameters: 'draft.rows'(${row}), at the 'index'(${rowIndex}), in its 'items' array at 'dragIndex'(${dragIndex}) --- returning...`);
                    return;
                }

                const itemsAtRowIndex = row[rowIndex].items;
                console.log("[2D]: Created 'itemsAtRowIndex' for shorthand access to 'items' array at specified 'rows' index: ", itemsAtRowIndex);

                const updateDraft = () => {
                    itemsAtRowIndex.splice(dragIndex, 1);
                    itemsAtRowIndex.splice(hoverIndex, 0, draggedItem);
                }

                console.log('[2E]: updateDraft created -- returning function...', updateDraft);

                updateDraft();
            }
        })

        console.log(`[INITIALIZED]: 'newState' function finished, and has returned: value(${newState}). Setting new state for TierList...`, newState);

        setTierList(newState);
    };

    const dropItem = (draggedItem, targetContainerId, targetIndex) => {

        const newState = produce(tierList, draft => {
            if (!draft) {
                console.log("Draft not available, returning...", draft);
                return;
            };

            // console.clear();
            console.log(`--- dropItem called --- `);
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

                console.log(`--- MOVING TO updateCommand ---`);
            }

            if (targetContainerId === 'unranked') {
                console.log(`Target destination: 'unranked', pushing...`);
                if (targetIndex !== null || !(!targetIndex)) {
                    unranked.splice(targetIndex, 0, itemToMove);
                } else {
                    unranked.push(itemToMove);
                }
                console.log(`--- MOVING TO FINAL UPDATE INSERTION --- `);
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

                console.log(`--- MOVING TO FINAL UPDATE INSERTION --- `);
            }
        });

        console.log("newState created: ", newState);
        setTierList(newState);
    };

    const actions = {
        updateRow,
        createNewTier,
        deleteTier,
        moveItem, 
        dropItem,
    };

    return actions;
}