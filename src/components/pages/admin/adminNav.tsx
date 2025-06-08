import { NavLink } from "react-router";
import ourLadyOfPeace from'./../../../assets/image/our-lady-of-peace-full.png';
import { FaClock, FaFolderOpen, FaUsers, FaFile, FaWpforms, FaChevronRight , FaChevronDown  } from "react-icons/fa";
import { IoLogOut, IoSettings } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useEffect, useState, type JSX } from "react";
import {api_link, socket_link as socket_link_data, userData} from "../../../api_link"
import axios from "axios";
import { Socket, io as socketIoClient } from 'socket.io-client';
import { CiMenuBurger } from "react-icons/ci";


type nav = {
    id: number,
    link: string,
    name: string,
    icon: JSX.Element,
}

const NAVIGATIONDATA = [
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


const MASTER_LIST = [
    {
        id: 1,
        link: '/barangay',
        name: 'Barangay',
        
    },
    {
        id: 2,
        link: '/household',
        name: 'Households',
    },
]




export default function MyAppNav() {
    const [role, setrole] = useState("loading..")
    const API_LINK = api_link()
    const SOCKET_LINK = socket_link_data()
    const [isNavBarShow, setIsNavBarShow] = useState(false)
    const user_id = userData().user.id
    axios.defaults.withCredentials = true;
    
    const logout = async () => {
        await axios.get(`${API_LINK}/logout/${user_id}`)
        localStorage.removeItem("user")
        var newSocket = socketIoClient(SOCKET_LINK)
        newSocket.emit("thereIsLogined", {
            message: true
        })
        window.location.href = '/login';
    }

    const userRole = ()=>{
        const user = userData()
        setrole(user.user.rule==="admin"?"admin":"encoder")
    }

    useEffect(()=>{
        userRole()
    },[])




    return (
        <>
            <div className={`${!isNavBarShow?"h-auto":"h-screen"} md:w-auto w-full md:h-auto overflow-y-hidden bg-[#001656] flex flex-col md:relative fixed z-1`}>
                <div className="fixed w-10 h-10 md:hidden block right-3 top-2 text-white" onClick={()=>setIsNavBarShow(!isNavBarShow)}>
                    <div className="w-full flex items-center justify-center h-full">
                        <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                            <CiMenuBurger/>
                        </IconContext.Provider>
                        
                    </div>
                </div>
                <div className="flex flex-row border-b-3 border-white items-center md:justify-center md:py-5 gap-x-2 py-2">
                    <div className="md:w-[25%] w-[15%]">
                        <img src={ourLadyOfPeace} alt="Our Lady Of Peace" />
                    </div>
                    <header className="text-white text-2xl capitalize">
                        {role}
                    </header>
                </div>
                
                <div className={`${!isNavBarShow?"hidden md:block":"block"}`}>
                    <nav className="flex flex-col">
                        <div className="md:mt-5 mt-3 overflow-hidden">
                            {NAVIGATIONDATA.map(n=>{
                                return (<Navigation id={n.id} key={n.id} name={n.name} link={n.link} icon={n.icon} />)
                            })}
                        </div>
                    
                    </nav>
                </div>

                
                

                <div className={`text-xl text-white border-t-3 border-white absolute bottom-0 w-full h-[15%] md:flex items-center justify-center md:pl-10 ${!isNavBarShow?"hidden":""} z-1`}>
                    <div className="flex flex-row gap-x-5 w-full py-5 px-10 md:rounded-l-full rounded-full hover:bg-[#86ACE2] cursor-pointer mx-2" onClick={logout}>
                        <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                            <IoLogOut/>
                        </IconContext.Provider>  
                        Log Out
                    </div>
                </div>
            </div>
            
        </>
    );
}

type navCard = nav

function Navigation(props: navCard){
    const classDeActive = "flex flex-row gap-x-5 md:ml-10 mx-10 py-5 px-10 cursor-pointer hover:bg-[#86ACE2] md:hover:rounded-l-full hover:rounded-full md:w-full"
    const classActive = "flex flex-row gap-x-5 md:ml-10 mx-10 py-5 px-10 bg-[#86ACE2] md:rounded-l-full rounded-full cursor-pointer md:w-full"
    const [isShowMasterList, setShowMasterList] = useState(false)
    let navContent;
    const masterListDiv = MASTER_LIST.map((master)=>{
                            return (
                                <NavLink key={master.id} to={master.link} className={({ isActive }) => isActive ? "py-2 px-5 w-full bg-[#86ACE2] rounded-l-full text-lg": "py-2 px-5 w-full rounded-l-full hover:bg-[#86ACE2] text-lg"}>
                                    {master.name}
                                </NavLink>
                            )
                        })

    if(props.id!==2){
        navContent = 
            <NavLink to={props.link} className={({ isActive }) => isActive ? classActive : classDeActive }>
                <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                    <div>
                        {props.icon}
                    </div>
                </IconContext.Provider>  
                {props.name}
            </NavLink>
    }else{
        navContent = 
            <>
                <div className={classDeActive} onClick={()=>setShowMasterList(!isShowMasterList)}>
                <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                    <div>
                        {props.icon}
                    </div>
                </IconContext.Provider>  
                <div className="flex flex-row">
                    {props.name}
                </div>
                <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                    <div>
                        {!isShowMasterList?<FaChevronRight/>:<FaChevronDown/>}
                    </div>
                </IconContext.Provider> 
            </div>
            <div className="flex flex-col items-center ml-32">
                {isShowMasterList&&masterListDiv}
            </div>
            </>
            
            
    }

    
    return (
        <>
            <div className="text-white w-full text-xl whitespace-nowrap">
                {navContent}
            </div>
            
        </>
    )
}
