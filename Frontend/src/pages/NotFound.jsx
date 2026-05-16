import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="notfound-container">
    <h1 className="notfound-title">404 - Page Not Found</h1>
    <p className="notfound-message">The page you are looking for does not exist.</p>
    <Link className="notfound-link" to="/">Go to Home</Link>
  </div>
);

export default NotFound;
