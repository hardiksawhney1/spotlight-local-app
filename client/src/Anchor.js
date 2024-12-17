import React, { useState, useEffect } from 'react';
import './Anchor.module.css';

export const Anchor = () => {
  const [positions, setPositions] = useState({ position1: 0, position2: 0, position3: 0 });
  const [data, setData] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [read, setRead] = useState(false);
  const [timer, setTimer] = useState({ start: false, stop: true, reset: false });
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fetch data and positions in real-time
  useEffect(() => {
    const fetchPositionsAndData = async () => {
      const posRes = await fetch('/api/positions');
      const posJson = await posRes.json();
      setPositions(posJson);

      const dataRes = await fetch('/api/data');
      const dataJson = await dataRes.json();
      setData(dataJson);

      const annRes = await fetch('/api/announcement');
      const annJson = await annRes.json();
      setAnnouncement(annJson.text);
      setRead(annJson.read);

      const timerRes = await fetch('/api/timer');
      const timerJson = await timerRes.json();
      setTimer(timerJson);
    };
    fetchPositionsAndData();

    const ws = new WebSocket('ws://localhost:5001');
    ws.onmessage = (event) => {
      const { endpoint, data } = JSON.parse(event.data);
      if (endpoint === '/positions') setPositions(data);
      if (endpoint === '/data') setData(data);
      if (endpoint === '/announcement') {
        setAnnouncement(data.text);
        setRead(data.read);
      }
      if (endpoint === '/timer') setTimer(data);
    };

    return () => ws.close();
  }, []);

  // Handle stopwatch updates
  useEffect(() => {
    let timerInterval;
    if (timer.start && !timer.stop) {
      timerInterval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    } else if (timer.reset) {
      setElapsedTime(0);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [timer]);

  const handleReadChange = async () => {
    const newRead = !read;
    setRead(newRead);
    await fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: announcement, read: newRead }),
    });
  };

  return (
    <div className="anchorContainer">
      <table className="positionTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          {[positions.position1, positions.position2, positions.position3].map((pos) => {
            const person = data[pos - 1]; // Adjusted for 1-based indexing
            return person ? (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.address}</td>
                <td>{person.category}</td>
                <td>{person.language}</td>
              </tr>
            ) : null;
          })}
        </tbody>
      </table>

      <div className="announcementBox">
        <textarea value={announcement} readOnly />
        <div>
          <label>
            <input type="checkbox" checked={read} onChange={handleReadChange} />
            Read
          </label>
          <label>
            <input type="checkbox" /> Call
          </label>
        </div>
      </div>

      <div className="stopwatch">
        <p>Elapsed Time: {elapsedTime} seconds</p>
      </div>
    </div>
  );
};

