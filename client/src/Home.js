import React, { useState, useEffect } from 'react';
import { fetchData, fetchAnnouncement, saveData, saveAnnouncement } from './ApiService';

function Home() {
  const [data, setData] = useState([]);
  const [announcement, setAnnouncement] = useState({});
  const [newEntry, setNewEntry] = useState({ name: '', age: '' });
  const [editedAnnouncement, setEditedAnnouncement] = useState(''); // For editing announcement

  useEffect(() => {
    // Fetch data and announcements initially
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };

    const getAnnouncement = async () => {
      const fetchedAnnouncement = await fetchAnnouncement();
      setAnnouncement(fetchedAnnouncement);
      setEditedAnnouncement(fetchedAnnouncement.text); // Set the initial value for editing
    };

    getData();
    getAnnouncement();

    // Setting up WebSocket connection for live updates
    const ws = new WebSocket('ws://localhost:5001');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === 'data') {
        setData(data); // Update data
      } else if (type === 'announcement') {
        setAnnouncement(data); // Update announcement
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savedEntry = await saveData(newEntry);
    setData([...data, savedEntry]);
    setNewEntry({ name: '', age: '' });
  };

  const handleAnnouncement = async (e) => {
    e.preventDefault();

    const updatedAnnouncement = {
      text: editedAnnouncement,
      read: false, // Reset read status when editing
    };

    const savedAnnouncement = await saveAnnouncement(updatedAnnouncement);
    setAnnouncement(savedAnnouncement);
    setEditedAnnouncement(savedAnnouncement.text);
  };

  return (
    <div>
      <h1>Data from JSON File</h1>
      <ul>
        {console.log("This is data", data)};
        {data.map((entry) => (
          <li key={entry.id}>
            {entry.name} - Age: {entry.age} - Index: {data.length}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={newEntry.name}
          onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newEntry.age}
          onChange={(e) => setNewEntry({ ...newEntry, age: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
      <br />
      <br />

      <h1>Announcement from JSON File</h1>
      <p>Announcement: {announcement.text}</p>
      {announcement.read ? <p>Read: true</p> : <p>Read: false</p>}

      <form onSubmit={handleAnnouncement}>
        <input
          type="text"
          placeholder="Edit Announcement"
          value={editedAnnouncement}
          onChange={(e) => setEditedAnnouncement(e.target.value)}
        />
        <button type="submit">Push</button>
      </form>
    </div>
  );
}

export default Home;
