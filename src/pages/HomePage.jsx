import {useEffect,useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";



const HomePage = () => {
const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
const [page,setPage] = useState(1)
const [pages,setPages] = useState(1)
const [search, setSearch] = useState("");
const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead",
    notes: ""
  });
    const fetchNotes = async(pageNumber = 1)=>{
try {
  const res = await axios.get(`https://mernstackactivitybackend.onrender.com/api/notes?page=${pageNumber}&limit=5`,{
    headers: {
    Authorization: `Bearer ${token}`
  }
  })
setContacts(res.data.contacts)
setPages(res.data.pages)
setPage(res.data.page)   
console.log("data",res.data)
} catch (err) {
  console.log("error in fetchong the data",err)
}
  }
  useEffect(()=>{
  fetchNotes(page)
  },[page])
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }
}, []);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };
  if (showModal) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showModal]);
  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!validateForm()) return;
  try {

    if (editingId) {

      await axios.put(
        `https://mernstackactivitybackend.onrender.com/api/notes/${editingId}`,
        form,{
          headers: {
    Authorization: `Bearer ${token}`
  }
        }
      );

    } else {

     await fetch("https://mernstackactivitybackend.onrender.com/api/notes/addContact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });

    }

    setShowModal(false);
    setEditingId(null);
    fetchNotes();

  } catch (err) {
    console.log("error saving contact", err);
  }   

  };
  const handleLogout = () => {
  localStorage.removeItem("token");
   navigate("/login");
};
  const deleteContact = async (id) => {
  try {

    await axios.delete(`https://mernstackactivitybackend.onrender.com/api/notes/deleteContact/${id}`,{
       headers: {
    Authorization: `Bearer ${token}`
  }
    });

    fetchNotes(); // refresh table after delete

  } catch (err) {
    console.log("error deleting contact", err);
  }
};
const filteredContacts = contacts.filter((contact) =>
  contact.name.toLowerCase().includes(search.toLowerCase()) ||
  contact.email.toLowerCase().includes(search.toLowerCase())
);
const openAddModal = () => {

setForm({
name:"",
email:"",
phone:"",
company:"",
status:"",
notes:""
});

setEditingId(null);
setShowModal(true);

};
const handleEdit = (contact) => {

setForm({
name: contact.name,
email: contact.email,
phone: contact.phone,
company: contact.company,
status: contact.status,
notes: contact.notes
});

setEditingId(contact._id);
setShowModal(true);

};
const validateForm = () => {

  let newErrors = {};

  if (!form.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!form.email.trim()) {
    newErrors.email = "Email is required";
  } 
  else if (!/\S+@\S+\.\S+/.test(form.email)) {
    newErrors.email = "Invalid email format";
  }

  if (!form.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } 
  else if (!/^[0-9]{10}$/.test(form.phone)) {
    newErrors.phone = "Phone must be 10 digits";
  }
  if (!form.company.trim()) {
    newErrors.company = "company is required";
  } 

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  
  return (
   <div className="p-10">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">Contacts</h1>

        {/* <div className="mb-4 flex justify-between"> */}

<input
type="text"
placeholder="Search by name or email..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border p-2 w-64 rounded"
/>

{/* </div> */}

        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Contact
        </button>

      </div>


      {/* TABLE */}

      <div className="flex justify-end mt-4 gap-2">
<button
onClick={()=>setPage(page-1)}
disabled={page===1}
className="px-3 py-1 bg-white text-black border rounded disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200">
Prev
</button>

{[...Array(pages)].map((_,i)=>(
<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-3 py-1 rounded ${
page === i+1 ? "bg-blue-500 text-white" : "px-3 py-1 bg-white text-black border rounded"
}`}
>
{i+1}
</button>
))}


<button
onClick={()=>setPage(page+1)}
disabled={page===pages}
className="px-3 py-1 bg-white text-black border rounded disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200">
  Next
</button>

</div>

      <table className="w-full border">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-black">Name</th>
            <th className="p-2 text-black">Email</th>
            <th className="p-2 text-black">Phone</th>
            <th className="p-2 text-black">Company</th>
            <th className="p-2 text-black">Status</th>
            <th className="p-2 text-black">Notes</th>
            <th className="p-2 text-black">Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredContacts.map((contact) => (
            <tr key={contact._id} className="border-t">

              <td className="text-center">{contact.name}</td>
              <td className="text-center">{contact.email}</td>
              <td className="text-center">{contact.phone}</td>
              <td className="text-center">{contact.company}</td>
              <td className="text-center">{contact.status}</td>
              <td className="text-center">{contact.notes}</td>

              <td className="space-x-2 text-center">
                <button
onClick={() => handleEdit(contact)}
className="bg-blue-500 text-white px-3 py-1 rounded"
>
Edit
</button>

                <button
                  onClick={() => deleteContact(contact._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <div className="flex justify-end mt-6">
         <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
         onClick={handleLogout}>
         Log Out
        </button>
      </div>

      {/* MODAL */}

      {showModal && (

<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

<div className="bg-white p-6 rounded w-96" ref={modalRef}>

<h2 className="text-xl mb-4">
{editingId ? "Edit Contact" : "Add Contact"}
</h2>

<form onSubmit={handleSubmit} className="space-y-3">

<input
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
className="border p-2 w-full"
placeholder="Name"
/>
{errors.name && (
<p className="text-red-500 text-sm">{errors.name}</p>
)}

<input
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
className="border p-2 w-full"
placeholder="Email"
/>
{errors.email && (
<p className="text-red-500 text-sm">{errors.email}</p>
)}

<input
value={form.phone}
onChange={(e)=>setForm({...form,phone:e.target.value})}
className="border p-2 w-full"
placeholder="Phone"
/>
{errors.phone && (
<p className="text-red-500 text-sm">{errors.phone}</p>
)}
<input
value={form.company}
onChange={(e)=>setForm({...form,company:e.target.value})}
className="border p-2 w-full"
placeholder="Company"
/>
{errors.company && (
<p className="text-red-500 text-sm">{errors.company}</p>
)}

{/* STATUS SELECT */}

<select
value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
className="border p-2 w-full"
>

<option value="">Select Status</option>
<option value="Lead">Lead</option>
<option value="Prospect">Prospect</option>
<option value="Customer">Customer</option>

</select>

<textarea
value={form.notes}
onChange={(e)=>setForm({...form,notes:e.target.value})}
className="border p-2 w-full"
placeholder="Notes"
/>
<button className="bg-green-500 text-white px-4 py-2 rounded">
{editingId ? "Edit" : "Save"}
</button>

</form>

</div>

</div>

)}
    </div>
  );
}

export default HomePage
