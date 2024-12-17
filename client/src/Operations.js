import React, { useState } from 'react';
import './Operations.module.css';

export const Operations = () => {
  const [positions, setPositions] = useState({ position1: '', position2: '', position3: '' });
  const [announcement, setAnnouncement] = useState('');
  const [timer, setTimer] = useState({ start: false, stop: true, reset: false });

  const handleSavePositions = async () => {
    await fetch('/api/positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        position1: parseInt(positions.position1),
        position2: parseInt(positions.position2),
        position3: parseInt(positions.position3),
      }),
    });
  };

  const handleTimerChange = async (key) => {
    const newTimer = { ...timer, [key]: !timer[key] };
    setTimer(newTimer);
    await fetch('/api/timer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTimer),
    });
  };

  const handlePushAnnouncement = async () => {
    await fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: announcement, read: false }),
    });
  };

  const handleClearAnnouncement = async () => {
    setAnnouncement('');
    await fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '', read: false }),
    });
  };

  return (
    <div className="operationsContainer">
      <div className="positionInputs">
        <input
          type="number"
          placeholder="Position 1"
          value={positions.position1}
          onChange={(e) => setPositions({ ...positions, position1: e.target.value })}
        />
        <input
          type="number"
          placeholder="Position 2"
          value={positions.position2}
          onChange={(e) => setPositions({ ...positions, position2: e.target.value })}
        />
        <input
          type="number"
          placeholder="Position 3"
          value={positions.position3}
          onChange={(e) => setPositions({ ...positions, position3: e.target.value })}
        />
        <button onClick={handleSavePositions}>Save Positions</button>
      </div>

      <div className="timerButtons">
        <button onClick={() => handleTimerChange('start')}>Start Timer</button>
        <button onClick={() => handleTimerChange('stop')}>Stop Timer</button>
        <button onClick={() => handleTimerChange('reset')}>Reset Timer</button>
      </div>

      <div className="announcementSection">
        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Enter announcement..."
        />
        <button onClick={handlePushAnnouncement}>Push</button>
        <button onClick={handleClearAnnouncement}>Clear</button>
      </div>
    </div>
  );
};

