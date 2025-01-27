import React from 'react';
import './AppDownload.css'
import { assets } from '../../assets/assets';
const AppDownlod = () => {
    return (
        <div className='app-download' id='app-download'>
            <p>For Better Experience Downlod <br />Zotoo App</p>
            <div className="app-downlod-platforms">
                <img src={assets.play_store} alt="" />
                <img src={assets.app_store} alt="" />
            </div>
        </div>
    );
}

export default AppDownlod;
