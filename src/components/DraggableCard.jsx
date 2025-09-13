import React, { useEffect, useRef, memo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import Button from 'react-bootstrap/esm/Button';
import { ImageFill, Trash } from 'react-bootstrap-icons';

const styles = {
    cursor: 'pointer',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    width: '5rem',
    height: '10rem',
}

export function DragCard ({ id, text, image, index, container, moveCard, deleteItem, }) {
    const [ isDeleteBtnVisible, setIsDeleteBtnVisible ] = useState(false);
    const [ isDeleteMenuVisible, setIsDeleteMenuVisible ] = useState(false);

    const ref = useRef(null);
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    const handleMouseOver = () => {
        setIsDeleteBtnVisible(true);
    };
    const handleMouseOut = () => {
        setIsDeleteBtnVisible(false);
        // setIsDeleteMenuVisible(false);
    };

    // useEffect(() => {
    //     const card = ref.current;

    //     if (card) {
    //         card.addEventListener('mouseover', handleMouseOver);
    //         card.addEventListener('mouseout', handleMouseOut);
    //     }

    //     return () => {
    //         card.removeEventListener('mouseover', handleMouseOver);
    //         card.removeEventListener('mouseout', handleMouseOut);
    //     };

    // }, []);

    useEffect(() => {
        if (isDeleteBtnVisible) {
            return;
        };
        setIsDeleteMenuVisible(false);
    }, [isDeleteBtnVisible])

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => ({ id, text, index, container}),
        
        // end: (item, monitor) => {
        //     const didDrop = monitor.didDrop();
        //     const dropResult = monitor.getDropResult();
        //     if (didDrop && dropResult && dropResult.container !== item.container) {
        //         onDropCard(item, dropResult.container);
        //     }
        // },

        collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    })
    
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: (draggedItem) => draggedItem.container === container,
        hover(item, monitor) {
            if (!ref.current || item.id === id || item.container !== container) {
                console.log(`/useDrop/[hover function] --- | ERROR | Following parameters determined 'false' or 'not permitted': 'ref.current is false'(${ref.current}), 'item.id(${item.id}) equals to the current id(${id})', 'item.container(${item.container}) is not in the same container(${container})' // returning...`);
                return;
            };
            console.log(`/useDrop/[hover function] --- |[ 1 ]| Proceeding to find 'dragIndex' and 'hoverIndex'...`);
            const dragIndex = item.index;
            const hoverIndex = index;
            
            if (dragIndex === hoverIndex) {
                console.log(`/useDrop/[hover function] --- | ERROR | dragIndex(${dragIndex}) and hoverIndex(${hoverIndex}) are the same, // returning ...`);
                return;
            };

            console.log(`/useDrop/[hover function] --- |[ 1 ]|>>|( RESULT )| Found 'dragIndex'(${dragIndex}) and 'hoverIndex'(${hoverIndex})`);

            console.log(`/useDrop/[hover function] --- |[ 2 ]| Checking Bounding box to prevent jumpy swaps...`);

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
                console.log(`/useDrop/[hover function] --- | ERROR | 'dragIndex(${dragIndex})' is less than 'hoverIndex(${hoverIndex})', AND 'hoverClientX(${hoverClientX})' is less than 'hoverMiddleX(${hoverMiddleX}) // returning...`);
                return;
            };

            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
                console.log(`/useDrop/[hover function] --- | ERROR | 'dragIndex(${dragIndex})' is greater than 'hoverIndex(${hoverIndex})', AND 'hoverClientX(${hoverClientX})' is greater than 'hoverMiddleX(${hoverMiddleX}) // returning...`);
                return;
            };

            console.log(`/useDrop/[hover function] --- |[ 2 ]|>>|( RESULT )| 'dragIndex(${dragIndex})' & 'hoverIndex(${hoverIndex})', 'hoverClientX(${hoverClientX})' & 'hoverMiddleX(${hoverMiddleX}) determined to be acceptable params for clean swapping // Proceeding...`);

            console.log(`/useDrop/[hover function] --- |[ 3 ]| Invoking 'moveCard(dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}, container: ${container})' callback function // Processing...`);

            moveCard(dragIndex, hoverIndex, container);
            item.index = hoverIndex;

            console.log(`/useDrop/[hover function] --- |[ 3 ]|>>|( RESULT )| moveCard() callback function finished, item.index(${item.index}) is now the hoverIndex(${hoverIndex}), // Exiting...`);
        },
    });

    const opacity = isDragging ? 0.5 : 1;
    const bgColor = image === null || image === undefined ? "itemCardBgColor" : null;

    const handleDeleteMenuVisible = () => {
        setIsDeleteMenuVisible(!isDeleteMenuVisible);
    };
    
    drag(drop(ref));

    return (
        <div
            ref={ref}
            data-id={id}
            className={`card itemCard shadow-sm p-0`}
            style={{
                opacity,
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            {image !== null && image !== undefined ? 
                <img src={`${imageBaseUrl}${image}`} alt={`Thumbnail image for ${text}`} className="card-img" />
                :
                <div className="itemCardBgColor">
                    <ImageFill className="svg-gray-300" size={24} />
                </div> 
            }
            <div className="card-img-overlay d-inline-flex flex-column">
                {isDeleteBtnVisible && (
                    <div className="d-inline-flex itemCardDeleteBtn align-items-center justify-content-center" onClick={handleDeleteMenuVisible}>
                        <p className="card-text m-0">X</p>
                    </div>
                )}
                {isDeleteMenuVisible && (
                    <div className='itemCardDeleteActual d-inline-flex align-items-center justify-content-center' onClick={() => deleteItem(id, container)}>
                        <Trash className='text-light' size={24}/>
                    </div>
                )}
            </div>
        </div>
    )
}