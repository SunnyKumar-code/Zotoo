import React, { useState } from 'react';
import './Home.css'
import Header from '../../components/Header/Header';
import ExplorMenu from '../../components/ExplorMenu/ExplorMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownlod from '../../components/AppDownload/AppDownlod';
import ChatBot from '../chatBot/ChatBot';

const Home = () => {
    const [category, setCategory] = useState("All")

    return (
        <div className="home-container">
            <Header />
            <ExplorMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            <ChatBot />
            {/* <AppDownlod/> */}
        </div>
    );
}

export default Home;
