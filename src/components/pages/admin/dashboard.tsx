
import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import ourLadyOfPeaceFull from './../../../assets/image/our-lady-of-peace-full.png'
import 'animate.css';
import { useEffect, useState } from 'react';
import { api_link, userData } from '../../../api_link';
import {BarGraph, CircleDoughnut, CircleGraph, CircleGraphBarangay} from './subpage/Graph'
import axios from 'axios';

type TboxesData = {
    name: string,
    countData: number|undefined|string
}

type ToccuptionData = {
    ofw: number,
    pensioner: number
}

type TbecList = {
    bec_name: string
    id: number
    barangay_id: number
}

type TbarangayList = {
    barangay_name: string
    id: number
}


type TdisplayGraph = {
    total_encoder_catholic: number|null,
    barangay_name: string,
    barangay_id: number,
}


export default function Dashboard(){
    const [isLoading, setIsLoading] = useState(true)
    const token = userData().token
    const userAccount = userData().user
    const [householdBox, setHouseholdBox] = useState<Record<string, number>>()
    const [lifeStatusData, setLifeStatusData] = useState<Record<string, number>>()
    const [occuptionData, setOccuptionData] = useState<ToccuptionData|null>();
    const [barangay_id, setBarangay_id] = useState<number>(0);
    const [_, setBec_id] = useState<number>(0);
    const [barangayList, setBarangayList] = useState<TbarangayList[]>([]);
    const [beclist, setBecList] = useState<TbecList[]>([]);
    const [valuesPerBarangay, setValuesPerBarangay] = useState<number[]>([])
    const [labelsPerBarangay, setLabelsPerBarangay] = useState<string[]>([])

    const getBoxesData = async () =>{
        try {
            const res = await axios.get(`${api_link()}/getdashboardData`, {
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
            const ofw = res.data[0].OFW;
            const pensioner = res.data[0].Pensioner;
            setLifeStatusData(getlifeStatus(lifeStatus))
            setHouseholdBox(householdBoxDataByKey(res.data))
            setOccuptionData({ofw, pensioner})
            setIsLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    const getBarangayList = async () =>{
        try {
            const res = await axios.get(`${api_link()}/getBarangay`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            setBarangayList(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const getCountByBarangay = async ()=>{
        try {
            const res = await axios.get(`${api_link()}/getCountByBarangay`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            displayGraph(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const displayGraph = (datas: TdisplayGraph[])=>{
        const values = datas.map((data:TdisplayGraph)=>{
            if(data.total_encoder_catholic == null){
                data.total_encoder_catholic = 0
            }
            return (data.total_encoder_catholic);
        })
        const labels = datas.map((data:TdisplayGraph)=>{
            return (data.barangay_name.charAt(0).toUpperCase() + data.barangay_name.slice(1));
        })
        setValuesPerBarangay(values)
        setLabelsPerBarangay(labels)
    }

    const getBecList = async (id: number) =>{
        setBarangay_id(id)
        setBec_id(0);
        try {
            const res = await axios.get(`${api_link()}/getBecList`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const resDatas: TbecList[] = res.data.filter((data: TbecList)=>{
                return (data.barangay_id === id);
            })
            setBecList(resDatas);
            filterDataDisplay(id, 0);
        } catch (error) {
            console.log(error)
        }
    }

    function becGetId(id: number){
        setBec_id(id)
        filterDataDisplay(barangay_id, id);
    }

    async function filterDataDisplay(barangay_id: number, bec_id: number){
        setIsLoading(true);
        if(barangay_id!==0||bec_id!==0){
            try {
                const res = await axios.get(`${api_link()}/getFilterData/${barangay_id}/${bec_id}`, {
                    headers: {
                        'Content-type':'application/x-www-form-urlencoded',
                        "authorization" : `bearer ${token}`,
                    }
                })
                if(res.data.length!==0){
                    const lifeStatus = res.data.map((data:any)=>{
                        return (
                            {[data.life_status]: data.total_life_status}
                        )
                    })
                    setIsLoading(false);
                    const ofw = res.data[0].OFW;
                    const pensioner = res.data[0].Pensioner;
                    setLifeStatusData(getlifeStatus(lifeStatus))
                    setHouseholdBox(householdBoxDataByKey(res.data))
                    setOccuptionData({ofw, pensioner})
                }else{
                    setIsLoading(false);
                    const ofw = 0;
                    const pensioner = 0;
                    setOccuptionData({ofw, pensioner})
                    setLifeStatusData({});
                    setHouseholdBox({});
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            setIsLoading(false);
            getBoxesData();
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
        {name: "Population", countData: isLoading?"Loading...":householdBox?.population??0},
        {name: "Not Baptized", countData: isLoading?"Loading...":householdBox?.baptism?? 0},
        {name: "Not Confirmed", countData: isLoading?"Loading...":householdBox?.confirmation?? 0},
        {name: "Not Married", countData: isLoading?"Loading...":householdBox?.marrige?? 0},
        {name: "Lumon", countData: isLoading?"Loading...":householdBox?.lumon?? 0},

        {name: "---", countData: isLoading?"Loading...":lifeStatusData?.[""]??0},
        {name: "sick", countData: isLoading?"Loading...":lifeStatusData?.sick??0},
        {name: "single", countData: isLoading?"Loading...":lifeStatusData?.single??0},
        {name: "living alone", countData: isLoading?"Loading...":lifeStatusData?.["living alone"]??0},
        {name: "widowed", countData: isLoading?"Loading...":lifeStatusData?.widowed??0},
        {name: "widower", countData: isLoading?"Loading...":lifeStatusData?.widower??0},
        {name: "OFW", countData: isLoading?"Loading...":occuptionData?.ofw??0},
        {name: "Pensioner", countData: isLoading?"Loading...":occuptionData?.pensioner??0},
    ]


    useEffect(()=>{
        getBoxesData();
        getBarangayList();
        getCountByBarangay()
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

                        <div className="flex flex-row text-white p-2 rounded-lg gap-x-2 bg-[#001656] md:w-[30%] w-full md:mt-0 mt-4">
                            <div className='flex flex-col w-[50%]'>
                                <label htmlFor="barangay" className="block mb-2 text-sm font-medium">Barangay</label>
                                <select name="barangay" id="barangay" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required onChange={e=>getBecList(parseInt(e.target.value))} value={barangay_id}>
                                    <option value="0">All</option>
                                    {barangayList.map((data: TbarangayList)=>{
                                        return (<option key={data.id} value={data.id}>{data.barangay_name}</option>)
                                    })}
                                </select>
                            </div>
                            <div className='flex flex-col w-[50%]'>
                                <label htmlFor="bec_name" className="block mb-2 text-sm font-medium">BEC Name</label>
                                <select name="bec_name" id="bec_name" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required disabled={beclist.length === 0} onChange={e=>becGetId(parseInt(e.target.value))}>
                                    <option value="0">All</option>
                                    {beclist.map((data: TbecList)=>{
                                        return (<option key={data.id} value={data.id}>{data.bec_name}</option>)
                                    })}
                                </select>
                            </div>
                        </div>
                    </div> 
                    <div className='flex flex-col md:flex-row mt-3 gap-3'>
                        <div className='w-full md:w-[30%] grid grid-cols-2 gap-1'>
                            <div className='w-full rounded-sm shadow-lg bg-[#001656] p-2 col-span-1 relative overflow-hidden'>

                                <div className='flex flex-col justify-content-between'>
                                    <div className='text-2xl font-bold capitalize'>
                                        welcome
                                    </div>
                                    <div className='w-[50%] bg-[#86ACE2] rounded-sm p-1 capitalize mt-2 text-black text-center'>
                                        {userAccount.rule}
                                    </div>
                                </div>

                                <div className='top-12 -right-4 w-[60%] max-w-full absolute'>
                                    <img src={ourLadyOfPeaceFull} alt="Our lady of peace image" />
                                </div>

                            </div>

                            {boxesData.map((data: TboxesData)=>{
                                return(
                                    <div className='w-full rounded-sm shadow-lg bg-[#001656] p-2 flex flex-col justify-center' key={data.name}>

                                        <div className='flex flex-col justify-content-between'>
                                            <div className='text-sm font-bold capitalize'>
                                                {data.name}
                                            </div>
                                            <div className='w-[50%] bg-[#86ACE2] rounded-sm p-1 capitalize mt-2 text-sm text-center text-black self-center'>
                                                {data.countData}
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}

                        </div>
                        <div className='w-full md:w-[70%] grid grid-cols-2 gap-2'>
                            <div className='w-full bg-white rounded-sm shadow-sm p-3'>
                                <BarGraph datas={[householdBox?.population??0,  householdBox?.baptism?? 0, householdBox?.confirmation?? 0, householdBox?.marrige?? 0, householdBox?.lumon?? 0]}/>
                            </div>
                            <div className='w-full bg-white rounded-sm shadow-sm p-3'>
                                <CircleGraphBarangay labels={labelsPerBarangay} values={valuesPerBarangay}/>
                            </div>
                            <div className='w-full bg-white rounded-lg shadow-sm p-3'>
                                <CircleGraph datas={[lifeStatusData?.[""]??0,lifeStatusData?.sick??0, lifeStatusData?.single??0, lifeStatusData?.["living alone"]??0, lifeStatusData?.widowed??0, lifeStatusData?.widower??0]}/>
                            </div>
                            <div className='w-full bg-white rounded-lg shadow-sm p-3'>
                                <CircleDoughnut datas={[occuptionData?.ofw??0, occuptionData?.pensioner??0]}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
}

