
import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import axios from 'axios'
import { userData, api_link, socket_link } from '../../../api_link'
import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { IconContext } from 'react-icons';
import { FaPeopleGroup } from 'react-icons/fa6';
import { MdBusiness } from 'react-icons/md'
import { FaCross, FaChild, FaCheckCircle, FaUserFriends } from 'react-icons/fa';

export default function Dashboard(){
    const chartRef = useRef<HTMLCanvasElement | null>(null)
    const chartInstanceRef = useRef<Chart | null>(null);
    const [barangayList, setBarangayList] = useState([])
    const [dataGraph, setDataGraph] = useState([0,0,0,0,0,0])
    const [becList, setBecList] = useState([]);
    const [bec_id, setBEC_id] = useState(0)
    const [brgy_id, setBrgy_id] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const getBarangayList = async ()=>{
        const token = userData().token
        try {
            const res = await axios.get(`${api_link()}/getBarangay`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }   
            })
            setBarangayList(res.data)
            dashboardData(bec_id, brgy_id)
            getBEClist(0)
        } catch (error) {
            console.log(error)
        }
    }
    const getBEClist = async (id: number)=>{
        const token = userData().token
        setBrgy_id(id)
        try {
            const res = await axios.get(`${api_link()}/getBecList`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            if(id!=0){
                const datas = res.data.filter((data: any)=>{return data.barangay_id == id})
                setBEC_id(parseInt(datas.length==0?"":"0"))
                setBecList(datas)
                if(datas.length!=0){
                    dashboardData(0, id)
                }
                
            }else{
                res.data = [{id: "0", bec_name: "All"}]
                dashboardData(0, id)
                setBEC_id(0)
                setBecList(res.data)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const setBEC_data_id = (e: any)=>{
        const id = e.target.value;
        setBEC_id(id)
        dashboardData(id, brgy_id)
    }

    const dashboardData = async (bec_data_id: number, brgy_data_id: number)=>{
        const token = userData().token
        setIsLoading(true)
        try {
            const res = await axios.get(`${api_link()}/getdashboardData`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            filterData(res.data, bec_data_id, brgy_data_id)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    const filterData = (datas: {barangay_id: any, bec_id: any, confirmation: any, total_baptism: any, total_catholic: any, total_household: any, total_married: any, total_lumon: any}[], BEC_id: number, barangay_id: number) =>{
        let dataContent = [0,0,0,0,0,0]
        let dataResult = datas
        if(BEC_id!=0||barangay_id!=0){
            if(barangay_id!=0){
                const dataFIlter = datas.filter((data: any)=>data.barangay_id==barangay_id)
                dataResult = dataFIlter
            }
            if(BEC_id!=0){
                const dataFIlter = datas.filter((data: any)=>data.bec_id==BEC_id)
                dataResult = dataFIlter
            }
            if(barangay_id!=0&&BEC_id!=0){
                const dataFIlter = datas.filter((data: any)=>data.bec_id==BEC_id)
                dataResult = dataFIlter
            }
        }
        dataResult.map((data: any)=>{
            dataContent[0]=dataContent[0]+parseInt(data.total_household)
            dataContent[1]=dataContent[1]+parseInt(data.total_catholic)
            dataContent[2]=dataContent[2]+parseInt(data.total_baptism)
            dataContent[3]=dataContent[3]+parseInt(data.confirmation)
            dataContent[4]=dataContent[4]+parseInt(data.total_married)
            dataContent[5]=dataContent[5]+parseInt(data.total_lumon)
        })
        setDataGraph(dataContent);
    }
    useEffect(()=>{
        getBarangayList();
        
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Population', 'Roman Catholic', 'Baptized', 'Confirmation', 'Married', 'Lumon'],
                    datasets: [{
                        label: 'Survey Data Summary',
                        data: dataGraph,
                        backgroundColor: [
                            'rgb(67, 204, 99)',
                            'rgb(245, 250, 250)',
                            'rgb(237, 221, 128)',
                            'rgb(98, 169, 240)',
                            'rgb(230, 119, 242)',
                            'rgb(237, 221, 128)'
                        ],
                        borderColor: [
                            'rgb(2, 3, 3)',
                            'rgb(2, 3, 3)',
                            'rgb(2, 3, 3)',
                            'rgb(2, 3, 3)',
                            'rgb(2, 3, 3)',
                            'rgb(2, 3, 3)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            chartInstanceRef.current = newChart;
            
            return () => {
                newChart.destroy();
            };
        }
    },[])

    useEffect(() => {
        const chart = chartInstanceRef.current;
        if (chart) {
            chart.data.datasets[0].data = dataGraph;
            chart.update();
        }
    }, [dataGraph]);

    return (
        <>
            <div className="flex md:flex-row flex-col bg-[#86ACE2] md:h-[100vh] h-auto">
                <MyAppNav/>
                {/* add this to a file content */}
                <div className='md:w-[80%] text-white w-full md:mt-0 mt-10'>
                    {/* content here */}
                    <div className='flex flex-col w-full'>
                        <div className='w-full flex flex-row'>
                            <AdminHeader/>
                        </div>
                        <div className='w-full flex flex-col px-10'>
                            <div className='w-full flex md:flex-row flex-col items-center justify-between'>
                                <h2 className='text-2xl text-black opacity-[50%]'>
                                    Dashboard
                                </h2>
                                {/* data content */}
                                <div className="flex flex-row text-white p-2 rounded-lg gap-x-2 bg-[#001656] md:w-[30%] w-full md:mt-0 mt-4">
                                    <div className='flex flex-col w-[50%]'>
                                        <label htmlFor="barangay" className="block mb-2 text-sm font-medium">Barangay</label>
                                        <select name="barangay" value={brgy_id} id="barangay" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required onChange={(e:any)=>{getBEClist(e.target.value)}}>
                                            <option value="0">All</option>
                                            {barangayList.map((brgy: any)=>{
                                                return(<option value={brgy.id} key={brgy.id}>{brgy.barangay_name}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-[50%]'>
                                        <label htmlFor="bec_id" className="block mb-2 text-sm font-medium capitalize">BEC name</label>
                                        <select name="bec_id" id="bec_id" value={bec_id} className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required disabled={becList.length==0||brgy_id==0} onChange={(e:any)=>{setBEC_data_id(e)}}>
                                            {becList.length==0?<option value="" disabled selected>No BEC Name for this Barangay</option>:""}
                                            {becList.length!=0?<option value="0">All</option>:""}
                                            {becList.map((bec: any)=> {return (<option value={bec.id} key={bec.id}>{bec.bec_name}</option>)})}
                                        </select>
                                    </div>
                                </div>
                            </div> 
                            <div className='w-full mt-1 flex md:flex-row flex-col-reverse gap-3'>
                                <div className='flex flex-col md:w-[30%] gap-2 w-full md:p-0 pb-4'>
                                    <div className='w-full p-2 bg-[#001656] flex flex-row items-center rounded-lg gap-x-2'>
                                        <div className='w-[30%] h-[100%] bg-gray-500 rounded-sm flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "3.5em" }}>
                                                <FaPeopleGroup/>                        
                                            </IconContext.Provider>
                                        </div>
                                        <div className='w-[70%] flex flex-col'>
                                            <div className='text-2xl font-bold'>Population</div>
                                            <div className='text-2xl'>{isLoading?"Loading...":dataGraph[0]}</div>
                                        </div>
                                    </div>
                                    <div className='w-full p-2 bg-[#001656] flex flex-row items-center rounded-lg gap-x-2'>
                                        <div className='w-[30%] h-[100%] bg-gray-500 rounded-sm flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "3.5em" }}>
                                                <FaCross/>                           
                                            </IconContext.Provider>  
                                        </div>
                                        <div className='w-[70%] flex flex-col'>
                                            <div className='text-2xl font-bold'>Roman Catholic</div>
                                            <div className='text-2xl'>{isLoading?"Loading...":dataGraph[1]}</div>
                                        </div>
                                    </div>
                                    <div className='w-full p-2 bg-[#001656] flex flex-row items-center rounded-lg gap-x-2'>
                                        <div className='w-[30%] h-[100%] bg-gray-500 rounded-sm flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "3.5em" }}>
                                                <FaChild  />                           
                                            </IconContext.Provider>  
                                            
                                        </div>
                                        <div className='w-[70%] flex flex-col'>
                                            <div className='text-2xl font-bold'>Baptized</div>
                                            <div className='text-2xl'>{isLoading?"Loading...":dataGraph[2]}</div>
                                        </div>
                                    </div>
                                    <div className='w-full p-2 bg-[#001656] flex flex-row items-center rounded-lg gap-x-2'>
                                        <div className='w-[30%] h-[100%] bg-gray-500 rounded-sm flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "3.5em" }}>
                                                <FaCheckCircle />                           
                                            </IconContext.Provider>  
                                        </div>
                                        <div className='w-[70%] flex flex-col'>
                                            <div className='text-2xl font-bold'>Confirmation</div>
                                            <div className='text-2xl'>{isLoading?"Loading...":dataGraph[3]}</div>
                                        </div>
                                    </div>
                                    <div className='w-full p-2 bg-[#001656] flex flex-row items-center rounded-lg gap-x-2'>
                                        <div className='w-[30%] h-[100%] bg-gray-500 rounded-sm flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "3.5em" }}>
                                                <FaUserFriends />                           
                                            </IconContext.Provider>  
                                        </div>
                                        <div className='w-[70%] flex flex-col'>
                                            <div className='text-2xl font-bold'>Married</div>
                                            <div className='text-2xl'>{isLoading?"Loading...":dataGraph[4]}</div>
                                        </div>
                                    </div>
                                    <div className='w-full p-2 bg-[#001656] flex flex-row items-center rounded-lg gap-x-2'>
                                        <div className='w-[30%] h-[100%] bg-gray-500 rounded-sm flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "3.5em" }}>
                                                <MdBusiness/>                     
                                            </IconContext.Provider>  
                                        </div>
                                        <div className='w-[70%] flex flex-col'>
                                            <div className='text-2xl font-bold'>Lumon</div>
                                            <div className='text-2xl'>{isLoading?"Loading...":dataGraph[5]}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='md:w-[70%] bg-white p-5 rounded-lg'>
                                    <canvas ref={chartRef}></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

