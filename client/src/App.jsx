import { useState } from 'react'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Layout from './layout'
import Signin from './components/auth/signin/signin'
import Signup from './components/auth/signup/signup'
import Home from './components/home/home'
import ProtectedRoute from './components/ProtectedRoute'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/' element={<Home/>}/>
          
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
