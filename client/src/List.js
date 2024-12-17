import React, { useEffect, useState } from 'react';
import { fetchData, saveChanges } from './ApiService';
import styles from './List.module.css';

export const List = () => {
  const [data, setData] = useState([]); // Original data for backend sync
  const [rows, setRows] = useState([]); // Reordered rows for frontend display

  useEffect(() => {
    let retryAttempts = 0; // Track the number of retry attempts
    const maxRetryAttempts = 5; // Max number of retries
  
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:5001');
  
      ws.onopen = () => {
        console.log('WebSocket connection established');
        retryAttempts = 0; // Reset retry attempts on successful connection
      };
  
      ws.onmessage = (event) => {
        const { type, data } = JSON.parse(event.data);
        console.log("Message received");
        setData(data);
        splitAndMergeRows(data); // Update rows on live updates
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      ws.onclose = () => {
        console.log('WebSocket connection closed');
  
        // Retry if the server is closed and retry attempts haven't been exceeded
        if (retryAttempts < maxRetryAttempts) {
          console.log(`Reconnecting in 1 second... Attempt ${retryAttempts + 1}`);
          retryAttempts++;
          setTimeout(connectWebSocket, 1000);
        } else {
          console.log('Max retry attempts reached. Not reconnecting.');
        }
      };
  
      return ws;
    };
  
    const ws = connectWebSocket(); // Initialize WebSocket connection
    
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      splitAndMergeRows(fetchedData); // Create reordered rows for the UI
    };
  
    getData();
    
    return () => {
      // Clean up WebSocket connection when the component unmounts
      if (ws) {
        ws.close();
      }
    };
  }, []);
  

  const splitAndMergeRows = (data) => {
    const unchecked = data.filter((item) => item.checked === false);
    const checked = data.filter((item) => item.checked === true);
    const mergedRows = [...unchecked, ...checked];
    setRows(mergedRows); // Only affects frontend display
  };

  const handleCheckboxChange = async (id) => {
    // Update the `checked` field in the frontend rows
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, checked: !row.checked } : row
    );
    setRows(updatedRows);

    // Update the `checked` field in the original data for backend sync
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setData(updatedData);

    // Save the unaltered `data` array to the backend
    try {
      const saveChangesInRows = await saveChanges(updatedData);
      console.log("Saved changes:", saveChangesInRows);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>List</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.columnHeader}>No.</th>
            <th className={styles.columnHeader}>Details</th>
            <th className={styles.columnHeader}>Checked</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className={styles.row}>
              <td className={styles.cell}>{row.id}</td>
              <td className={styles.cell}>
                <div className={styles.details}>
                  <p>Name: {row.name}</p>
                  <p>Address: {row.address}</p>
                  <p>Category: {row.category}</p>
                  <p>Language: {row.language}</p>
                </div>
              </td>
              <td className={styles.cell}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={row.checked}
                  onChange={() => handleCheckboxChange(row.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
