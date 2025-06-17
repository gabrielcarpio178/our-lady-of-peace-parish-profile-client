
import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import { FaPlus, FaUserPlus, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa'
import { MdOutlineCancel  } from "react-icons/md";
import { useEffect, useState } from 'react'
import { IconContext } from "react-icons";
import DataTable from 'react-data-table-component';
import { userData, api_link } from '../../../api_link';
import axios from 'axios';
import moment from 'moment';
import { BounceLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import React from 'react';
import 'animate.css'
export default function Access_user(){
    const [isShowAddForm, setAddFormShow] = useState(false)
    const [users, setUser] = useState([]);
    const [allData, setAllData] = useState([])
    const [isShowEditForm, setShowEditForm] = useState(false)
    const [editUser, setEditUser] = useState({
                                                id: 0,
                                                firstname: "",
                                                lastname: "",
                                                rule: "",
                                                username: "",
                                                password: ""
                                            })
    const [isLoading, setLoading] = useState(false)
    const [isDisplayLoading, setIsDisplayLoading] = useState(true)
    const myFunction = () => {
        setAddFormShow(!isShowAddForm)
    };

    const editFormShowfun = ()=>{
        setShowEditForm(!isShowEditForm)
    }

    const baseColumns = [
        { name: "NAME", selector: (row: any) => row.NAME, sortable: true },
        { name: "USERNAME", selector: (row: any) => row.USERNAME, sortable: true },
        { name: "ROLE", selector: (row: any) => row.ROLE },
        { name: "STATUS", selector: (row: any) => row.STATUS },
        { name: "DATE", selector: (row: any) => row.DATE, sortable: true },
    ];

    const actionColumn = {
        name: "ACTION",
        selector: (row: any) => row.ACTION,
        style: { alignText: "center" }
    };

    const columns = userData().user.rule==="admin" ? [...baseColumns, actionColumn] : baseColumns;

    async function getData(){
        const token = userData().token
        const userInfo = userData().user
        setIsDisplayLoading(true)
        try {
            var res = await axios.get(`${api_link()}/getUser`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })

            const filterData = res.data.filter((user: any)=>{
                return (user.id!==userInfo.id)
            })

            const result = filterData.map((user: any)=>{
                return {
                            NAME: <div className='capitalize'>{user.firstname+" "+user.lastname}</div>,
                            USERNAME: user.username, 
                            ROLE: <div className='capitalize'>{user.rule}</div>, 
                            STATUS: user.isActive==0?"DEACTIVE":"ACTIVE",
                            DATE: moment(user.addDate).format("MMM D, YYYY"),
                            ACTION: <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-blue-800" onClick={()=>edit(user)}><FaEdit/></button>
                                    
                            
                        }
            })
            setAllData(result)
            setUser(result)
            setIsDisplayLoading(false)
        } catch (error) {
            console.log(error)
        }
        
    }



    useEffect(()=>{
        getData()
    },[])


    const edit = (userData:  { id: number, firstname: string, lastname: string, rule: string, username: string, password: string}): void=>{
        setShowEditForm(!isShowEditForm)
        setEditUser(userData)
    }

    const handleSearch = (e: any)=>{
        let query = e.target.value;
        const searchRes = allData.filter((item: any)=>{
            return item["NAME"]["props"]["children"].toLocaleLowerCase().includes(query.toLocaleLowerCase())
        })
        setUser(searchRes)
    }


    return (
        <>
            <div className="flex md:flex-row flex-col bg-[#86ACE2] md:h-[100vh] h-auto">
                <MyAppNav/>
                {isLoading&&
                <div className='absolute bg-black/50 z-40 w-full h-full'>
                    <div  className='flex items-center justify-center w-full h-full'>
                        <BounceLoader color='#ffffff' size={120}/>
                    </div>
                </div>    
                } 
                {isShowAddForm&&<AddContent onClick={myFunction} refreshUserList={getData} setLoading={()=>setLoading(!isLoading)}/>}
                {isShowEditForm&&<EditForm user={editUser} onClick={editFormShowfun} setLoading={()=>setLoading(!isLoading)}/>}
                <div className='md:w-[80%] text-white w-full md:mt-0 mt-10'>
                    <div className='flex flex-col w-full'>
                        <div className='w-full flex flex-row'>
                            <AdminHeader/>
                        </div>
                        <div className='w-full flex flex-col px-10 animate__animated animate__fadeIn'>
                            <h2 className='text-2xl text-black opacity-[50%]'>
                                List of Users
                            </h2>
                            {userData().user.rule==="admin"&&
                            <div className='flex flex-col'>
                                <div className='flex flex-row items-center justify-end py-1'>
                                    <button type="button" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 flex flex-row items-center gap-x-1 cursor-pointer" onClick={()=>setAddFormShow(!isShowAddForm)}><FaPlus/> Add</button>
                                </div>
                            </div>}
                            <div className='flex flex-row justify-end items-center gap-x-2 bg-white p-3 mt-4'>
                                <label htmlFor="search" className="block mb-2 text-sm font-medium text-black">Search Name:</label>
                                <input name="search" type="text" id="search" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-700 placeholder-gray-700 focus:border-blue-500 w-1/4" placeholder="Search Name" required onChange={handleSearch}/>
                            </div>
                            {!isDisplayLoading?<div className='w-full bg-white'>Loading..</div>:""}
                            {!isDisplayLoading&&
                                <DataTable columns={columns} data={users} pagination paginationPerPage={5} responsive paginationRowsPerPageOptions={[1,2,3,4,5]}></DataTable>
                            }
                            
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}


interface IProps {
    onClick: () => void;
    refreshUserList: () => void;
    setLoading: () => void
}

const AddContent: React.FC<IProps> = (props)=> {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false)
    const [isShowPassword, setShowPassword] = useState(false)


    const loginData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const formValues = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            role: formData.get('role'),
            username: formData.get('username'),
            password: formData.get('password')
        };
        const token = userData().token
        setLoading(true)
        props.setLoading
        try {
            const res = await axios.post(`${api_link()}/addUsers`, formValues, 
            {
            headers:{
                'Content-type':'application/x-www-form-urlencoded',
                "authorization" : `bearer ${token}`,
            }
        })
        if(res.status===200){
            if(res.data.msg==="invalid user"){
                Swal.fire({
                    position: "center",
                    title: `The username or password is already in use.`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1000,
                }).then(()=>{
                    setLoading(false)
                })
            }else{
                props.setLoading()
                Swal.fire({
                    position: "center",
                    title: `Add Successfully`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000,
                }).then(()=>{
                    props.setLoading();
                    window.location.reload()
                })
            }
        }
        
        } catch (error) {
            Swal.fire({
                position: "center",
                title: `Something want wrong`,
                icon: "error",
                showConfirmButton: false,
                timer: 1000,
            }).then(()=>{
                setLoading(false)
            })
        }
    }    

    return (
        <>
        <div className='absolute w-full h-full flex items-center justify-center text-white z-1 bg-black/50'>
            <div className="w-full max-w-2xl bg-[#86ACE2] border border-black shadow-lg rounded md:mx-0 mx-3 animate__animated animate__fadeIn">
                <div className='relative'>
                    <div className='flex flex-row p-3 gap-x-3'>
                        <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                            <div>
                                <FaUserPlus/>
                            </div>
                        </IconContext.Provider>   
                        <div className='text-xl'>
                            Add User
                        </div>
                    </div>
                    <div className='absolute right-2 top-2 cursor-pointer' onClick={props.onClick}>
                        <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                            <div>
                                <MdOutlineCancel/>
                            </div>
                        </IconContext.Provider> 
                        
                    </div>
                </div>
                
                <form className="px-8 pt-6 pb-8 mb-4" onSubmit={loginData}>
                    <div className="mb-4 flex flex-col bg-white px-2 text-black rounded-md gap-y-2">
                        <div className='flex flex-col w-full'>
                            <label htmlFor="d" className="block mb-2 text-sm font-medium ">Firstname</label>
                            <input name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} type="text" id="firstname" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white  focus:border-blue-500" placeholder="Firstname" required />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="lastname" className="block mb-2 text-sm font-medium ">Lastname</label>
                            <input name="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} type="text" id="lastname" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white  focus:border-blue-500" placeholder="Lastname" required />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium ">Role</label>
                            <select name="role" value={role} onChange={(e) => setRole(e.target.value)} id="role" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white  focus:border-blue-500" required>
                                <option value="admin">Admin</option>
                                <option value="encoder">Encoder</option>
                            </select>
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium ">Username</label>
                            <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white  focus:border-blue-500" placeholder="Username" required />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium ">Password</label>
                            <div className='relative'>
                                <input name="password"   value={password} onChange={(e) => setPassword(e.target.value)}type={!isShowPassword?"password":"text"} id="password" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white  focus:border-blue-500" placeholder="password" required />
                                <div className='absolute right-[3%] top-1/4' onClick={()=>setShowPassword(!isShowPassword)}>
                                <IconContext.Provider value={{ color: "white", size: "1.5em" }}>  
                                    {!isShowPassword?<FaEye/>:<FaEyeSlash/>}
                                    
                                </IconContext.Provider>      
                                </div>
                            </div>
                            
                        </div>
                        <div className='flex flex-col w-full mt-2.5'>

                            <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full">{isLoading?"Loading...":"Submit"}</button>

                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}


