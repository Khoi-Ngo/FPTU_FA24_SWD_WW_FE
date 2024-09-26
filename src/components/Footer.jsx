import React from 'react';
import '../styles/init-global.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="logo-text">YourBrand</h2>
          <p>
            We bring you the latest trends and updates on everything tech. Stay connected, stay informed!
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section contact-form">
          <h3>Contact Us</h3>
          <form>
            <input type="email" placeholder="Your Email" className="input-field"/>
            <textarea placeholder="Message..." className="input-field"></textarea>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 YourBrand | Designed with 💙 by YourTeam</p>
      </div>
    </footer>
  );
};

export default Footer;
