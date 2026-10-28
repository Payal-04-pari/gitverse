import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return <nav>
    <Link to="/">
    <div>
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111432.png" alt="GIthub logo"></img>
    <h3>Github</h3>
    </div>
    </Link>
    <div>
        <Link to="/create"><h3>Create a repo</h3></Link>
        <Link to="Profile"><h3>Profile</h3></Link>
    </div>
  </nav>
};
export default Navbar;