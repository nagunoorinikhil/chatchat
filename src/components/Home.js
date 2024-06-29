import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import { db } from './firebase'; // Adjust the path as per your project structure
import { collection, addDoc } from 'firebase/firestore';

const Home = () => {
  const handleDataStore = async () => {
    console.log("Adding data...");
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    console.log("set data...");

  };

  return (
    <div>
      <h3>Hello Home page. Please Redirect to chat part</h3>
      <Link to="/chat">Go to chat application</Link>
      <button onClick={handleDataStore}>Add Data to Firebase</button>
    </div>
  );
};

export default Home;
