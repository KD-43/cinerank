import React, { useEffect, useState } from 'react';

// const colorTheme = ['bg-pink-300', 'bg-red-300', 'bg-orange-300', 'bg-yellow-300', 'bg-green-300', 'bg-teal-300', 'bg-cyan-300', 'bg-blue-300', 'bg-indigo-300', 'bg-purple-300', 'bg-gray-300', 'bg-black'];
const colorThemeRow1 = ['bg-pink-300', 'bg-red-300', 'bg-orange-300',];
const colorThemeRow2 = ['bg-yellow-300', 'bg-green-300', 'bg-teal-300',];
const colorThemeRow3 = ['bg-cyan-300', 'bg-blue-300', 'bg-indigo-300',];
const colorThemeRow4 = ['bg-purple-300', 'bg-gray-300', 'bg-black'];

// const colorTheme = {
//     row1: ['bg-pink-300', 'bg-red-300', 'bg-orange-300',],
//     row2: ['bg-yellow-300', 'bg-green-300', 'bg-teal-300',],
//     row3: ['bg-cyan-300', 'bg-blue-300', 'bg-indigo-300',],
//     row4: ['bg-purple-300', 'bg-gray-300', 'bg-black'],
// }

const colorTheme = [
    { row: ['bg-pink-300', 'bg-red-300', 'bg-orange-300',] },
    { row: ['bg-yellow-300', 'bg-green-300', 'bg-teal-300',] },
    { row: ['bg-cyan-300', 'bg-blue-300', 'bg-indigo-300',] },
    { row: ['bg-purple-300', 'bg-gray-300', 'bg-black'] },

]

export function ColorPicker ({ onUpdateRow, rowId, ref, ...other}) {

    const handleClick = (colorValue) => {
        console.log("handleClick called from ColorPicker Component");
        console.log("Calling 'onUpdateRow function");
        onUpdateRow(rowId, { color: colorValue });
    }

    return (
        <>
            <div ref={ref} id="tierColorPalette" className="colorPaletteWrapper align-content-center justify-content-center align-self-center justify-self-center bg-gray-100">
                <div className="d-flex flex-wrap flex-column colorPaletteSwatch_wrapper">
                    {colorTheme && colorTheme.map((object, index) => (
                        <div className={`d-inline-flex colorSwatch_group-${index} `}>
                            {object.row.map((color) => (
                                <div className={`colorPaletteSwatch ${color}`} onClick={() => handleClick(color)}></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}