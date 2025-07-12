
import MyAppNav from './AdminNav'
import AdminHeader from './AdminHeader'
import ourLadyOfPeaceFull from './../../../assets/image/our-lady-of-peace-full.png'
import 'animate.css';
import { useEffect, useState } from 'react';
import { api_link, userData } from '../../../api_link';
import {BarGraph, CircleGraph} from './subpage/Graph'
import axios from 'axios';

type TboxesData = {
    name: string,
    countData: number|undefined
}


export default function Dashboard(){
    const [isLoading, setIsLoading] = useState(true)
    const token = userData().token
    const userAccount = userData().user
    const [householdBox, setHouseholdBox] = useState<Record<string, number>>()
    const [lifeStatusData, setLifeStatusData] = useState<Record<string, number>>()

    const getBoxesData = async () =>{
        try {
            const res = await axios.get(`${api_link()}/getDashboardBoxedData`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const lifeStatus = res.data.map((data:any)=>{
                return (
                    {[data.life_status]: data.total_life_status}
                )
            })
            setLifeStatusData(getlifeStatus(lifeStatus))
            setHouseholdBox(householdBoxDataByKey(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    function getlifeStatus<T extends Record<string, number>>(dataArray: T[]): Record<string, number>{
        const result: Record<string, number> = {};
        dataArray.forEach(item => {
            for (let key in item) {
                result[key] = item[key];
            }
        });
        return result
    }


    function householdBoxDataByKey<T extends Record<string, number>>(dataArray: T[]): Record<string, number> {
        const result: Record<string, number> = {};
        dataArray.forEach(item => {
            for (let key in item) {
                const value = Number(item[key]);
                result[key] = (result[key] || 0) + (isNaN(value) ? 0 : value);
            }
        });
        return result
    }

    const boxesData: TboxesData[] = [
        {name: "Population", countData: householdBox?.population??0},
        {name: "Baptized", countData: householdBox?.baptism?? 0},
        {name: "Confirmation", countData: householdBox?.confirmation?? 0},
        {name: "Married", countData: householdBox?.married?? 0},
        {name: "Lumon", countData: householdBox?.lumon?? 0},

        {name: "sick", countData: lifeStatusData?.sick??0},
        {name: "single", countData: lifeStatusData?.single??0},
        {name: "living alone", countData: lifeStatusData?.["living alone"]??0},
        {name: "widowed", countData: lifeStatusData?.widowed??0},
        {name: "widower", countData: lifeStatusData?.widower??0},
    ]

    useEffect(()=>{
        getBoxesData()
    }, [])

    return (
        <>
            <MyAppNav/>
            {/* content here */}
            <div className='flex flex-col m-0 md:ml-[200px] lg:ml-[250px] static text-white bg-[#86ACE2] py-1'>
                <div className='flex flex-col px-10 animate__animated animate__fadeIn'>
                    <div className='w-full flex flex-row'>
                        <AdminHeader/>
                    </div>
                    <div className='w-full flex md:flex-row flex-col items-center justify-between'>
                        <h2 className='text-2xl text-black opacity-[50%]'>
                            Dashboard
                        </h2>
                    </div> 
                    <div className='flex flex-col md:flex-row mt-3 gap-3'>
                        <div className='w-full md:w-[30%] grid grid-cols-2 gap-1'>
                            <div className='w-full rounded-sm shadow-lg bg-[#001656] p-2 col-span-2 relative overflow-hidden'>

                                <div className='flex flex-col justify-content-between'>
                                    <div className='text-2xl font-bold capitalize'>
                                        welcome
                                    </div>
                                    <div className='w-[50%] bg-[#86ACE2] rounded-sm p-1 capitalize mt-2 text-black text-center'>
                                        {userAccount.rule}
                                    </div>
                                </div>

                                <div className='top-8 -right-6 w-[35%] max-w-full absolute'>
                                    <img src={ourLadyOfPeaceFull} alt="Our lady of peace image" />
                                </div>

                            </div>

                            {boxesData.map((data: TboxesData)=>{
                                return(
                                    <div className='w-full rounded-sm shadow-lg bg-[#001656] p-2' key={data.name}>

                                        <div className='flex flex-col justify-content-between'>
                                            <div className='text-xl font-bold capitalize'>
                                                {data.name}
                                            </div>
                                            <div className='w-[50%] bg-[#86ACE2] rounded-sm p-1 capitalize mt-2 text-lg text-center text-black self-center'>
                                                {data.countData}
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}

                        </div>
                        <div className='w-full md:w-[70%] grid grid-cols-2 gap-2'>
                            <div className='w-full bg-white rounded-sm shadow-sm p-3'>
                                <BarGraph datas={[householdBox?.population??0,  householdBox?.baptism?? 0, householdBox?.confirmation?? 0, householdBox?.married?? 0, householdBox?.lumon?? 0]}/>
                            </div>
                            <div className='w-full bg-white rounded-lg shadow-sm p-3'>
                                <CircleGraph datas={[lifeStatusData?.sick??0, lifeStatusData?.single??0, lifeStatusData?.["living alone"]??0, lifeStatusData?.widowed??0, lifeStatusData?.widower??0]}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
}

