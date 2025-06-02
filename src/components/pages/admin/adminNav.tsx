import { NavLink } from "react-router";
import ourLadyOfPeace from'./../../../assets/image/our-lady-of-peace-full.png';
import { FaClock, FaFolderOpen, FaUsers, FaFile, FaWpforms, FaChevronRight , FaChevronDown  } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { IconContext } from "react-icons";
import { useState, type JSX } from "react";
import {api_link} from "../../../api_link"
import axios from "axios";


type nav = {
    id: number,
    link: string,
    name: string,
    icon: JSX.Element,
}

const NAVIGATIONDATA = [
    {
        id: 1,
        link: '/admin/dashboard',
        name: 'Dashboard',
        icon: <FaClock/>,
    },
    {  
        id: 2,
        link: '/admin/master_list',
        name: 'Master List',
        icon: <FaFolderOpen/>,
    },
    {
        id: 3,
        link: '/admin/access_users',
        name: 'Access Users',
        icon: <FaUsers/>,
    },
    {
        id: 4,
        link: '/admin/records',
        name: 'Records',
        icon: <FaFile/>,
    },
    {
        id: 5,
        link: '/survey_form',
        name: 'Survey form',
        icon: <FaWpforms/>,
    },
]


const MASTER_LIST = [
    {
        id: 1,
        link: '/admin/barangay',
        name: 'Barangay',
        
    },
    {
        id: 2,
        link: '/admin/household',
        name: 'Households',
    },
]




export default function MyAppNav() {
    const API_LINK = api_link()
    axios.defaults.withCredentials = true;

    const logout = async () => {
        await axios.get(`${API_LINK}/logout`)
        localStorage.removeItem("user")
        window.location.href = '/';
    }

    return (
        <>
            <div className="w-[20%] h-screen bg-[#001656] flex flex-col relative">
                <nav className="flex flex-col">
                    <div className="flex flex-row border-b-3 border-white items-center justify-center py-5 gap-x-2">
                        <div className="w-[25%]">
                            <img src={ourLadyOfPeace} alt="Our Lady Of Peace" />
                        </div>
                        <header className="text-white text-2xl">
                            Admin
                        </header>
                    </div>
                    <div className="mt-5">
                        {NAVIGATIONDATA.map(n=>{
                            return (<Navigation id={n.id} key={n.id} name={n.name} link={n.link} icon={n.icon} />)
                        })}
                    </div>
                
                </nav>

                <div className="text-xl text-white border-t-3 border-white absolute bottom-0 w-full h-[15%] flex items-center justify-center pl-10">
                    <div className="flex flex-row gap-x-5 w-full py-5 px-10 rounded-l-full hover:bg-[#86ACE2] cursor-pointer" onClick={logout}>
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
    const classDeActive = "flex flex-row gap-x-5 ml-10 py-5 px-10 cursor-pointer hover:bg-[#86ACE2] hover:rounded-l-full"
    const classActive = "flex flex-row gap-x-5 ml-10 py-5 px-10 bg-[#86ACE2] rounded-l-full cursor-pointer"
    const [isShowMasterList, setShowMasterList] = useState(false)
    let navContent;
    const masterListDiv = MASTER_LIST.map((master)=>{
                            return (
                                <NavLink key={master.id} to={master.link} className={({ isActive }) => isActive ? "py-5 px-10 w-full bg-[#86ACE2] rounded-l-full": "py-5 px-10 w-full rounded-l-full hover:bg-[#86ACE2] hover:rounded-l-full"}>
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
            <div className="flex flex-col items-center ml-10 pl-12">
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
