import React, { useEffect, useState } from 'react';
import { fetchData, saveChanges } from './ApiService';
import { getLanguages } from './constants/Languages';
import { getCategories } from './constants/Category';
import styles from "./Listpage.module.css";

export const Listpage = () => {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch initial data and dropdown options
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      setRows(fetchedData);

      const fetchedLanguages = await getLanguages();
      const fetchedCategories = await getCategories();
      setLanguages(fetchedLanguages);
      setCategories(fetchedCategories);
    };

    getData();

    const ws = new WebSocket('ws://localhost:5001');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      console.log("Received data", data);
      setData(data);
      setRows(data);
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

  const handleInputChange = (e, id, field) => {
    const { value } = e.target;
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSaveChanges = async () => {
    const saveChangesInRows = await saveChanges(rows);
    console.log("Saved changes:", saveChangesInRows);
  };

  const addRow = () => {
    const newRow = {
      id: rows.length+1, // Use current length as ID
      name: '',
      address: '',
      category: '',
      language: '',
      checked: false
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className={styles.nonEditable}>{row.id}</td>
              <td>
                <textarea
                  className={styles.textarea}
                  value={row.name}
                  onChange={(e) => handleInputChange(e, row.id, "name")}
                />
              </td>
              <td>
                <textarea
                  className={styles.textarea}
                  value={row.address}
                  onChange={(e) => handleInputChange(e, row.id, "address")}
                />
              </td>
              <td>
                <select
                  className={styles.dropdown}
                  value={row.category}
                  onChange={(e) => handleInputChange(e, row.id, "category")}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className={styles.dropdown}
                  value={row.language}
                  onChange={(e) => handleInputChange(e, row.id, "language")}
                >
                  <option value="">Select Language</option>
                  {languages.map((language, index) => (
                    <option key={index} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleSaveChanges()}>Save</button>
      <button onClick={addRow}>Add Row</button>
    </div>
  );
};
