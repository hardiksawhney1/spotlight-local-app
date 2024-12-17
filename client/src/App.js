import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import { Listpage } from './Listpage';
import { List } from './List';
function App() {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path ="/list" element={<Listpage />} />
    <Route path="/livelist" element={<List />} />
    {/* <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} /> */}
    </Routes>
  </Router>
  )
}
export default App;
