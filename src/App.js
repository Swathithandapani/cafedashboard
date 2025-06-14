import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
const App = () => {
  return (
    <div>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/dash" element={<Dashboard/>}></Route>
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App