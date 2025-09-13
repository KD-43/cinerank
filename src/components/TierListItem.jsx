import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";

export function TierListItem ({ tierLabel, tierColor }) {

    const [ label, setLabel ] = useState('Tier Label');
    const [ color, setColor ] = useState('bg-primary');

    useEffect(() => {
        setLabel(tierLabel);
    }, [tierLabel]);

    useEffect(() => {
        setColor(tierColor);
    }, [tierColor]);


    return (
        <li className="list-group-item tierListItem border-light bg-gray-900 d-flex ps-0 pt-0 pb-0 pe-0">
            <div className={`d-inline-flex justify-content-center align-items-center col-1 ${color} text-dark`}>{label}</div>
            <div className="col-11 content"></div>
        </li>
    )
}