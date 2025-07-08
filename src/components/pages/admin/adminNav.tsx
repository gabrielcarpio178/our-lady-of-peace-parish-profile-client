import { NavLink } from "react-router";
import ourLadyOfPeace from'./../../../assets/image/our-lady-of-peace-full.png';
import { FaClock, FaFolderOpen, FaUsers, FaFile, FaWpforms, FaChevronRight , FaChevronDown  } from "react-icons/fa";
import { IoLogOut, IoSettings } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useEffect, useState, type JSX } from "react";
import {api_link, userData} from "../../../api_link"
import axios from "axios";
import { CiMenuBurger } from "react-icons/ci";
import { FaX } from "react-icons/fa6";


type nav = {
    id: number,
    link: string,
    name: string,
    icon: JSX.Element,
}

const NAVIGATIONDATA: nav[] = [
    {
        id: 1,
        link: '/dashboard',
        name: 'Dashboard',
        icon: <FaClock/>,
    },
    {  
        id: 2,
        link: '/master_list',
        name: 'Master List',
        icon: <FaFolderOpen/>,
    },
    {
        id: 3,
        link: '/access_users',
        name: 'Access Users',
        icon: <FaUsers/>,
    },
    {
        id: 4,
        link: '/records',
        name: 'Records',
        icon: <FaFile/>,
    },
    {
        id: 5,
        link: '/settings',
        name: 'Settings',
        icon: <IoSettings />,
    },
    {
        id: 6,
        link: '/survey_form',
        name: 'Survey form',
        icon: <FaWpforms/>,
    },
]

type Tmaster_list ={id: number, link:string, name: string}


const MASTER_LIST: Tmaster_list[] = [
    {
        id: 1,
        link: '/master_list/barangay',
        name: 'Barangay',
        
    },
    {
        id: 2,
        link: '/master_list/household',
        name: 'Households',
    },
]


type MyAppNavProps = {
    isOpenMasterList?: boolean
};

export default function MyAppNav({isOpenMasterList}:MyAppNavProps) {
    const [role, setrole] = useState("loading..")
    const API_LINK = api_link()
    const [isNavBarShow, setIsNavBarShow] = useState(false)
    const user_id = userData().user.id
    const [isShowMasterList, setShowMasterList] = useState(!isOpenMasterList?false:true)
    axios.defaults.withCredentials = true;
    
    const logout = async () => {
        await axios.get(`${API_LINK}/logout/${user_id}`)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        window.location.href = '/login';
    }

    const userRole = ()=>{
        const user = userData()
        setrole(user.user.rule==="admin"?"admin":"encoder")
    }

    const handleDisable = (event: React.MouseEvent<HTMLAnchorElement>) =>{
        setShowMasterList(!isShowMasterList)
        event.preventDefault()
    }

    useEffect(()=>{
        userRole()
    },[])




    return (
        <>      
            <div className="fixed z-40 w-full">
                <div className="flex flex-row border-b-3 border-white items-center md:justify-center md:py-5 gap-x-2 py-2 bg-[#001656] md:w-64 sm:w-full w-full relative">
                    <div className="md:w-[25%] w-[15%]">
                        <img src={ourLadyOfPeace} alt="Our Lady Of Peace" />
                    </div>
                    <header className="text-white sm:text-2xl md:text-2xl text-xl capitalize">
                        {role}
                    </header>
                    <div onClick={()=>{setIsNavBarShow(!isNavBarShow)}} className="absolute right-2 cursor-pointer block sm:hidden md:hidden">
                        <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                            {!isNavBarShow?<CiMenuBurger/>:<FaX/>}
                        </IconContext.Provider>
                    </div>
                </div>
                <div className={`absolute lg:top-21 left-0 w-64 h-screen transition-transform ${isNavBarShow ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 sm:translate-x-0  bg-[#001656]`}>
                    <ul className="space-y-2 font-medium mt-5">
                        {NAVIGATIONDATA.map((data: nav)=>{
                            return (
                                <li className="pl-5" key={data.id}>
                                    {data.name!=="Master List"&&
                                    <NavLink to={data.link} className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-[#86ACE2] text-white" : "text-white"} flex items-center p-3 rounded-l-full hover:bg-[#86ACE2] group`}>
                                        <div>
                                            {data.icon}
                                        </div>
                                        <span className="ms-3">{data.name}</span>
                                    </NavLink>
                                    }
                                    {data.name==="Master List"&&
                                        <>
                                            <NavLink to="/master_list" onClick={handleDisable} className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-[#86ACE2] text-white" : "text-white"} flex items-center p-3 rounded-l-full hover:bg-[#86ACE2] group`} key={data.id}>
                                                <div className="flex flex-row items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div>
                                                            {data.icon}
                                                        </div>
                                                        <span className="ms-3">{data.name}</span>
                                                    </div>
                                                    <div className="absolute right-10">
                                                        {!isShowMasterList?<FaChevronRight/>:<FaChevronDown/>}
                                                    </div>
                                                </div>
                                            </NavLink>
                                            <div className={`ml-10 ${!isShowMasterList&&"hidden"} mt-1`} >
                                                {MASTER_LIST.map((data: Tmaster_list)=>{
                                                    return (
                                                        <NavLink to={data.link} key={data.id} className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-[#86ACE2] text-white" : "text-white"} flex items-center p-3 rounded-l-full hover:bg-[#86ACE2] group`}>
                                                            {data.name}
                                                        </NavLink>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    }
                                </li>
                            )})
                        }
                        <li className="pl-5 absolute bottom-[12%] w-full cursor-pointer border-t-3 border-white">
                            <div className="py-5">
                                <div className={`text-white flex items-center p-3 rounded-l-full hover:bg-[#86ACE2] group`} onClick={logout}>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center">
                                            <div>
                                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                                <IoLogOut/>
                                            </IconContext.Provider> 
                                            </div>
                                            <span className="ms-3">Log Out</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
