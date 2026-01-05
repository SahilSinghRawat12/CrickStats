import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import image from "../../assests/cricketImage.jpg"
import toast from 'react-hot-toast'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const RegisterForm = () => {

    const [formData , setFormData] = useState(
        {
            firstname : "" , lastname : "", email : "", password : "", confirmPassword : "", checkbox : false,
        }
    )

    const [showPassword , setShowPassword] = useState(false);
    const [showPassword2 , setShowPassword2] = useState(false);

    function changeHandler(event)
    {
        const {name , value , checked , type} = event.target

        setFormData( (prevData) => {

            return {
                ...prevData , 
                [name] : type === "checkbox" ? checked : value
            }
        })
    }
     
    
     
    function submitHandler(event)
    {
        event.preventDefault();

        if(formData.password !== formData.confirmPassword)
        {
          toast.error("Password does not matched");
          return;
        }
    }

  return (
    <div className='px-20 h-full py-5'>
        <div className='flex bg-[#2c2638] p-5 rounded-lg'>
            <div className='h-[500px]  w-1/2'>
                <img src={image} alt="" className='h-full w-[450px] rounded-lg '/>
            </div>

            <form 
             onSubmit={submitHandler}
            className='w-1/2 h-[500px] flex flex-col text-white gap-y-6 py-4 '>
                <div>
                    <h2 className='text-4xl font-semibold'>Create an account</h2>
                      <span className='text-gray-300 text-sm '>Already have an account?{" "}
                         <NavLink to='/login'>
                        <span className='border-b border-gray-300  '>Log in</span>
                         </NavLink>
                       </span>
                </div>

                <div className='mt-4 flex gap-x-5'>
                    {/* firstname */}

                    <label>
                        <input
                          required
                          type='text'
                          placeholder='Enter first name'
                          name='firstname'
                          value={formData.firstname}
                          onChange={changeHandler}
                          className='border-2 border-[#6e658a] outline-none bg-[#3c364c] p-2 rounded-lg'
                        />
                    </label>

                    {/* lastname */}
                    <label>                 
                        <input 
                          required
                          type='text'
                          placeholder='Enter your last name'
                          name='lastname'
                          value={formData.lastname}
                          onChange={changeHandler}
                          className='border-2 border-[#6e658a] outline-none bg-[#3c364c] p-2 rounded-lg'
                        />
                    </label>
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

            {/* confirm password */}
              <label className='relative'>
                <input 
                 required
                 type= {showPassword2 ? 'text' : 'password'}
                 placeholder='Confirm Password'
                 name='confirmPassword'
                 value={formData.confirmPassword}
                 onChange={changeHandler}
                 className='border-2 border-[#6e658a] outline-none bg-[#3c364c] p-2 w-[465px] rounded-lg'
                />
                 <span className='absolute top-3 right-[134px]'
                 onClick={()=> setShowPassword2((prev)=> !prev)}
                 >
                  {
                       showPassword2 ? (<FaEyeSlash/>) : (<FaEye/>)
                  }
                </span>

              </label>
        
              {/* agree to terms and condition */}
           
            <div className='flex gap-x-5'>
                  <input
                required 
                type='checkbox'
                onChange={changeHandler}
                name='checkbox'
                id='termsCondition'
                checked = {formData.checkbox}
              />
              <label htmlFor='termsCondition'>
                <p className='text-sm'>I agree to the <span className='border-b border-[#6e55b8] font-semibold text-[#6e55b8]'>Terms&Conditions</span></p>
              </label>
            </div>

              <button className='bg-[#6e55b8] w-[465px] py-3 rounded-lg'>
                 Create Account 
              </button>

            </form>
        </div>
    </div>
  )
}

export default RegisterForm