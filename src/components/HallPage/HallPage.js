import React from 'react';
import { useSelector } from 'react-redux';

function HallPage() {
    const speed = useSelector(state => state.HallPageReducer.speed);

    return (
        <div>CIAO HALL {speed}</div>
    );
}

export default HallPage;