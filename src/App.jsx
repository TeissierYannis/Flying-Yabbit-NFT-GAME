import React from 'react'
import './App.css';
import Home from './Home';
import Install from "./components/Install";

// App function component

const App = () => {
    if (window.ethereum) {
        return <Home/>
    } else {
        return <Install/>
    }
}


export default App;