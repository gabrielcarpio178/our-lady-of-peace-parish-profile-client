
import churchImg from'./../../assets/image/church-image.png';
import { FaUser, FaEye  } from "react-icons/fa";
import { IconContext } from "react-icons";
import ourLadyOfPeace from'./../../assets/image/our-lady-of-peace.png';
import {api_link} from "../../api_link"
import axios from 'axios';
import { useEffect, useState } from 'react';

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
                localStorage.setItem("user", JSON.stringify(res.data))
                if(res.data.user.rule==="admin"){
                    window.location.href = '/admin/dashboard';
                }
            }
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
        
    }
    
    return (
        <>
            <div className="w-full h-screen relative flex flex-row">
                <div className='w-full flex md:flex-row'>
                    <div className="md:w-[55%]  bg-[#44618E] h-full hidden md:block">
                        <img src={churchImg} alt="church" className='h-full w-full'/>
                    </div>
                    <div className="md:w-[45%] bg-[#86ACE2] relative w-full">
                        <div className='absolute bottom-0 right-0 w-[65%] h-[50%]'>
                            <img src={ourLadyOfPeace} alt="Our Lady Of Peace" className='h-full w-full' />
                        </div>
                    </div>
                </div>
                
                <div className="absolute top-0 w-full h-screen py-40 px-64">
                    <div className="w-full h-full bg-[#001656] rounded-2xl shadow-blue-500 shadow-2xl flex md:flex-row relative">
                        <div className="md:w-[55%] md:flex items-center justify-center">
                            <div className="bg-[#86ACE2] rounded w-[95%] h-[95%] opacity-100">
                                <img src={churchImg} alt="church" className='h-full w-full'/>
                            </div>
                        </div>
                        <form className='md:w-[44%] absolute md:static' method="post" onSubmit={loginData}>
                            <h1 className='text-center p-10 font-serif text-5xl text-white font-light'>
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