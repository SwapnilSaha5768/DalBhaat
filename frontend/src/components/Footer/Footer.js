import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleFooter = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button className="side-button" onClick={toggleFooter}>
        {isVisible ? '↓' : '↑'}
      </button>
      
      <div className={`footer ${isVisible ? 'visible' : ''}`}>
        <ul>
          <li>
            <a href="/contact">Contact Us</a>
          </li>
          <li>
            <a href="/faq">FAQ</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Footer;
