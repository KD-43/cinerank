import React, {  useRef, useEffect, memo } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { DragCard } from './DraggableCard';

const style = {
    height: '12rem',
    width: '12rem',
    color: 'white',
    padding: '1rem',
    textAlign: "center",
}

export default function DropZone ({ cards, container, moveCard, onDropCard }) {
    // const onDropCardRef = useRef(onDropCard);

    // useEffect(() => {
    //     console.log("* [DROPZONE LOG]: onDropCard function has been updated in DropZone.");
    //     onDropCardRef.current = onDropCard;
    //     console.log(`* [DROPZONE LOG]: onDropCard currently: ${onDropCard}`);
    // }, [onDropCard]);

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        drop: () => ({ container: container }),
        collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
    }));

    const isActive = isOver && canDrop;

    return (
        <div 
            ref={drop}
            className="d-flex flex-column bg-secondary"
            style={{
                ...style,
            }}
        
        >
            {cards.map((card, index) => (
                <DragCard
                    key={card.id}
                    {...card}
                    index={index}
                    container={container}
                    moveCard={moveCard}
                    onDropCard={onDropCard}
                />
            ))}

            {cards.length === 0 && (
                <p className="text-muted mb-0">Add cards to this dropzone container</p>
            )}
        </div>
    );
}