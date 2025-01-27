import React from 'react';
import './Footer.css'
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia tempora, magni deserunt officiis id optio, ut error quod eveniet, eum esse. Soluta aliquam impedit ab nisi distinctio asperiores. Dignissimos, numquam.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" /><img src={assets.twitter_icon} alt="" /><img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>Get In Touch</h2>
                    <ul>
                        <li>+1-2356-235</li>
                        <li>abc@zotoo.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2025 ©  Zotoo.com. All rights reserved.</p>
        </div>
    );
}

export default Footer;
