import React, { useState, useEffect } from 'react';
import './App.css'
import { TumorClassificationForm } from './components/Form'
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
    });
  }, []);

  return (
    <>
      <TumorClassificationForm/>
    </>
  )
}

export default App
