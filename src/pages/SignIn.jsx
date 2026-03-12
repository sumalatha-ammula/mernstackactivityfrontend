import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {

const navigate = useNavigate();

const [form,setForm] = useState({
email:"",
password:""
})

const [error,setError] = useState("")

const handleSubmit = async (e)=>{
e.preventDefault()
if( !form.email  ){
setError("Email is required");
return;
}
if(!form.password){
  setError("Password is required");
return;  
}



try{

const res = await axios.post(
"https://mernstackactivitybackend.onrender.com//api/notes/signin",
form
)

console.log("login response",res.data)
localStorage.setItem("token",res.data.token)
alert("Login successful")


navigate("/Home")

}catch(err){

setError("Invalid email or password")

}

}

return(

<div className="flex justify-center items-center h-screen ">

<div className="bg-white p-8 rounded shadow w-96">

<h2 className="text-2xl font-bold text-center mb-6 text-black">
Sign In
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
type="email"
placeholder="Email"
className="border p-2 w-full bg-gray-100 text-black placeholder-black"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full bg-gray-100 text-black placeholder-black"
value={form.password}
onChange={(e)=>setForm({...form,password:e.target.value})}
/>

{error && (
<p className="text-red-500 text-sm text-center">
{error}
</p>
)}

<button className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
Login
</button>

</form>

<p className="text-center mt-4 text-black">
Don't have an account?{" "}
<span
className="text-blue-500 cursor-pointer"
onClick={()=>navigate("/")}
>
Register
</span>
</p>

</div>
</div>

)

}

export default Signin
