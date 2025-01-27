import React from 'react';
import './ExplorMenu.css'
import { assets , menu_list } from '../../assets/assets';

const ExplorMenu = ({category,setCategory}) => {
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explor our menu</h1>
            <p className='explore-menu-text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, quos eligendi! Velit sapiente quia similique amet, saepe reiciendis facere corrupti!</p>
        <div className="explore-menu-list">
            {
                menu_list.map((item,index)=>{
                    return (
                        <div onClick={()=>{setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}} key={index} className='explore-menu-list-item'>
                            <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                            <p>{item.menu_name}</p>
                        </div>
                    )
                })
            }
        </div>
        <hr />
        </div>
    );
}

export default ExplorMenu;
