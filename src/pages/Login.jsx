import React from 'react'
import LoginForm from '../components/forms/LoginForm'
import Navbar from '../components/headers/Navbar'

const Login = () => {
  return (
    <div className='bg-[#eeeff2]'>
       <Navbar />
       <LoginForm />
    </div>
  )
}

export default Login