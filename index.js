import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './app.js'

import 'board-game-engine-react/dist/board-game-engine-react.css'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
