import axios from 'axios';

const API_URL = 'http://localhost:5000/api/data';
const API_URL_SAVE_CHANGES = 'http://localhost:5000/api/savechanges';
const API_URL_ANNOUNCEMENT = 'http://localhost:5000/api/announcement';
const API_URL_CHECKBOX = 'http://localhost:5000/api/toggleCheckbox';

export const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchAnnouncement = async () => {
  try {
    const response = await axios.get(API_URL_ANNOUNCEMENT);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const saveData = async (newData) => {
  try {
    const response = await axios.post(API_URL, newData);
    return response.data;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};
export const saveChanges = async (newData) => {
  try {
    const response = await axios.post(API_URL_SAVE_CHANGES, newData);
    return response.data;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

export const saveAnnouncement = async (newAnnouncement) => {
  try {
    const response = await axios.post(API_URL_ANNOUNCEMENT, newAnnouncement);
    return response.data;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};


export const toggleCheckbox = async (id) => {
  console.log("api service 1", id)
  try {
    console.log("api service 2", id)
    const response = await axios.post(API_URL_CHECKBOX, id);
    return response.data;
  } catch (error) {
    console.error('Error toggling checkbox', error);
    throw error;
  }
};