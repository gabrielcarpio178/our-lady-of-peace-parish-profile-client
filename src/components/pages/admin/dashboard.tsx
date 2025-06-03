
import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import axios from 'axios'
import { userData, api_link } from '../../../api_link'
import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
export default function Dashboard(){
    const chartRef = useRef<HTMLCanvasElement | null>(null)
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);
    const [barangayList, setBarangayList] = useState([])
    const [becList, setBecList] = useState([]);
    const [bec_id, setBEC_id] = useState(0)
    const [brgy_id, setBrgy_id] = useState(0)
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
            }else{
                res.data = [{id: "0", bec_name: "All"}]
                setBEC_id(0)
                setBecList(res.data)
            }
        
        } catch (error) {
            console.log(error)
        }
    }

    const dashboardData = async ()=>{
        const token = userData().token
        try {
            const res = await axios.get(`${api_link()}/getRecords`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getBarangayList()
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Total Population', 'Roman Catholic', 'Baptized', 'Confirmation', 'Married'],
                    datasets: [{
                        label: 'Survey Data Summary',
                        data: [12, 19, 3, 5, 2],
                        backgroundColor: [
                            'rgb(67, 204, 99)',
                            'rgba(245, 250, 250)',
                            'rgba(237, 221, 128)',
                            'rgba(98, 169, 240)',
                            'rgba(230, 119, 242)'
                        ],
                        borderColor: [
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

            setChartInstance(newChart);
            
            return () => {
                newChart.destroy();
            };
        }
    },[])

    return (
        <>
            <div className="flex flex-row">
                <MyAppNav/>
                {/* add this to a file content */}
                <div className='w-[80%] h-screen bg-[#86ACE2] text-white'>
                    {/* content here */}
                    <div className='flex flex-col w-full h-full'>
                        <div className='w-full h-[12.7%] flex flex-row'>
                            <AdminHeader/>
                        </div>
                        <div className='w-full h-[87.3%] flex flex-col px-10'>
                            <div className='w-full flex flex-row justify-between'>
                                <h2 className='text-2xl text-black opacity-[50%]'>
                                    Dashboard
                                </h2>
                                {/* data content */}
                                {/* <div>{`${brgy_id} ${bec_id}`}</div> */}
                                <div className="flex flex-row text-white p-2 rounded-lg gap-x-2 bg-[#001656] w-[30%]">
                                    <div className='flex flex-col w-[50%]'>
                                        <label htmlFor="barangay" className="block mb-2 text-sm font-medium">Barangay</label>
                                        <select name="barangay" value={brgy_id} id="barangay" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required onChange={(e:any)=>{getBEClist(e.target.value)}}>
                                            <option value="0">All</option>
                                            {barangayList.map((brgy: any)=>{
                                                return(<option value={brgy.id} key={brgy.id}>{brgy.barangay_name}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-[50%]'>
                                        <label htmlFor="bec_id" className="block mb-2 text-sm font-medium capitalize">BEC name</label>
                                        <select name="bec_id" id="bec_id" value={bec_id} className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required disabled={becList.length==0||brgy_id==0} onChange={(e:any)=>{setBEC_id(e.target.value)}}>
                                            {becList.length==0?<option value="" disabled selected>No BEC Name for this Barangay</option>:""}
                                            {becList.length!=0?<option value="0">All</option>:""}
                                            {becList.map((bec: any)=> {return (<option value={bec.id} key={bec.id}>{bec.bec_name}</option>)})}
                                        </select>
                                    </div>
                                </div>
                            </div> 
                            <div className='w-full mt-3'>
                                <div className='w-full h-[60vh] bg-white p-5 rounded-lg'>
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

