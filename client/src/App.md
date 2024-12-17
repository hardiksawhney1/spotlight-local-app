import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Live } from './Live'; // Import the Live component
import { List } from './List';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/live" element={<Live />} />
        <Route path="/list" element={<List />} />
        {/* Optional: Set the default route to /live */}
        <Route path="/" element={<Navigate to="/list" />} />
      </Routes>
    </Router>
  );
}

export default App;
