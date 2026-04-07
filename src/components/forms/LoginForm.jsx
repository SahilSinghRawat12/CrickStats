import React, { useState } from 'react'
import { NavLink , useNavigate } from 'react-router-dom'
import image from "../../assests/crickMatch.jpg"
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import {signIn} from "../../utils/auth"

const LoginForm = () => {

 const navigate = useNavigate();

 const [formData , setFormData] = useState({
   email : "", password : "",
 });

 const [loading , setLoading] = useState(false);
 const [showPassword , setShowPassword] = useState(false);

 function changeHandler(event){
   setFormData(prev => ({
     ...prev,
     [event.target.name]: event.target.value
   }))
 }

 async function submitHandler(event){
   event.preventDefault();
   setLoading(true);

   const { error } = await signIn(formData.email, formData.password);
   setLoading(false);

   if (error) {
     toast.error(error.message);
     return;
   }

   toast.success("Login successful");
   navigate("/dashboard");
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
         className='w-full md:w-1/2 md:h-[500px] flex flex-col text-white gap-y-6 md:gap-y-10 py-6 md:py-12 px-2 md:px-6'
       >

         <div className='flex flex-col justify-center items-center'>
           <IoPersonSharp size={50} className='border-2 border-white rounded-full p-1'/>
           <h2 className='text-2xl md:text-4xl font-semibold'>Login</h2>
         </div>

         {/* Email */}
         <input 
           required
           type='email'
           placeholder='Email'
           name='email'
           value={formData.email}
           onChange={changeHandler}
           className='w-full border-2 border-[#6e658a] bg-[#3c364c] p-2 rounded-lg outline-none'
         />

         {/* Password */}
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

         {/* Button */}
         <button className='bg-[#6e55b8] w-full py-3 rounded-lg'>
           {loading ? "Logging In..." : "Log In"}
         </button>

         <div className='text-center'>
           <NavLink to="/register">
             <p className='hover:text-gray-300'>Create Account</p>
           </NavLink>
         </div>

       </form>
     </div>
   </div>
 )
}

export default LoginForm