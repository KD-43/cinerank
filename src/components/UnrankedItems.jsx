import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DropZone from './TierDropzone';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

export function UnrankedItems ({ items, dropItem, moveItem, deleteItem }) {
    // const [ isItemList, setItemList ] = useState(items);

    // useEffect(() => {
    //     setItemList(items);
    // }, [items]);

    // const [, sourceDrop] = useDrop(() => ({
    //     accept: ItemTypes.CARD,
    //     drop: () => ({ container: 'source' }),
    // }));

    return (
        <ErrorBoundary fallbackRender={<div>An error occurred in the 'UnrankedItems' component</div>}>
            <div className="unrankedItemsWrapper">
                    <DropZone
                        onDropCard={dropItem}
                        moveCard={moveItem}
                        cards={items}
                        container="unranked"
                        deleteItem={deleteItem}
                    />
            </div>
        </ErrorBoundary>
    )
}