import React from 'react'
import RegisterForm from '../components/forms/RegisterForm'
import Navbar from '../components/headers/Navbar'

const Register = () => {
  return (
    <div className='bg-[#eeeff2]'>
      <Navbar />
      <RegisterForm/>
    </div>
  )
}

export default Register