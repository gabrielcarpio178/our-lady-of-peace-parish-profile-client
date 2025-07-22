import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { userData, api_link } from '../../../api_link';
import React from 'react';
import Swal from 'sweetalert2';
import 'animate.css'
export default function Settings(){

    const [firstname, setfirstname] = useState("")
    const [lastname, setlastname] = useState("")
    const [username, setusername] = useState("")
    const [message, setmessage] = useState("")


    async function getData(){
        const token = userData().token
        const user = userData().user
        try {
            var res = await axios.get(`${api_link()}/getUser`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const dataUser = res.data.filter((data: any)=>{return (data.id==user.id)})[0]
            setfirstname(dataUser.firstname)
            setlastname(dataUser.lastname)
            setusername(dataUser.username)
        } catch (error) {
            console.log(error)
        }
        
    }


    const submitData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const {token ,user} = userData()
        const user_id = user.id;
        const olddb_password = user.password;
        const formData = new FormData(e.currentTarget)
        const formValues = {
            user_id: user_id,
            olddb_password: olddb_password,
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            username: formData.get('username'),
            old_password: formData.get('old_password'),
            new_password: formData.get('new_password')
        }
        try {
            const res = await axios.put(`${api_link()}/editUserData`, formValues, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if(res.data.msg === "invalid old password"){
                Swal.fire({
                    position: "center",
                    title: `Invalid Old Password`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1000,
                })
                setmessage("Invalid Old Password")
            }else if(res.data.msg=== "update success"){
                const updatedUserInfo = {
                    ...user,
                    firstname: formValues.firstname,
                    lastname: formValues.lastname,
                    username: formValues.username,
                    password: res.data.newPassword
                };
                localStorage.setItem("user", JSON.stringify(updatedUserInfo));
                Swal.fire({
                    position: "center",
                    title: `Update Success`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000,
                }).then(()=>{
                    window.location.reload()
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    },[])


    return (
        <>
            <MyAppNav/>
            <div className='flex flex-col m-0 md:ml-[16%] text-white bg-[#86ACE2] py-1 h-screen'>
                {/* add this to a file content */}
                <div className='text-white w-full md:mt-0 mt-10 px-10'>
                    {/* content here */}
                    <div className='flex flex-col w-full'>
                        <div className='w-full flex flex-row'>
                            <AdminHeader/>
                        </div>
                        <div className='w-full flex flex-col md:px-10 px-0  animate__animated animate__fadeIn'>
                            <div className='w-full flex flex-row justify-between'>
                                <h2 className='text-2xl text-black opacity-[50%]'>
                                    Settings
                                </h2>
                            </div>  
                            <form className="flex items-center justify-center" onSubmit={submitData}>
                                <div className="flex flex-col bg-white px-4 py-1 text-black rounded-md gap-y-2 m-10 md:w-[50%] w-full">
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="d" className="block mb-2 text-sm font-medium ">Firstname</label>
                                        <input name="firstname" type="text" id="firstname" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 text-white border-gray-700 placeholder-gray-700  focus:border-blue-500" placeholder="Firstname" value={firstname} onChange={(e)=>setfirstname(e.target.value)} required />
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="lastname" className="block mb-2 text-sm font-medium ">Lastname</label>
                                        <input name="lastname" type="text" id="lastname" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 text-white border-gray-700 placeholder-gray-700  focus:border-blue-500" placeholder="Lastname" required value={lastname} onChange={(e)=>setlastname(e.target.value)}/>
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="username" className="block mb-2 text-sm font-medium ">Username</label>
                                        <input name="username" type="text" id="username" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 text-white border-gray-700 placeholder-gray-700  focus:border-blue-500" placeholder="Username" required value={username} onChange={(e)=>setusername(e.target.value)} />
                                    </div>

                                    <div className='flex flex-col w-full text-sm text-red-800 capitalize'>
                                        {message}
                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="old_password" className="block mb-2 text-sm font-medium ">Old Password</label>
                                        <input name="old_password" type="password" id="old_password" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 text-white border-gray-700 placeholder-gray-700  focus:border-blue-500" placeholder="Old Password" required onChange={()=>setmessage("")}/>
                                    </div>
                                    
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="new_password" className="block mb-2 text-sm font-medium ">New Password</label>
                                        <input name="new_password" type="password" id="new_password" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 text-white border-gray-700 placeholder-gray-700  focus:border-blue-500" placeholder="New Password" required/>
                                    </div>
                                    <div className='flex flex-col w-full mt-2.5'>

                                        <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full">{"Submit"}</button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}