interface EditUSerData {
    user: {
        id: number
        firstname: string;
        lastname: string,
        rule: string,
        username: string,
        password: string
    },
    onClick: () => void
    setLoading: () => void
}

const EditForm: React.FC<EditUSerData> = (content) =>{
    const {user, onClick} = content
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [rule, setRole] = useState(user.rule);
    const [isLoading, setLoading] = useState(false)

    const userEditSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setLoading(true);
        content.setLoading()
        const formData = new FormData(e.currentTarget)
        const formValues = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            role: formData.get('role'),
            id: user.id
        }
        const token = userData().token
        try {
            await axios.put(`${api_link()}/updateUser`,
                formValues,
                {
                    headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        "authorization" : `bearer ${token}`,
                    }
                }
            );
        Swal.fire({
            position: "center",
            title: `Edit Success`,
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
        }).then(()=>{
            setLoading(false);
            content.setLoading();
            window.location.reload()
        })
        } catch (error) {
            console.log(error)
        }
        window.location.reload()
    }

    return (
        <>
        <div className='absolute w-full h-full flex items-center justify-center text-white z-1 bg-black/50'>
            <div className="w-full max-w-2xl bg-[#86ACE2] border border-black shadow-lg rounded animate__animated animate__fadeIn">
                <div className='relative'>
                    <div className='flex flex-row p-3 gap-x-3'>
                        <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                            <div>
                                <FaUserPlus/>
                            </div>
                        </IconContext.Provider>   
                        <div className='text-xl'>
                            Edit User
                        </div>
                    </div>
                    <div className='absolute right-2 top-2 cursor-pointer' onClick={onClick}>
                        <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                            <div>
                                <MdOutlineCancel/>
                            </div>
                        </IconContext.Provider> 
                    </div>
                </div>
                
                <form className="px-8 pt-6 pb-8 mb-4" onSubmit={userEditSubmit}>
                    <div className="mb-4 flex flex-col bg-white px-2 text-black rounded-md gap-y-2">
                        <div className='flex flex-col w-full'>
                            <label htmlFor="firstname" className="block mb-2 text-sm font-medium ">Firstname</label>
                            <input name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} type="text" id="firstname" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white focus:border-blue-500" placeholder="Firstname" required />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="lastname" className="block mb-2 text-sm font-medium ">Lastname</label>
                            <input name="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} type="text" id="lastname" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white  focus:border-blue-500" placeholder="Lastname" required />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium ">Role</label>
                            <select name="role" value={rule} onChange={(e) => setRole(e.target.value)} id="role" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white  focus:border-blue-500" required>
                                <option value="admin">Admin</option>
                                <option value="encoder">Encoder</option>
                            </select>
                        </div>
                        <div className='flex flex-col w-full mt-2.5'>

                            <button type="submit" className=" focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full text-white">{isLoading?"Loading...":"Submit"}</button>

                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}


