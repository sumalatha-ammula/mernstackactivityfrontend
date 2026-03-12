import React from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUp from './pages/SignUp'
import Signin from './pages/SignIn'
import CreatePage from './pages/CreatePage'
import NoteDetail from './pages/NoteDetail'

const App = () => {
  return (
    <div data-theme="forest">      
      <Routes>
        <Route path="/" element={<SignUp/>}/>
        <Route path="/login" element={<Signin/>}/>
        <Route path="/Home" element={<HomePage/>}/>
        <Route path="/createpage" element={<CreatePage/>}/>
        <Route path="/notedatail" element={<NoteDetail/>}/>



      </Routes>


    </div>
  )
}

export default App