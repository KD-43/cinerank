import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { produce } from 'immer';

// Method 1: Basic method with more complex stacks management
function useUndo (initialPresent) {
    const [ state, setState ] = useState({
        past: [],
        present: initialPresent,
        future: [],
    });

    const canUndo = state.past.length > 0; //Check if our past array has any elements
    const canRedo = state.future.length > 0; //Check if our future array has any elements

    // Acts as a more robust setState function that leverages useCallback to record our history before updating the present
    const set = useCallback((newPresent) => {
        setState(currentState => {
            const { past, present } = currentState;
            if (newPresent === present) {
                return currentState;
            }
            return {
                past: [...past, present], // Add old present to past
                present: newPresent, // Set the new present
                future: [], // Clear the future
            };
        });
    }, []);
    
    const undo = useCallback(() => {
        setState(currentState => {
            const { past, present, future } = currentState;
            if (past.length === 0) {
                return currentState;
            }

            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [present, ...future], // Add old present to the future
            };

        });
    }, []);

    const redo = useCallback(() => {
        setState(currentState => {
            const { past, present, future } = currentState;
            if (future.length === 0) {
                return currentState;
            }

            const next = future[0];
            const newFuture = future.slice(1);

            return {
                past: [...past, present], // Add old present to past
                present: next,
                future: newFuture,
            };
        });
    }, []);

    // Returning the present state and the functions to manipulate it
    return { state: state.present, set, undo, redo, canUndo, canRedo }
};

// Method 2: useReducer - transitioning from one state to the next { set, undo, redo }
//  - takes the current state and an "action" and return the new state
//  - moves all the complex logic into one pure function
//  - makes the hook code cleaner or more predictable

const undoReducer = (state, action) => {
    const { past, present, future } = state;

    switch (action.type) {
        case 'UNDO':
            if (past.length === 0){
                return state;
            };
            const previous = past[past.length - 1];
            const newPast= past.slice(0, past.length - 1);
            return {
                past: [...past, newPast],
                present: previous,
                future: [present, ...future],
            };
        case 'REDO':
            if (future.length === 0) {
                return state;
            }
            const next = future[0];
            const newFuture = future.slice(1);
            return {
                past: [...past, present],
                present: next,
                future: newFuture,
            };
        case 'SET':
            const { newPresent } = action;
            if (newPresent === present) {
                return state;
            }
            return {
                past: [...past, present],
                present: newPresent,
                future: [],
            };
        case 'RESET':
            return {
                past: [],
                present: action.newPresent,
                future: [],
            }
        default:
            return state;
    }
};

const useUndoVersion2 = (initialPresent) => {
    const [ state, dispatch ] = useReducer(undoReducer, {
        past: [],
        present: initialPresent,
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
    const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
    const set = useCallback((newPresent) => dispatch({ type: 'SET', newPresent }), []);
    const reset = useCallback((newPresent) => dispatch({ type: 'RESET', newPresent }), []);

    return { state: state.present, set, undo, redo, reset, canUndo, canRedo };
}

//Method 3: Integrating immer into our reducer to work mutable versions of our history object - with clearer syntax
const deepClone = (obj) => {
    if (obj === null || obj === undefined) return obj;
    return JSON.parse(JSON.stringify(obj));
};

const undoReducerWithImmer = (draft, action) => {
    console.log("Reducer received action:", action.type);
    switch (action.type) {
        case 'UNDO':
            if (draft.past.length > 0) {
                console.log("draft.past.length is greater than 0 -- the draft:", draft.past);
            }
            if (draft.past.length === 0) {
                console.log('draft.past.length is 0, returning');
                return;
            };
            const previous = draft.past.pop();
            draft.future.unshift(draft.present);
            draft.present = previous;
            return;

        case 'REDO':
            if (draft.future.length === 0) return;
            const next = draft.future.shift();
            draft.past.push(draft.present);
            draft.present = next;
            return;

        case 'SET':
            // const newPresent = typeof action.payload === 'function'
                // ? action.payload(draft.present)
            //     : action.payload;
            // console.log("newPresent:", newPresent);

            const newPresent = action.payload;

            if (newPresent === draft.present) return;
            if (draft.present !== null) {
                draft.past.push(draft.present);
            }
            draft.present = newPresent;
            draft.future = [];
            return;

        case 'RESET':
            draft.past = [];
            draft.present = action.newPresent;
            draft.future = [];
            return;

        default:
            return;
    }
}

// METHOD $: TO PREVENT STALE DATA FROM BEING MANAGED, LEVERAGING 'PRODUCE' FROM 'IMMER' package
const undoReducer_v2 = (state, action) => {
    switch (action.type) {
        case 'UNDO':
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, state.past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [state.present, ...state.future],
            };

        case 'REDO':
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, state.present],
                present: next,
                future: newFuture,
            };

        case 'SET':
            const newPresent = action.newPresent;
            if (newPresent === state.present) return state;
            return {
                past: [...state.past, state.present],
                present: newPresent,
                future: [],
            };

        case 'RESET':
            return {
                past: [],
                present: action.newPresent,
                future: [],
            }

        default:
            return state;
    }
}

