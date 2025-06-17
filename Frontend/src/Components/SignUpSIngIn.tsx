import React, { useState } from 'react';
import { BG_IMG, SignUp_IMG } from '../utils/contsant';
import axios from 'axios';

const SignUpSignIn: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [sendOtp,setSendOtp]=useState<boolean>(false);
  const  handleSendOtp=async()=>{
    try{
      await axios.post('http://localhost:5000/api/auth/send-otp', {email:email},{withCredentials:true});
      setSendOtp(true);
    }
    catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
  }

  return (
    
    <div className=" h-screen w-full justify-center items-center flex bg-gray-100"style={{backgroundImage:`url(${BG_IMG})`}}>
      <div className='h-[90vh] w-[90vw] flex   '>

      <div className="w-1/2 flex  rounded-tl-lg rounded-bl-lg bg-blue-100">
      <h1 className='top-0 mt-0 ml-2  font-bold '>সপোন<span className='font-bold'>Task</span></h1>
      <div className='w-full mt-24 ml-5 items-center justify-center'>
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
            {isSignUp && sendOtp && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {sendOtp&&(<div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>)}
           {sendOtp &&( <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>)}
          </form>
          <p className="mt-4 text-sm text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>
        </div>
      </div>

      
      <div className="w-1/2 relative">
        <img
          src={SignUp_IMG}
          alt="Sign Up Illustration"
          className="object-cover w-full h-full rounded-[50px,30px,20px,30px] shadow-lg rounded-tr-lg rounded-br-lg"
        />
        
      </div>
      
    </div>
    </div>
  );
};

export default SignUpSignIn;
