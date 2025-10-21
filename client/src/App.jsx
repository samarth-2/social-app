import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import Signin from './components/auth/signin/signin'
import Signup from './components/auth/signup/signup'
import Home from './components/home/home'
import ProtectedRoute from './components/ProtectedRoute'
import Chat from './components/chat/chat'
import AdminDashboard from './components/admin/admindashboard'
import ProfilePage from './components/profile/Profile'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Home />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />}/>
            <Route path='/profile/:userId' element={<ProfilePage/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
