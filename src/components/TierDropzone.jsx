import React, {  useRef, useEffect, useState, memo } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { DragCard } from './DraggableCard';

function PhantomCard () {
    return (
        <div className="card-phantom m-1">
            
        </div>
    )
}

export default function DropZone ({ cards, container, moveCard, onDropCard, deleteItem, ...other }) {

    // Ref to dropZone's main div for calculations
    const ref = useRef(null);
    const propsRef = useRef({ cards, container, moveCard, onDropCard });

    // State tp track where the phantom preview should be shown
    // 'null' meaning no preview is active. A number means index
    const [ phantomIndex, setPhantomIndex ] = useState(null);

    useEffect(() => {
        propsRef.current = { cards, container, moveCard, onDropCard }
    }, [ cards, container, moveCard, onDropCard ]);

    const [{ isOverShallow, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,

        drop: (draggedItem, monitor) => {
            console.log(`/useDrop/[drop function] --- |[ 0 ]| Function invoked, with draggedItem: `, draggedItem, ", moving forward with destructure of propsRef.current variables and functions");

            if (monitor.didDrop()) {
                console.log(`/useDrop/[drop function] --- | STOP | A card has already handled the drop!, Returning...`);
                return;
            }

            const { cards: currentCards, container: currentContainer, moveCard: currentMoveCard, onDropCard: currentDropCard, } = propsRef.current;

            if (!propsRef.current) {
                console.log("/useDrop/[drop function] --- | ERROR | propsRef.current not available, returning...", propsRef.current);
                return;
            };

            if (!ref.current) {
                console.log("/useDrop/[drop function] --- | ERROR | ref.current not available, returning...", ref.current);
                return;
            };
            
            console.log(`/useDrop/[drop function] --- |[ 0 ]|>>| RESULT | Found currentCards: `, currentCards, `, currentContainer: `, currentContainer, `, currentDropCard: `, currentDropCard);

            if (draggedItem.container !== 'unranked') {
                console.log(`/useDrop/[drop function] --- |[ 1 ]| 'draggedItem.container'(${draggedItem.container}) is NOT from unranked, proceeding with drop...`);

                const targetIndex = phantomIndex === null ? currentCards.length : phantomIndex;
                if (targetIndex) {
                    console.log(`/useDrop/[drop function] --- |[ 1 ]|>>| RESULT | 'targetIndex found: ${targetIndex}', moving forward to currentDropCard invocation...`);
                } else {
                    console.log(`/useDrop/[drop function] --- | ERROR | 'targetIndex NOT found: ${targetIndex}'`);
                }

                console.log(`/useDrop/[drop function] --- |[ 2 ]| currentDropCard(draggedItem: ${draggedItem}, 'unranked', targetIndex: ${targetIndex}), processing...`);

                currentDropCard(draggedItem, 'unranked', targetIndex);
            }

            setPhantomIndex(null);
        },

        hover(draggedItem, monitor) {
            console.log(`/useDrop/[hover function] --- |[ 0 ]| Function initiated, reading the propsRef for up-to-date and functions...`);
            const { cards: currentCards, container: currentContainer, moveCard: currentMoveCard, onDropCard: currentDropCard, } = propsRef.current;

            if (!ref.current) {
                console.log("/useDrop/[hover function] --- | ERROR | ref.current not available, returning....");
                return;
            };

            console.log(`/useDrop/[hover function] --- |[ 0 ]|>>| RESULT | Found currentCards: `, currentCards, `, currentContainer: `, currentContainer, `, currentDropCard: `, currentDropCard);

            // Only care about items from other containers
            // Reordering within same container handled by DragCard's hover
            if (draggedItem.container !== 'unranked' && monitor.isOver({ shallow: true })) {
                // FInd mouse position relative to drop zone
                const clientOffset = monitor.getClientOffset();

                // FInd the index where the new card should be inserted
                let newPhantomIndex = currentCards.length;

                //Iterate over existing cards to find the insertion point
                for (let i = 0; i < currentCards.length; i++) {
                    const cardNode = ref.current.querySelector(`[data-id="${currentCards[i].id}"]`);

                    if (cardNode) {
                        const cardRect = cardNode.getBoundingClientRect();
                        const cardMiddleX = (cardRect.right - cardRect.left) / 2;
                        const xRelativeToCard = clientOffset.x - cardRect.left;

                        if (xRelativeToCard < cardMiddleX) {
                            newPhantomIndex = i;
                            break;
                        }
                    }
                }

                setPhantomIndex(newPhantomIndex);
            } else {
                setPhantomIndex(null);
            }

        },

        leave: () => setPhantomIndex(null),

        collect: (monitor) => ({ isOverShallow: monitor.isOver({ shallow: true }), canDrop: monitor.canDrop() }),

    }));

    const isActive = isOverShallow && canDrop;

    let renderedCards = cards.map((card, index) => (
        <DragCard
            key={card.id}
            {...card}
            id={card.id}
            image={card.image}
            moveCard={moveCard}
            index={index}
            container={container}
            dropCard={onDropCard}
            deleteItem={deleteItem}
        />
    ));

    if (!isActive && phantomIndex !== null) {
        renderedCards.splice(phantomIndex, 0, <PhantomCard key="phantom" />);
    }

    drop(ref);

    return (
        <div 
            ref={ref}
            className="dropActual"

        >
            <div className="d-flex align-items-start flex-wrap">
                {renderedCards}
            </div>

        </div>
    );
}