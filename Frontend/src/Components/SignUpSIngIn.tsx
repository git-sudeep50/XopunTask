import React, { useEffect, useState } from 'react';
import { BASE_URL, BG_IMG, SignUp_IMG } from '../utils/contsant';
import axios from 'axios';
import { requestFormReset } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adduser } from '../utils/userSlice';

const SignUpSignIn: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; name?: string; password?: string ;otp:string;api:string}>({});
  const [sendOtp,setSendOtp]=useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  useEffect(()=>{
    setEmail('');
    setPassword('');
    setName('');
    setOtp('');
    setErrors({});
    setSendOtp(false);
    setIsOtpVerified(false);
  console.log("EMAIL IS:",email);
  
  },[isSignUp]);

  const  handleSendOtp=async()=>{
    const newErrors: { email?: string; name?: string; password?: string } = {};
  if (!email) newErrors.email = "Email is required";
  if (!name) newErrors.name = "Name is required";
  if (!password) newErrors.password = "Password is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
    setErrors({});
    setIsLoading(true);
    try{
      await axios.post(BASE_URL+"auth/generate-otp", {email:email},{withCredentials:true});
      setSendOtp(true);
      setIsLoading(false);
    }
    catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
  }

  const handleVerifyOTP = async () => {
    const newErrors:{ otp?: string; api?: string } = {};
    if (!otp) newErrors.otp = "OTP is required";
    setIsLoading(true);
    try {
      const res=await axios.post(BASE_URL+"auth/verify-otp", {email:email,otp:otp,userName:name,password:password},{withCredentials:true});
      if(res.data.success){
        setIsOtpVerified(true);
        setSendOtp(false);
      }
      setIsLoading(false);
      alert("Sign Up Successfully");
    } catch (e: unknown) {
      
        if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
      
    }
  }

  const handleSignIn = async () => {
    const newErrors: { email?: string; password?: string; api?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const res = await axios.post(BASE_URL + "auth/login", { email: email, password: password }, { withCredentials: true });
      console.log("Response:", res.data.userData);
      dispatch(adduser(res.data.userData));

      setIsLoading(false);
      alert("Sign In Successfully");
      navigate("/home");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
        setErrors((prev) => ({ ...prev, api: e.message }));
      } else {
        console.error(e);
        setErrors((prev) => ({ ...prev, api: "An error occurred" }));
      }
    }
  }
  return (
    
    <div className=" h-screen w-full justify-center items-center flex bg-"style={{backgroundImage:`url(${BG_IMG})`}}>
      <div className='h-[80vh] w-[70vw] flex shadow-slate-600 shadow-2xl rounded-3xl overflow-hidden'>

      <div className="w-1/2 flex  rounded-tl-3xl rounded-bl-3xl bg-white">
      <h1 className='top-0 mt-2 ml-4 text-green-600 font-bold '>সপোন<span className='font-bold'>Task</span></h1>
      <div className='w-full mt-20 ml-0 mr-6 items-center justify-center'>
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold mb-6 text-center">
            {isSignUp ? 'Sign up' : 'Sign in'}
          </h2>
          <form className="space-y-4">
            {!sendOtp &&(<div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={email}
                className="w-full px-3  py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setEmail(e.target.value);
                  setErrors((prev)=>({...prev,email:''}))
                  console.log("EMAIL IS:",e.target.value);
                  
                }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>)}

            {isSignUp && sendOtp && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
              </div>
            )}
            { isSignUp&& !sendOtp &&(<div>
              <label  className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="name"
                id="name"
                placeholder="Enter your name"
                required
                value={name}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e)=>{setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: '' }))
                }
              }
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>)}
            {!sendOtp &&(<>
              <div>
              <label  className="block text-sm font-medium mb-1">
               { isSignUp?"Create Password":"Password"}
              </label>
              <input
                type={showPassword?"text":"password"}
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }))
                }
              }               
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="mt-2">
        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-4 w-4"
          />
          Show Password
        </label>
      </div>
      </>          
          
          )}

            {isSignUp&& (<button
              type="button"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-700 transition"
              onClick={sendOtp?handleVerifyOTP:handleSendOtp}
            >
              {isLoading ?(
                 <div className='flex justify-center items-center'>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
     
    </div>
              ):(
              sendOtp?"Verify OTP":"Send OTP"
              )}
            </button>)}
           {!sendOtp && !isSignUp  &&( <button
              type="button"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-700 transition"
              onClick={handleSignIn}            
            >{isLoading ?(
                 <div className='flex justify-center items-center'>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
     
    </div>
              ) :
              "Sign In"}

            </button>)}
          </form>
          <p className="mt-4 text-sm text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => {setIsSignUp(!isSignUp); 
              }
            }
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
          className="object-cover w-full h-full  shadow-lg rounded-tr-3xl rounded-br-3xl"
        />
        
      </div>
      
    </div>
    </div>
  );
};

export default SignUpSignIn;
