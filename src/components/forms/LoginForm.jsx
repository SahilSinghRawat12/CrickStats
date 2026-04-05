import React, { useState } from 'react'
import { NavLink , useNavigate } from 'react-router-dom'
import image from "../../assests/crickMatch.jpg"
import toast from 'react-hot-toast'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import {signIn} from "../../utils/auth"


const LoginForm = () => {

 const navigate = useNavigate();

    const [formData , setFormData] = useState(
        {
            email : "", password : "",  
        }
    )

    const [loading , setLoading] = useState(false);

    const [showPassword , setShowPassword] = useState(false);
     

    function changeHandler(event)
    {
        setFormData( (prevData) => {

            return {
                ...prevData , 
               [event.target.name] : event.target.value
            }
        })
    }
     
    
     
   async function submitHandler(event)
    {
        event.preventDefault();

        setLoading(true);
    
        const { error } = await signIn(
            formData.email,
            formData.password
        );

        setLoading(false);

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("Login successful");

        navigate("/dashboard"); // redirect after login
    }

  return (
    <div className='px-20 h-full py-5'>
        <div className='flex bg-[#2c2638] p-5 rounded-lg'>
            <div className='h-[500px]  w-1/2'>
                <img src={image} alt="" className='h-full w-[450px] rounded-lg '/>
            </div>

            <form 
             onSubmit={submitHandler}
            className='w-1/2 h-[500px] flex flex-col text-white gap-y-10 py-12 '>
                <div className='flex flex-col justify-center items-center w-3/4'>
                    <IoPersonSharp color='white' size={50} className='border-2 border-white rounded-full p-1 '/>
                    <h2 className='text-4xl font-semibold '>Login</h2>
                </div>


               {/* email */}
                <label>
                    <input 
                      required
                      type='email'
                      placeholder='Email'
                      name='email'
                      value={formData.email}
                      onChange={changeHandler}
                      className='border-2 border-[#6e658a] outline-none bg-[#3c364c] p-2 w-[465px]  rounded-lg'
                    />
                </label>

                {/* password */}
            <label className='relative'>
                <input 
                 required
                 type= {showPassword ? 'text' : 'password'}
                 placeholder='Enter your password'
                 name='password'
                 value={formData.password}
                 onChange={changeHandler}
                 className='border-2 border-[#6e658a] outline-none bg-[#3c364c] p-2 w-[465px] rounded-lg'
                />
                  <span className='absolute top-3 right-[134px]'
                   onClick={()=> setShowPassword((prev)=> !prev)}
                  >
                    {
                       showPassword ? (<FaEyeSlash/>) : (<FaEye/>)
                    }
                  </span>     
            </label>




              <button className='bg-[#6e55b8] text-center w-[465px] py-3 rounded-lg'>
                 {loading ? "Loggin In..." : "LogIn" }
              </button>
              
              <div className='flex justify-center w-3/4 '>
                <NavLink to="/register"> <p className='text-white hover:text-gray-300 cursor-pointer ' >Create Account</p></NavLink>
              </div>

            </form>
        </div>
    </div>
  )
}

export default LoginForm