import React from 'react'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

 const SignUp = () => {
  const navigate = useNavigate();

  const [form,setForm] = useState({
name:"",
email:"",
password:"",
confirmPassword:""
});

const [error,setError] = useState("");

const handleSubmit = async (e)=>{
e.preventDefault();

if( !form.email || !form.password || !form.confirmPassword){
setError("All fields are required");
return;
}

if(form.password !== form.confirmPassword){
setError("Passwords do not match");
return;
}

try{

const res = await axios.post(
"https://mernstackactivitybackend.onrender.com/api/notes/signup",
form
);
 navigate("/login");
}catch(err){
setError(err.response?.data?.message || "Signup failed");
}

};

return(

<div className="flex justify-center items-center h-screen">

<div className="bg-white p-8 rounded shadow-md w-96">

<h2 className="text-2xl font-bold mb-6 text-center text-black">
Sign Up
</h2>

<form onSubmit={handleSubmit} className="space-y-4">
<input
type="email"
placeholder="Email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
className="border p-2 w-full bg-gray-100 placeholder-black text-black"
/>

<input
type="password"
placeholder="Password"
value={form.password}
onChange={(e)=>setForm({...form,password:e.target.value})}
className="border p-2 w-full bg-gray-100 placeholder-black text-black"
/>

<input
type="password"
placeholder="Confirm Password"
value={form.confirmPassword}
onChange={(e)=>setForm({...form,confirmPassword:e.target.value})}
className="border p-2 w-full bg-gray-100 placeholder-black text-black"
/>

{error && (
<p className="text-red-500 text-sm">{error}</p>
)}

<button className="bg-blue-500 text-white w-full py-2 rounded">
Register
</button>

<p className="text-center mt-3 text-black">
Already have an account? 
<span
className="text-blue-500 cursor-pointer "
onClick={()=>navigate("/login")}
>
Login
</span>
</p>

</form>

</div>

</div>

);

}
export default SignUp
