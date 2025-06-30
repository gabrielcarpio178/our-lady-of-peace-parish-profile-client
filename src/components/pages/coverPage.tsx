import { Link } from 'react-router-dom';
import churchImg from'./../../assets/image/church-image.png';
import coverpage_bg from './../../assets/image/coverpage_bg.jpg'
import nitodel from './../../assets/image/fr.nitodel.png'
import john from './../../assets/image/fr.johnrey.png'
import React, { useEffect, useState } from 'react';
import { FaSquareFacebook } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import 'animate.css';

export default function CoverPage(){

    const [img_id, setimg_id] = useState(2);
    const [animationContent, setAnimationContent] = useState("animate__fadeInRight");
    const [numbers, setNumbers] = useState(2)

    const content = [
        {img: nitodel, position: "Parish Priest" ,name: "Rev. Fr. Nitodel A. Soriano SThL, PhD"},
        {img: john, position: "Parochial Vicar" ,name: "Rev. Fr. John Rey C. Maquilan"},
    ]

    const handleSetImgId = (id: number) => {
        setAnimationContent("animate__fadeOutLeft");
        void setTimeout(() => {
            setimg_id(id);
            setAnimationContent("animate__fadeInRight");
        }, 100);
        setNumbers(id)
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setNumbers(prevNumbers => {
                const newNumber = (prevNumbers + 1) % 3;
                setTimeout(() => handleSetImgId(newNumber), 0);
                return newNumber;
            });
        }, 3000);
    return () => clearInterval(interval);
}, []);


    return (
        <>
            <div className='bg-[#44618E] w-full h-screen before:bg-[#00447880] before:content-[""] before:w-full before:h-screen relative before:absolute before:opacity-50 before:z-30 flex flex-col justify-between'>
                <img src={churchImg} alt="churchImg" className='w-full h-full absolute z-20' />

                <div className='static z-[999]'>
                    <div className='p-14 w-full flex md:flex-row flex-col justify-between items-center gap-y-5'>
                        <div className='text-white md:w-[40%] w-full text-center md:text-start text-2xl font-serif md:text-5xl'>
                            Our Lady of Peace Parish Diocese of Bacolod
                        </div>
                        <div className=''>
                            <Link to="/login" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full">Login</Link>
                        </div>
                    </div>
                </div>

                <div className='z-[999]'>
                    <div className='w-full flex flex-col items-center relative'>
                        <div className='z-[999] overflow-hidden w-full'>
                            {img_id!==2&&
                                <div className={`bg-center bg-no-repeat bg-cover py-5 animate__animated ${animationContent}`} style={{ backgroundImage: `url('${coverpage_bg}')`}}>
                                    <div className='grid grid-cols-1 h-full w-full'>
                                        <ContentCard img={content[img_id].img} position={content[img_id].position} name={content[img_id].name}/> 
                                    </div>
                                </div>
                            }
                            
                        </div>
                        <div className='flex flex-row gap-5 absolute bottom-13 z-[999]'>
                            <div className={`${img_id!=2?"bg-gray-400":"bg-black"}  opacity-50 cursor-pointer w-4 h-4 rounded-full`} onClick={()=>handleSetImgId(2)}></div>
                            <div className={`${img_id!=0?"bg-gray-400":"bg-black"} opacity-50 cursor-pointer w-4 h-4 rounded-full`} onClick={()=>handleSetImgId(0)}></div>
                            <div className={`${img_id!=1?"bg-gray-400":"bg-black"} opacity-50 cursor-pointer w-4 h-4 rounded-full`} onClick={()=>handleSetImgId(1)}></div>
                        </div>
                        <div className='flex flex-row items-center gap-x-2 bg-[#001656] text-white p-1 w-full md:text-lg text-sm'>
                            <div>
                                <IconContext.Provider value={{ color: "white", size: "2em" }}>
                                    <FaSquareFacebook/>
                                </IconContext.Provider>
                                
                            </div>
                            <div>
                                Our Lady of Peace Parish - Diocese of Bacolod
                            </div>
                            
                        </div>
                    </div>
                </div>
                

                {/* 

                

                 */}
                
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
                        <div className='flex md:flex-row flex-col items-center w-full justify-center gap-x-10'>
                            <div className='md:w-[20%] w-[40%] overflow-hidden flex items-center justify-center'>
                                <img src={img} alt={name} className='w-full object-cover' />
                            </div>
                            <div className='md:w-[60%]'>
                                <div className='md:text-5xl text-2xl font-serif'>
                                    {name}
                                </div>
                                <div className='md:text-3xl text-xl font-semibold opacity-[71%] md:text-start text-center'>
                                    {position}
                                </div>
                            </div>
                        </div>
                    </div>
                
        </>
    )
}

function useRef<T>(arg0: null) {
    throw new Error('Function not implemented.');
}
