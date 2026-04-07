import React, { useState} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import image from "../../assests/cricketImage.jpg"
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {signUp} from "../../utils/auth"

const RegisterForm = () => {

  const navigate = useNavigate();

  const [formData , setFormData] = useState({
    firstname : "" , lastname : "", email : "", password : "", confirmPassword : "", checkbox : false,
  });

  const [showPassword , setShowPassword] = useState(false);
  const [showPassword2 , setShowPassword2] = useState(false);

  function changeHandler(event){
    const {name , value , checked , type} = event.target;

    setFormData(prev => ({
      ...prev,
      [name] : type === "checkbox" ? checked : value
    }))
  }

  async function submitHandler(event){
    event.preventDefault();

    if(formData.password !== formData.confirmPassword){
      toast.error("Password does not matched");
      return;
    }

    const {error} = await signUp(formData.email, formData.password);

    if(error){
      toast.error(error.message);
      return;
    }

    toast.success("Account created");
    navigate("/login");
  }

  return (
    <div className='px-4 sm:px-10 md:px-20 py-5 flex justify-center'>
      
      <div className='flex flex-col md:flex-row bg-[#2c2638] p-4 md:p-5 rounded-lg w-full max-w-5xl'>

        
        <div className='hidden md:block md:w-1/2 h-[500px]'>
          <img src={image} alt="" className='h-full w-full object-fill rounded-lg'/>
        </div>

        {/* Form */}
        <form 
          onSubmit={submitHandler}
          className='w-full md:w-1/2 md:h-[500px] flex flex-col text-white gap-y-5 md:gap-y-6 py-6 md:py-10 px-2 md:px-6'
        >

          <div>
            <h2 className='text-2xl md:text-4xl font-semibold'>Create an account</h2>
            <span className='text-gray-300 text-sm'>
              Already have an account?{" "}
              <NavLink to='/login'>
                <span className='border-b'>Log in</span>
              </NavLink>
            </span>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <input
              required
              type='text'
              placeholder='First name'
              name='firstname'
              value={formData.firstname}
              onChange={changeHandler}
              className='w-full border-2 border-[#6e658a] bg-[#3c364c] p-2 rounded-lg outline-none'
            />

            <input 
              required
              type='text'
              placeholder='Last name'
              name='lastname'
              value={formData.lastname}
              onChange={changeHandler}
              className='w-full border-2 border-[#6e658a] bg-[#3c364c] p-2 rounded-lg outline-none'
            />
          </div>

          <input 
            required
            type='email'
            placeholder='Email'
            name='email'
            value={formData.email}
            onChange={changeHandler}
            className='w-full border-2 border-[#6e658a] bg-[#3c364c] p-2 rounded-lg outline-none'
          />

          <div className='relative'>
            <input 
              required
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              name='password'
              value={formData.password}
              onChange={changeHandler}
              className='w-full border-2 border-[#6e658a] bg-[#3c364c] p-2 rounded-lg outline-none'
            />
            <span 
              className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
              onClick={()=> setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>
          </div>

          <div className='relative'>
            <input 
              required
              type={showPassword2 ? 'text' : 'password'}
              placeholder='Confirm Password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={changeHandler}
              className='w-full border-2 border-[#6e658a] bg-[#3c364c] p-2 rounded-lg outline-none'
            />
            <span 
              className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
              onClick={()=> setShowPassword2(prev => !prev)}
            >
              {showPassword2 ? <FaEyeSlash/> : <FaEye/>}
            </span>
          </div>

          <button className='bg-[#6e55b8] w-full py-3 rounded-lg'>
            Create Account
          </button>

        </form>
      </div>
    </div>
  )
}

export default RegisterForm