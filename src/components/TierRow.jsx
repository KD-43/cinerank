import React, { useState, useEffect, useRef, useLayoutEffect, Fragment } from 'react';
import { DashCircle, DashCircleFill, DashSquare, DashSquareFill, DropletHalf } from 'react-bootstrap-icons';
import DropZone from './TierDropzone';
import Button from 'react-bootstrap/esm/Button';
import { ItemTypes } from './ItemTypes';
import { useDrop } from 'react-dnd';
import { DragCard } from './DraggableCard';
import { ColorPicker } from './TierColorPicker';
import { DropIndicator } from './DropIndicator';

function findHoverIndex(monitor, ref, items) {
    if (!monitor) {
        console.log("monitor is false, returning");
        return;
    }
    console.log("monitor is true, proceeding to ref eval");

    if (!ref.current) {
        console.log("Ref.current is false!, returning");
        return -1;
    };

    console.log("Ref is true, proceeding in finding hoverIndex", ref);

    if (!items) {
        console.log("There are no items available, returning!");
        return;
    }

    console.log("items array is available: ", items);

    const clientOffset = monitor.getClientOffset();

    let hoverIndex = items.length;
    console.log("Current hoverIndex: ", items.length);

    for (let i = 0; i < items.length; i++) {
        console.log(`Iteration ${i} of finding cardNode`);
        const cardNode = ref.current.querySelector(`[data-id="${items[i].id}"]`);

        if (cardNode) {
            console.log(`Found cardNode: `, cardNode);
            const cardRect = cardNode.getBoundingClientRect();
            const cardMiddleX = (cardRect.right - cardRect.left) / 2;
            const xRelativeToCard = clientOffset.x - cardRect.left;

            if (xRelativeToCard < cardMiddleX) {
                hoverIndex = i;
                break;
            }
        }
    }

    console.log("New hoverIndex to return: ", hoverIndex);

    return hoverIndex;

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

function PhantomCard () {
    return (
        <div className="card-phantom m-1">
            
        </div>
    )
};

const colorTheme = {
    black: 'bg-black',
    blue: 'bg-blue-300',
    cyan: 'bg-cyan-300',
    gray: 'bg-gray-300',
    green: 'bg-green-300',
    indigo: 'bg-indigo-300',
    orange: 'bg-orange-300',
    pink: 'bg-pink-300',
    purple: 'bg-purple-300',
    red: 'bg-red-300',
    teal: 'bg-teal-300',
    yellow: 'bg-yellow-300',
};

const colorThemeList = (theme) => {
    const array = [];
    
    for (const [key, value] of Object.entries(theme)) {
        array.push(value);
    }

    return array;
};

const colorThemeArray = colorThemeList(colorTheme);

export function TierRow ({ rowId, label, color, items, onUpdateRow, dropItem, moveItem, deleteTier, deleteItem }) {
    const [ trackedItems, setTrackedItems ] = useState(items);
    const [ localLabel, setLocalLabel ] = useState(label);
    const [ localColor, setLocalColor ] = useState(color);
    const [ isMouseOver, setIsMouseOver ] = useState(false);
    const [ isMouseOverColorBtn, setIsMouseOverColorBtn ] = useState(false);
    const [ isMouseOverDashBtn, setIsMouseOverDashBtn ] = useState(false);
    const [ isColorBtnVisible, setIsColorBtnVisible ] = useState(false);
    const [ isDropletIconColor, setIsDropletIconColor ] = useState('svg-gray-100');
    const [ isColorPickerBtnColor, setIsColorPickerBtnColor ] = useState('bg-gray-900');
    const [ isColorPickerOpen, setIsColorPickerOpen ] = useState(false);
    const [ isColorTheme, setColorTheme ] = useState(colorThemeArray);
    const [ childNodeCount, setChildNodeCount ] = useState(0);

    const colorPickerMenuRef = useRef(null);
    const colorPickerBtnRef = useRef(null);
    const ref = useRef(null);
    const propsRef = useRef({ items, moveItem, dropItem, rowId, });
    const textAreaRef = useRef(null);

    useEffect(() => {
        propsRef.current = { items, moveItem, dropItem, rowId, };
    }, [ items, moveItem, dropItem, rowId, ]);

    useEffect(() => {
        if (!items) {
            console.log("No items array available or empty, returning", items);
            return;
        };

        console.log("[TierRow]: items prop changed, updating trackedItems state var...");
        setTrackedItems(items);

    }, [items]);

    useEffect(() => {
        if (!trackedItems) {
            console.log("trackedItems false or hasn't changed, returning!");
            return;
        }
        console.log("trackedItems updated: ", trackedItems);
    }, [trackedItems]);

    useEffect(() => {
        setLocalLabel(label);
    }, [label]);

    useEffect(() => {
        setLocalColor(color);
    }, [color]);

    useLayoutEffect(() => {

        const textArea = textAreaRef.current;

        if (textArea) {
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
        };
    }, [localLabel]);

    useEffect(() => {
        if (!isColorPickerOpen) {
            return;
        };

        const handleClickOutside = (event) => {
            const isNotOnMenu = colorPickerMenuRef.current && !colorPickerMenuRef.current.contains(event.target);
            const isNotOnBtn = colorPickerBtnRef.current && !colorPickerBtnRef.current.contains(event.target);

            if (isColorBtnVisible) {
                if (isNotOnMenu && isNotOnBtn) {
                    setIsColorPickerOpen(false);
                };
            } else if (isNotOnMenu) {
                setIsColorPickerOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [isColorPickerOpen, isColorBtnVisible]);

    useEffect(() => {
        if (!isColorBtnVisible) {
            setIsColorPickerOpen(false);
        } else {
            return;
        }
    }, [isColorBtnVisible]);

    const [ phantomIndex, setPhantomIndex ] = useState(null);

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,

        //Handling items that are dropped on the background
        drop: (draggedItem, monitor) => {
            const { items: currentItems, dropItem: currentDropItem, rowId: currentRowId } = propsRef.current;

            console.log("/useDrop/[Drop Function] --- Reading 'propsRef.current' -> 'items': ", currentItems, " 'dropItem': ", currentDropItem, " 'rowId': ", currentRowId);

            if (draggedItem.container !== currentRowId) {
                const hoverIndex = findHoverIndex(monitor, ref, currentItems);
                console.log("draggedItem.container: ", draggedItem.container);
                console.log("currentRowId: ", currentRowId);
                console.log("draggedItem.container !== currentRowId, proceeding with drop...");
                console.log(`Moving forward with dropItem(draggedItem: ${draggedItem}, currentRowId: ${currentRowId}, hoverIndex: ${hoverIndex})`);
                currentDropItem(draggedItem, currentRowId, hoverIndex);
            } else {
                console.log("draggedItem.container: ", draggedItem.container);
                console.log("currentRowId: ", currentRowId);
                console.log("draggedItem.container === rowId, returning...");
            }
            
        },

        hover(draggedItem, monitor) {
            const { items: currentItems, moveItem: currentMoveItem, rowId: currentRowId } = propsRef.current;

            console.log("/useDrop/[Hover Function] --- Reading 'propsRef.current' -> 'items': ", currentItems, " 'moveItem': ", currentMoveItem, " 'rowId': ", currentRowId);

            if (!ref.current) {
                console.log("ref.current not available, returning....");
                return;
            };

            const hoverIndex = findClosestIndex(monitor, ref, currentItems);

            if (draggedItem.container === currentRowId) {
                setPhantomIndex(null);
                console.log(`[Hover Function] --- draggedItem.container: ${draggedItem.container} === currentRowId: ${currentRowId}`);
                const dragIndex = draggedItem.index;

                console.log("dragIndex: ", dragIndex);

                if (hoverIndex === -1 || dragIndex === hoverIndex) {
                    console.log("hoverIndex returned -1, or dragIndex is the same as hoverIndex, returning...");
                    return;
                }

                console.log("Created hoverIndex: ", hoverIndex);

                const adjustedHoverIndex = (dragIndex < hoverIndex) ? hoverIndex - 1 : hoverIndex;

                if (dragIndex === adjustedHoverIndex) return;

                console.log(`Moving forward with moveItem(dragIndex: ${dragIndex}, hoverIndex: ${hoverIndex}), currentRowId: ${currentRowId},`);

                currentMoveItem(dragIndex, adjustedHoverIndex, currentRowId);

                draggedItem.index = adjustedHoverIndex;
                return;
            } else {
                console.log(`draggedItem.container: ${draggedItem.container} !== currentRowId: ${currentRowId}`);
            }

            
        },

        leave: () => {
            setPhantomIndex(null);
        },

        collect: (monitor) => ({
            //collect the shallow value to control the background color
            isOver: monitor.isOver() && monitor.canDrop(),
            canDrop: monitor.canDrop(),
        }),

    }));

    drop(ref);

    const handleMouseOver = () => {
        setIsMouseOver(true);
    };

    const handleMouseOut = () => {
        setIsMouseOver(false);
    };

    const handleMouseOverColorBtn = () => {
        setIsMouseOverColorBtn(true);
        setIsDropletIconColor('svg-gray-900');
        setIsColorPickerBtnColor('bg-gray-100');
    };

    const handleMouseOutColorBtn = () => {
        setIsMouseOverColorBtn(false);
        setIsDropletIconColor('svg-gray-100');
        setIsColorPickerBtnColor('bg-gray-900');
    };

    const handleMouseOverDashBtn = () => {
        setIsMouseOverDashBtn(true);
    };

    const handleMouseOutDashBtn = () => {
        setIsMouseOverDashBtn(false);
    };

    function handleDelete () {
        console.log(`handleDelete invoked!`);
        console.log(`Calling deleteTier prop for row: ${rowId}! ...`);
        deleteTier(rowId);
    };

    // const [{ isOver, canDrop }, drop] = useDrop(() => ({
    //     accept: ItemTypes.CARD,
    //     drop: () => ({ container: rowId }),
    //     collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
    // }));

    const handleLabelChange = (event) => {
        setLocalLabel(event.target.value);
    };

    const handleLabelBlur = () => {
        if (localLabel !== label) {
            onUpdateRow(rowId, { label: localLabel });
        }
    };

    const handleColorChange = (color) => {
        setLocalColor(color);
        onUpdateRow(rowId, { color: color });
    };

    const handleColorUpdate = (event) => {
        if (localColor !== color) {
            onUpdateRow(rowId, { color: event.target.value });
        };
    };

    const handleColorPickerOpen = () => {
        setIsColorPickerOpen(!isColorPickerOpen);
    };

    const handleMouseOverRow = () => {
        setIsColorBtnVisible(true);
    };

    const handleMouseOutRow = () => {
        setIsColorBtnVisible(false);
    };

    let renderedCards = items.map((item, index) => (
        <DragCard
            key={item.id}
            {...item}
            id={item.id}
            index={index}
            container={rowId}
            moveCard={moveItem}
            dropCard={dropItem}
            deleteItem={deleteItem}
        />
    ));

    const interiorRows = () => {
        const isCardOver = isOver;
    }

    if (items) {
        console.log("Items for this row is true: ", items);
    }

    return (

        <>
            {/* {isColorPickerOpen ?  <ColorPicker
                onUpdateRow={onUpdateRow}
                rowId={rowId}
            /> : null} */}

            <li className="list-group-item tierListItem border-light bg-gray-900 d-flex position-relative ps-0 pt-0 pb-0 pe-0" onMouseOver={handleMouseOverRow} onMouseOut={handleMouseOutRow}>
                <div className={`d-flex flex-column col-1 ${localColor} text-dark align-content-center justify-content-center`}>

                        { isColorBtnVisible && 
                            (<button ref={colorPickerBtnRef} id="colorPickerOpen_btn" className={`tierColorPicker_btn d-flex align-items-center justify-content-center border-0 ${isColorPickerBtnColor} position-absolute`} onClick={handleColorPickerOpen} onMouseOver={handleMouseOverColorBtn} onMouseOut={handleMouseOutColorBtn}>
                                <DropletHalf size="18" className={`${isDropletIconColor} tierColorPicker_btn-img m-0 p-0`} />
                            </button>)
                        }

                        {!isColorPickerOpen && (
                   
                                <div className="tierLabel d-flex align-items-center justify-content-center" data-replicated-value={localLabel}>
                                    {/* <input id={rowId} className="" type="text" value={localLabel} onChange={handleLabelChange} onBlur={handleLabelBlur} /> */}
                                    {/* <div className="textAreaWrapper">
                                        <textarea name={`${rowId}`} id={`${rowId}`} value={localLabel} onChange={handleLabelChange} onBlur={handleLabelBlur}></textarea>
                                    </div> */}
                                    <textarea ref={textAreaRef} className='tierLabelText text-gray-900' name={`${rowId}`} id={`${rowId}`} value={localLabel} onChange={handleLabelChange} onBlur={handleLabelBlur} aria-label='Editable Tier Row Label. Text Area.'></textarea>
                                </div>
                            )
                        }

                    {isColorPickerOpen &&  
                        (<ColorPicker
                            ref={colorPickerMenuRef}
                            onUpdateRow={onUpdateRow}
                            rowId={rowId}
                        />)
                    }
                    {/* <div className="tierLabel align-self-center justify-self-center">
                        <input id={rowId} className="w-75" type="text" value={localLabel} onChange={handleLabelChange} onBlur={handleLabelBlur} />
                    </div> */}
                </div>
                <div ref={ref} className="col-10 align-content-start d-flex flex-wrap">
                    {renderedCards}
                </div>
                <div className="col-1 options d-flex align-items-center justify-content-center bg-black">
                    <div onClick={handleDelete} className='flex-item deleteRow_style'>
                        <DashSquare id="deleteSquare" className="cursorPointer svg-gray-100" />
                        <DashSquareFill id="deleteSquareFill" className="cursorPointer svg-red-500" />
                    </div>
                </div>
            </li>
        </>
    )
}
