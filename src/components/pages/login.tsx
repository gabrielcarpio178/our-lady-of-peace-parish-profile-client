
import churchImg from'./../../assets/image/church-image.png';
import { FaUser, FaEye  } from "react-icons/fa";
import { IconContext } from "react-icons";
import ourLadyOfPeace from'./../../assets/image/our-lady-of-peace.png';
import {api_link, socket_link as socket_linkData} from "../../api_link"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import React from 'react';
import { Socket, io as socketIoClient } from 'socket.io-client';

export default function Login(){
    const API_LINK = api_link()
    axios.defaults.withCredentials = true;
    const [resultInput, setResult] = useState("")
    const [isLoading, setLoading] = useState(false)
    useEffect(()=>{
        setResult("")
        setLoading(false)
    },[])

    const loginData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        setLoading(true);
        const formData = new FormData(e.currentTarget)
        const formValues = {
            username: formData.get('username'),
            password: formData.get('password')  
        }
        
        try {
            const res = await axios.post(`${API_LINK}/loginUser`, formValues);
            
            if(res.data.msg!=="logined"){
                setResult(res.data.msg);
            }else{
                localStorage.setItem("user", JSON.stringify(res.data.user))
                localStorage.setItem("token", res.data.token)
                var newSocket = socketIoClient(socket_linkData())
                newSocket.emit("thereIsLogined", {
                    message: true
                })
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
        
    }
    
    return (
        <>
            <div className="w-full h-screen relative flex flex-row items-center justify-center">
                {isLoading&&
                <div className='absolute bg-black/50 z-1 w-full h-full'>
                    <div  className='flex items-center justify-center w-full h-full'>
                        <BounceLoader color='#ffffff' size={120}/>
                    </div>
                </div>    
                }
                <div className='w-full flex md:flex-row h-full'>
                    <div className="md:w-[55%] bg-[#44618E] h-full hidden md:block">
                        <img src={churchImg} alt="church" className='h-full w-full'/>
                    </div>
                    <div className="md:w-[45%] bg-[#86ACE2] relative w-full">
                        <div className='absolute bottom-0 right-0 w-[65%] h-[50%]'>
                            <img src={ourLadyOfPeace} alt="Our Lady Of Peace" className='h-full w-full' />
                        </div>
                    </div>
                </div>
                
                <div className="absolute md:w-auto w-full md:h-auto h-1/2 md:p-0 p-5">
                    <div className="w-full h-full bg-[#001656] rounded-2xl shadow-blue-500 shadow-2xl flex md:flex-row relative">
                        <div className="md:w-[55%] md:flex hidden items-center justify-center">
                            <div className="bg-[#86ACE2] rounded w-[95%] h-[95%] opacity-100">
                                <img src={churchImg} alt="church" className='h-full w-full'/>
                            </div>
                        </div>
                        <form className='md:w-[44%] absolute md:static w-full h-full flex flex-col justify-center md:block md:p-0 p-16' method="post" onSubmit={loginData}>
                            <h1 className='text-center md:p-10 font-serif md:text-5xl text-4xl text-white font-light w-full'>
                                Welcome
                            </h1>
                            <div className='flex flex-col gap-y-3'>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                                    <div className='relative'>
                                        <div className='absolute right-[3%] w-10 h-10 flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                                <div>
                                                    <FaUser/>
                                                </div>
                                            </IconContext.Provider>   
                                        </div>
                                        <input name="username" type="text" id="username" className={`border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500`} placeholder="Username" required />
                                    </div>
                                    
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                    <div className='relative'>
                                        <div className='absolute right-[3%] w-10 h-10 flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                                <div>
                                                    <FaEye/>
                                                </div>
                                            </IconContext.Provider>   
                                        </div>
                                        <input name='password' type="password" id="password" className={`border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500`} placeholder="Password" required />
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-red-800 capitalize" role="alert">
                                    {resultInput}
                                </div>
                                <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">{isLoading?"Loading...":"Login"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

function socket_link(): Partial<import("socket.io-client").ManagerOptions & import("socket.io-client").SocketOptions> | undefined {
    throw new Error('Function not implemented.');
}
