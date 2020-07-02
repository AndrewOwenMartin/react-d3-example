import React from 'react'
import './App.css'
import {
    ReactD3Example
} from "./ReactD3Example"

const App = () => {
    return <div>
        <ReactD3Example {...{height: 400, initCircleCount: 10}} />
        <ReactD3Example {...{height: 600, initCircleCount: 20}} />
    </div>
}

export default App
