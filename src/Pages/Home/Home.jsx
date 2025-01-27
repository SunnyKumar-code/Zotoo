import React, { useState } from 'react';
import './Home.css'
import Header from '../../components/Header/Header';
import ExplorMenu from '../../components/ExplorMenu/ExplorMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownlod from '../../components/AppDownload/AppDownlod';
const Home = () => {
    const [category,setCategory]=useState("All")
    return (
        <div>
            <Header/>
            <ExplorMenu category={category} setCategory={setCategory}/>  
            <FoodDisplay category={category}/>
            <AppDownlod/>
        </div>
    );
}

export default Home;
