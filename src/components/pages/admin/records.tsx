
import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaClock } from "react-icons/fa";
import { IconContext } from 'react-icons';
import axios from 'axios';
import { userData, api_link } from '../../../api_link';
import DataTable from 'react-data-table-component';
import 'animate.css'
export default function Records(){
    const [datetime, setDatetime] = useState("Loading...")
    const [recordsData, setRecordsData] = useState([])
    const [allRecordsData, setAllRecordsData] = useState([])
    const [isDisplayLoading, setIsDisplayLoading] = useState(true)
    const getCurrentDatetime = () =>{
        const now = moment();
        const formattedDateTime = now.format('MMMM DD, YYYY h:mm:ss a');
        setDatetime(formattedDateTime);
    }

    const getRecordData = async ()=>{
        const token = userData().token
        setIsDisplayLoading(true)
            try {
                const res = await axios.get(`${api_link()}/getRecords`,{
                headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        "authorization" : `bearer ${token}`,
                    }
                })

                const filteredData = res.data.filter((data: any) => {
                    if (userData().user.rule === "admin") return true; 
                    return data.userAdd_id === userData().user.id; 
                });

                const datas = filteredData.map((data: any)=>{
                    return {
                        "DATE": moment(data.addDate).format("MMMM DD, YYYY"),
                        "USER": <div className='capitalize'>{`${data.firstname} ${data.lastname}`}</div>,
                        "ROLE": <div className='capitalize'>{data.rule}</div>,
                        "NO. OF SURVEY": data.total_encoded
                    }
                })
                setRecordsData(datas)
                setAllRecordsData(datas)
                setIsDisplayLoading(false)
            } catch (error) {
                console.log(error)
            }
        }

        const columns = [
            {name: "DATE", selector: ((row: any) => row["DATE"]), sortable: true},
            {name: "USER", selector: ((row: any) => row["USER"]), sortable: true},
            {name: "ROLE", selector: ((row: any) => row["ROLE"])},
            {name: "NO. OF SURVEY", selector: ((row: any) => row["NO. OF SURVEY"]), sortable: true},
        ]
        
        const handleSearch = (e: any) =>{
            const search = e.target.value;
            const result = allRecordsData.filter((data: any)=>{
                return data["USER"]["props"]["children"].toLocaleLowerCase().includes(search.toLocaleLowerCase())
            })
            setRecordsData(result)
        }

    useEffect(()=>{
        setInterval(function() {
            getCurrentDatetime()
        }, 1000);
        getRecordData()
    },[])
    return (
        <>
            <MyAppNav/>
            <div className='flex flex-col m-0 md:ml-[16%] text-white bg-[#86ACE2] py-1 h-screen'>
                {/* add this to a file content */}
                <div className='text-white w-full md:mt-0 mt-10 px-10'>
                    {/* content here */}
                    <div className='flex flex-col w-full'>
                        <div className='w-full flex flex-row'>
                            <AdminHeader/>
                        </div>
                        <div className='w-full flex flex-col px-10  animate__animated animate__fadeIn'>
                            <div className='w-full flex md:flex-row flex-col justify-between'>
                                <h2 className='text-2xl text-black opacity-[50%]'>
                                    Records
                                </h2>
                                <div className="flex flex-row items-center px-3 bg-[#001656] h-[15vh] gap-x-3 rounded-lg md:w-[30%] mt-3 md:mt-0">
                                    <div className='bg-gray-500 rounded-sm p-3'>
                                        <IconContext.Provider value={{ color: "white", size: "3em" }}>
                                            <FaClock/>
                                        </IconContext.Provider>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="text-2xl font-bold">DateTime</div>
                                        <div className="font-bold text-lg">{datetime}</div>
                                    </div>
                                </div>
                            </div>  
                            <div className='mt-10'>
                                <div className='flex flex-row justify-end items-center gap-x-2 bg-white p-3'>
                                    <label htmlFor="search" className="block mb-2 text-sm font-medium text-black">Search User: </label>
                                    <input name="search" type="text" id="search" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white focus:border-blue-500 w-1/4" placeholder="Search Name" required onChange={handleSearch}/>
                                </div>
                                {!isDisplayLoading?<div className='w-full bg-white'>Loading..</div>:""}
                                {!isDisplayLoading&&
                                    <DataTable columns={columns} data={recordsData} pagination paginationPerPage={5} responsive paginationRowsPerPageOptions={[1,2,3,4,5]}></DataTable>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}