const undoReducer_v3 = (state, action) => {
    const lastStateItem = state.past.length - 1;
    switch (action.type) {
        case 'UNDO':
            console.log("Action called: UNDO --- Proceeding...");
            if (state.past.length > 0) {
                console.log("state.past.length is greater than 0 -- the state:", state.past);
            }
            if (state.past.length === 0) {
                console.log('state.past.length is 0, returning state: ', state);
                return state;
            };
            const previous = state.past[lastStateItem];
            const newPast = state.past.slice(0, lastStateItem);
            return {
                past: newPast,
                present: previous,
                future: [state.present, ...state.future],
            };

        case 'REDO':
            console.log("Action called: REDO --- Proceeding...");
            if (state.future.length === 0) {
                console.log("state.future is empty, returning state: ", state);
                return state
            };
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, state.present],
                present: next,
                future: newFuture,
            };

        case 'SET':
            console.log("Action called: SET --- Proceeding...");
            const newPresent = typeof action.payload === 'function'
                ? action.payload(state.present)
                : action.payload;
            console.log("newPresent:", newPresent);

            if (newPresent === state.present) {
                console.log("newPresent === to state.present returning state: ", state);
                return state;
            };
            if (state.present === null) {
                console.log("state.present is currently null, returning current history object with the present of: ", newPresent);
                const newState = {
                    past: [],
                    present: newPresent,
                    future: [],
                }
                console.log("Returning newState: ", newState);
                return newState;
            }
            return {
                past: [...state.past, state.present],
                present: newPresent,
                future: [],
            }

        case 'RESET':
            console.log("Action called: RESET --- Proceeding...");
            return {
                past: [],
                present: action.newPresent,
                future: [],
            }

        default:
            console.log("current state: ", state);
            return state;
    }
}

const undoReducerPlusImmer = produce(undoReducer_v2);

export const useAdvStateManager = (initialPresent) => {
    const [ state, dispatch ] = useImmerReducer(undoReducerWithImmer, {
        past: [],
        present: initialPresent,
        future: [],
    });

    useEffect(() => {
        if (initialPresent !== undefined && initialPresent !== state.present) {
            dispatch({ type: 'RESET', newPresent: initialPresent })
        }
    }, [initialPresent]);

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => dispatch({ type: 'UNDO' }), [dispatch]);
    const redo = useCallback(() => dispatch({ type: 'REDO' }), [dispatch]);
    const set = useCallback((newPresent) => dispatch({ type: 'SET', payload: newPresent }), [dispatch]);
    const reset = useCallback((newPresent) => dispatch({ type: 'RESET', newPresent }), [dispatch]);

    return { state: state.present, set, undo, redo, reset, canUndo, canRedo };
}

// export const useAdvStateManager = (initialPresent) => {
//     const [ state, dispatch ] = useReducer(undoReducer_v3, {
//         past: [],
//         present: initialPresent,
//         future: [],
//     });

//     useEffect(() => {
//         if (initialPresent !== undefined && initialPresent !== state.present) {
//             dispatch({ type: 'RESET', newPresent: initialPresent });
//         }
//     }, [initialPresent]);

//     const canUndo = state.past.length > 0;
//     const canRedo = state.future.length > 0;

//     const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
//     const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
//     const set = useCallback((payload) => dispatch({ type: 'SET', payload }), []);
//     const reset = useCallback((newPresent) => dispatch({ type: 'RESET', newPresent }), []);

//     return { state: state.present, set, undo, redo, reset, canUndo, canRedo };
// }