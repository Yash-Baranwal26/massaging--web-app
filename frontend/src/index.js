import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registration from './Registration';
import Home from './Home';
import Chat from './Chat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<App/>}/>
    <Route path='/registration' element={<Registration/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/chat' element={<Chat/>}/>
    </Routes>
  </BrowserRouter>
);

