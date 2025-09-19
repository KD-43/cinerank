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

function findClosestIndex(monitor, ref, cards) {
    if (!ref.current) return cards.length;

    const clientOffset = monitor.getClientOffset();
    let closest = { distance: Infinity, index: cards.length };

    if (cards.length === 0) {
        return 0;
    }

    for (let i = 0; i < cards.length; i++) {
        const cardNode = ref.current.querySelector(`[data-id="${cards[i].id}"]`);
        if (cardNode) {
            const cardRect = cardNode.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(clientOffset.x - cardCenterX, 2) + Math.pow(clientOffset.y - cardCenterY, 2)
            );

            if (distance < closest.distance) {
                closest.distance = distance;
                const xRelativeToCard = clientOffset.x - cardRect.left;
                closest.index = (xRelativeToCard < cardRect.width / 2) ? i : i + 1;
            }
        }
    }

    return closest.index;
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
            const { cards: currentItems, moveCard: currentMoveItem, container: currentContainer } = propsRef.current;

            // console.log("/useDrop/[Hover Function] --- Reading 'propsRef.current' -> 'items': ", currentItems, " 'moveItem': ", currentMoveItem, " 'rowId': ", currentRowId);

            if (!ref.current) {
                console.log("ref.current not available, returning....");
                return;
            };

            const hoverIndex = findClosestIndex(monitor, ref, currentItems);

            if (draggedItem.container === currentContainer) {
                setPhantomIndex(null);
                console.log(`[Hover Function] --- draggedItem.container: ${draggedItem.container} === currentContainer: ${currentContainer}`);
                const dragIndex = draggedItem.index;

                console.log("dragIndex: ", dragIndex);

                if (hoverIndex === -1 || dragIndex === hoverIndex) {
                    console.log("hoverIndex returned -1, or dragIndex is the same as hoverIndex, returning...");
                    return;
                }

                console.log("Created hoverIndex: ", hoverIndex);

                const adjustedHoverIndex = (dragIndex < hoverIndex) ? hoverIndex - 1 : hoverIndex;

                if (dragIndex === adjustedHoverIndex) return;

                // console.log(`Moving forward with moveItem(dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}), currentContainer: ${currentContainer},`);

                currentMoveItem(dragIndex, adjustedHoverIndex, currentContainer);

                draggedItem.index = adjustedHoverIndex;
                return;
            } else {
                console.log(`draggedItem.container: ${draggedItem.container} !== currentContainer: ${currentContainer}`);
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