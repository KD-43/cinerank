import update from 'immutability-helper';
import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DragCard } from './DraggableCard';
import DropZone from './DropTarget';
import { ErrorBoundary } from 'react-error-boundary';
import { ItemTypes } from './ItemTypes';

const INITIAL_CARDS = [
    { id: 1, text: 'Movie Poster A' },
    { id: 2, text: 'Movie Poster B' },
    { id: 3, text: 'Movie Poster C' },
    { id: 4, text: 'Movie Poster D' },
];

export default function DndContainer () {
    const [ lists, setLists ] = useState({
        source: INITIAL_CARDS,
        dropzone: [],
    });

    const moveCard = useCallback((dragIndex, hoverIndex, container) => {
        console.log(container, dragIndex);
        const card = lists[container][dragIndex];

        setLists(
            update(lists, {
                [container]: {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, card],
                    ],
                }
            })
        );

    }, [lists]);

    const dropCard = useCallback((item, targetContainer) => {
        const { id: cardId, container: sourceContainer } = item;
        console.log('id: ', cardId, 'container: ', sourceContainer, 'targetContainer: ', targetContainer);

        console.log(`--- dropCard called ---`);
        console.log(`Attempting to move card ${cardId} from '${sourceContainer}' to '${targetContainer}'`);
        console.log('State BEFORE update:', lists);

        if (sourceContainer === targetContainer) {
            console.log('Drop in same container, ignoring.');
            return;
        };

        const cardIndex = lists[sourceContainer].findIndex(c => c.id === cardId);
        if (cardIndex === -1) {
            console.error('Card not found in source list!');
            return
        };

        const cardToMove = lists[sourceContainer][cardIndex];

        console.log('cardIndex: ', cardIndex);
        console.log('cardToMove: ', cardToMove);


        const newListsState = update(lists, {
            [sourceContainer]: { $splice: [[cardIndex, 1]] },
            [targetContainer]: { $push: [cardToMove] },
        })

        console.log('State AFTER update command:', newListsState);

        console.log('source array: ', lists.source);
        console.log('dropzone array: ', lists.dropzone);

        setLists(newListsState);

    }, [lists]);

    const [, sourceDrop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        drop: () => ({ container: 'source' }),
    }));

    

    return (
        <ErrorBoundary fallbackRender={<div>An error occurred in the 'DndContainer' component</div>}>
            <div className="container">
                
                <h3 className="text-light pb-5">Sortable Card List - Container: Source</h3>
                <div ref={sourceDrop} className="d-flex flex-wrap align-content-start bg-primary">
                    {/* {lists.source.map((card, index) => (
                        <DragCard 
                            key={card.id}
                            {...card} 
                            container="source" 
                            index={index} 
                            moveCard={moveCard}
                            onDropCard={dropCard}
                        />
                    ))} */}
                    <DropZone
                        onDropCard={dropCard}
                        moveCard={moveCard}
                        cards={lists.source}
                        container="source"
                    />
                </div>
                
                <h3 className="text-light pt-5 pb-5">Sortable Card List - Container: Dropzone</h3>
                <DropZone
                    onDropCard={dropCard}
                    moveCard={moveCard}
                    cards={lists.dropzone}
                    container="dropzone"
                />
            </div>
        </ErrorBoundary>
    );
}