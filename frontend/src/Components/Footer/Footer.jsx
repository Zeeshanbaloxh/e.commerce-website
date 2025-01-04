import React from 'react';
import instagram_icon from '../Assets/instagram_icon.png';
import pintester_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            
            <p>Enjoy <span>Our</span> Deals</p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-socials-icon">
            <div className="footer-icon-container">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <img src={instagram_icon} alt="Instagram" />
                </a>
            </div>
            <div className="footer-icon-container">
                <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                    <img src={pintester_icon} alt="Pinterest" />
                </a>
            </div>
            <div className="footer-icon-container">
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                    <img src={whatsapp_icon} alt="WhatsApp" />
                </a>
            </div>
        </div>
        <div className="footer-copy-right">
            <hr />
            <p>Copyright @ 2024 -All Right Reserved</p>
        </div>
    </div>
  );
}

export default Footer;
