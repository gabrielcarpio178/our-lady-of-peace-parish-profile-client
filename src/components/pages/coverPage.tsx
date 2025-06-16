import { Link } from 'react-router-dom';
import churchImg from'./../../assets/image/church-image.png';
import coverpage_bg from './../../assets/image/coverpage_bg.jpg'
import nitodel from './../../assets/image/fr.nitodel.png'
import john from './../../assets/image/fr.johnrey.png'
import React, { useEffect, useState } from 'react';
import { FaSquareFacebook } from "react-icons/fa6";
import { IconContext } from 'react-icons';

export default function CoverPage(){
    const [datacontent, setDataContent] = useState<ContentData[]>([])

    const content = [
        {img: nitodel, position: "Parish Priest" ,name: "Rev. Fr. Nitodel A. Soriano SThL, PhD"},
        {img: john, position: "Parochial Vicar" ,name: "Rev. Fr. John Rey C. Maquilan"},
    ]

    useEffect(()=>{
        setDataContent(content)
    },[])

    return (
        <>
            <div className='bg-[#44618E] w-full h-screen before:bg-[#00447880] before:content-[""] before:w-full before:h-screen relative before:absolute before:opacity-50 before:z-30'>
                <img src={churchImg} alt="churchImg" className='w-full h-full absolute z-20' />

                <div className='p-14 absolute z-[999] w-full flex flex-row justify-between items-center'>
                    <div className='text-white w-[40%] text-5xl font-serif'>
                        Our Lady of Peace Parish Diocese of Bacolod
                    </div>
                    <div className=''>
                        <Link to="/login" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">Login</Link>
                    </div>
                </div>
            </div>
        
            <div className=' w-full h-screen overflow-hidden relative'>
                <img src={coverpage_bg} alt="coverpage background" className='w-full object-center absolute -top-96' />

                <div className='absolute z-[999] grid grid-cols-1 h-full w-full'>
                    {datacontent.map((data: any)=>{
                        return(
                            <ContentCard img={data.img} position={data.position} name={data.name}/>
                        )
                    })}
                </div>

            </div>

            <div className='flex flex-row items-center gap-x-2 bg-[#001656] text-white p-1'>
                <div>
                    <IconContext.Provider value={{ color: "white", size: "2em" }}>
                        <FaSquareFacebook/>
                    </IconContext.Provider>
                    
                </div>
                <div className='text-lg'>
                    Our Lady of Peace Parish - Diocese of Bacolod
                </div>
                
            </div>

        </>
    )
}

interface ContentData{
    img: string,
    position: string,
    name: string
}

const ContentCard:React.FC<ContentData> = (props) =>{
    const {img, position, name} = props
    return (
        <>
            <div className='flex items-center'>
                <div className='flex flex-row items-center w-full justify-center gap-x-10'>
                    <div className='w-[20%] overflow-hidden flex items-center justify-center'>
                        <img src={img} alt={name} className='w-full object-cover' />
                    </div>
                    <div className='w-[60%]'>
                        <div className='text-5xl font-serif'>
                            {name}
                        </div>
                        <div className='text-3xl font-semibold opacity-[71%]'>
                            {position}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}