import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import BarangayTable from './subpage/barangayTable'
import React, { useState , useEffect} from 'react'
import { IconContext } from 'react-icons'
import { FaPlus } from 'react-icons/fa'
import { MdOutlineCancel } from 'react-icons/md'
import { userData ,api_link } from '../../../api_link';
import axios from 'axios'
import Swal from 'sweetalert2'
import { BounceLoader } from 'react-spinners'
import DataTable from 'react-data-table-component'
import { HiOutlineViewList } from "react-icons/hi";



export default function Baranagay(){
    const [isBarangayTableShow, setBarangayTable] = useState(false)
    const [barangayList, setBarangayList] = useState([])
    const [isShowAddFormBEC, setShowAddFormBEC] = useState(false)
    const [numberOfbrgy, setNumberOfbrgy] = useState(0)
    const [isLoading, setLoading] = useState(false)
    const [data, setDataHouseHold] = useState([])
    const [allData, setAllData] = useState([])
    const [isViewBEC, setViewBEC] = useState(false)
    const [viewBECData, setViewBECData] = useState({
        id: 0,
        barangay_name: "",
        bec_name: "",
        population: 0,
        bec_count: 0,
        percentage: "",
        total_baptism: 0,
        total_household: 0,
        total_catholic_residence: 0,
        total_isNotBaptismConfirmation: 0,
        total_marrige: 0,
        total_high_school: 0,
        total_college: 0,
        total_upper_class: 0,
        total_middle_class: 0,
        total_poor_class: 0,
        very_poor_class: 0,
        total_catholic: 0,
        total_professional: 0,
        total_veryPoor_class: 0
    })
    const showBarangayTableFun = ()=>{
        setBarangayTable(!isBarangayTableShow)
    }

    function capitalizeFirstLetter(item: string) {
        return item.charAt(0).toUpperCase() + item.slice(1);
    }

    const getBarangayList = async ()=>{
        const token = userData().token
        try {
            const res = await axios.get(`${api_link()}/getBarangay`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const data  = res.data.map((result: any)=>{
                return {
                    name: capitalizeFirstLetter(result.barangay_name),
                    id: result.id
                }
            })
            setNumberOfbrgy(data.length)
            setBarangayList(data);
        } catch (error) {
            console.log(error)
        }
    }

    const getPercentage = (bec_num: number, population: number)=>{
        if(population!=0){
            if(bec_num!=0){
                return `${((bec_num/population)*100).toFixed(2)}%`;
            }
            return `${0}%`
        } else{
            return `${0}%`
        }
        
    }

    const getHousehold = async ()=>{
        const token = userData().token
        try {
            const res = await axios.get(`${api_link()}/getHousehold`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const datas = res.data.map((data: any)=>{
                data.percentage = getPercentage(data.total_household, parseInt(data.population));
                return {
                    "": <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-blue-800" onClick={()=>edit(data)}><HiOutlineViewList/></button>,
                    "BARANGAY NAME": <div className='capitalize'>{data.barangay_name}</div>,
                    "BEC": <div className='capitalize'>{data.bec_name}</div>,
                    "POPULATION": data.population,
                    "HOUSEHOLD": data.total_household,
                    "CATHOLIC RESIDINCES": data.total_catholic_residence,
                    "ENCODED": data.bec_count,
                    "PERCENTAGE": data.percentage,
                    "CATHOLIC": data.total_catholic,
                    "NOT BAPTIZED": data.total_baptism,
                    "NOT CONFIRMED": data.total_isNotBaptismConfirmation,
                    "NOT MARRIED": data.total_marrige,
                    "NOT HIGH SCHOOL": data.total_high_school,
                    "NOT COLLEGE": data.total_college,
                    "UPPER CLASS": data.total_upper_class,
                    "MIDDLE CLASS": data.total_middle_class,
                    "POOR CLASS": data.total_poor_class,
                    "VERY POOR CLASS": data.total_veryPoor_class
                }
            })
            setDataHouseHold(datas);
            setAllData(datas)
        } catch (error) {
            console.log(error)
        }
    }

    const colums = [
        {name: "VIEW", selector: (row: any)=>row[""], sortable: true},
        {name: "BARANGAY NAME", selector: (row: any) => row["BARANGAY NAME"], sortable: true},
        {name: "BEC", selector: (row: any) => row["BEC"], sortable: true},
        {name: "POPULATION", selector: (row: any) => row["POPULATION"], sortable: true},
        {name: "HOUSEHOLD", selector: (row: any) => row["HOUSEHOLD"], sortable: true},
        {name: "CATHOLIC RESIDINCES", selector: (row: any) => row["CATHOLIC RESIDINCES"], sortable: true},
        {name: "ENCODED", selector: (row: any) => row["ENCODED"], sortable: true},
        {name: "PERCENTAGE", selector: (row: any) => row["PERCENTAGE"], sortable: true},
        {name: "CATHOLIC", selector: (row: any) => row["CATHOLIC"], sortable: true},
        {name: "NOT BAPTIZED", selector: (row: any) => row["NOT BAPTIZED"], sortable: true},
        {name: "NOT CONFIRMED", selector: (row: any) => row["NOT CONFIRMED"], sortable: true},
        {name: "NOT MARRIED", selector: (row: any) => row["NOT MARRIED"]},
        {name: "NOT HIGH SCHOOL", selector: (row: any) => row["NOT HIGH SCHOOL"]},
        {name: "NOT COLLEGE", selector: (row: any) => row["NOT COLLEGE"]},
        {name: "UPPER CLASS", selector: (row: any) => row["UPPER CLASS"]},
        {name: "MIDDLE CLASS", selector: (row: any) => row["MIDDLE CLASS"]},
        {name: "POOR CLASS", selector: (row: any) => row["POOR CLASS"]},
        {name: "VERY POOR CLASS", selector: (row: any) => row["VERY POOR CLASS"]},
    ]
    

    useEffect(()=>{
        getBarangayList()
        getHousehold();
    },[])

    const edit = (data: {  id: number,
        barangay_name: string,
        bec_name: string,
        population: number,
        bec_count: number,
        percentage: string,
        total_household: number,
        total_catholic_residence: number,
        total_baptism: number,
        total_isNotBaptismConfirmation: number,
        total_marrige: number,
        total_high_school: number,
        total_college: number,
        total_upper_class: number,
        total_middle_class: number,
        total_poor_class: number,
        very_poor_class: number,
        total_catholic: number,
        total_professional: number,
        total_veryPoor_class: number
    }):void=>{
        setViewBEC(!isViewBEC)
        setViewBECData(data)
    }

    
    const handleSearch = (e: any)=>{
        let query = e.target.value;
        const searchRes = allData.filter((item: any)=>item["BARANGAY NAME"]["props"]["children"].toLocaleLowerCase().includes(query.toLocaleLowerCase())||item["BEC"]["props"]["children"].toLocaleLowerCase().includes(query.toLocaleLowerCase()))
        setDataHouseHold(searchRes)
    }

    return (
        <>
            
            <div className="flex flex-row">
                <MyAppNav/>
                {isLoading&&
                <div className='absolute bg-black/50 z-40 w-full h-full'>
                    <div  className='flex items-center justify-center w-full h-full'>
                        <BounceLoader color='#ffffff' size={120}/>
                    </div>
                </div>    
                } 
                {/*add subpage content */}
                {isShowAddFormBEC&&<AddBECForm barangayList={barangayList} onClick={()=>setShowAddFormBEC(!isShowAddFormBEC)} setLoading={()=>setLoading(!isLoading)}/>}
                {isBarangayTableShow&&<BarangayTable onClick={showBarangayTableFun} setLoading={()=>setLoading(!isLoading)}/>}
                {isViewBEC&&<ViewBECData data={viewBECData} onClose={()=>setViewBEC(!isViewBEC)} setLoading={()=>setLoading(!isLoading)}/>}
                
                {/* add this to a file content */}
                <div className='w-[80%] h-screen bg-[#86ACE2] text-white'>
                    {/* content here */}
                    <div className='flex flex-col w-full h-full'>
                        <div className='w-full h-[12.7%] flex flex-row'>
                            <AdminHeader/>
                        </div>
                        <div className='w-full h-[87.3%] flex flex-col p-10'>
                            <div className='flex flex-row w-full items-center justify-between'>
                                <div className=''>
                                    <h2 className='text-2xl text-black opacity-[50%]'>
                                        List of Barangay
                                    </h2>
                                    <p>La Carlota consists of <span>{numberOfbrgy}</span> barangay 
                                    {userData().user.rule==="admin"&&<span className='cursor-pointer text-blue-600 underline' onClick={showBarangayTableFun}>Show Barangay</span>}
                                    </p>
                                </div>
                                <div>
                                    {userData().user.rule==="admin"&&
                                        <button onClick={()=>setShowAddFormBEC(!isShowAddFormBEC)} type="button" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 flex gap-x-2">
                                        <span>
                                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                                <div>
                                                    <FaPlus />
                                                </div>
                                            </IconContext.Provider>   
                                        </span>
                                            Add BEC
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className='mt-10'>
                                <div className='flex flex-row justify-end items-center gap-x-2 bg-white p-3'>
                                    <label htmlFor="search" className="block mb-2 text-sm font-medium text-black">Search by Barangay or BEC:</label>
                                    <input name="search" type="text" id="search" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500 w-1/4" placeholder="Search Name" required onChange={handleSearch}/>
                                </div>
                                <DataTable columns={colums} data={data} pagination paginationPerPage={5} responsive paginationRowsPerPageOptions={[1,2,3,4,5]}></DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

interface barangay{
    name: "string",
    id: number
}

interface AddBECFormData {
    barangayList: barangay[],
    onClick: ()=>void,
    setLoading: ()=>void
}

const AddBECForm:React.FC<AddBECFormData> = (props)=>{
    const {barangayList, onClick, setLoading} = props
    const addBEC = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setLoading();
        const formData = new FormData(e.currentTarget)
        const formValues = Object.fromEntries(formData)

        const token = userData().token
        try {
            await axios.post(`${api_link()}/addbec`,formValues, 
            {
                headers:{
                'Content-type':'application/x-www-form-urlencoded',
                "authorization" : `bearer ${token}`,
            }
            })
        Swal.fire({
            position: "center",
            title: `Add Success`,
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
        }).then(()=>{
            setLoading();
            window.location.reload()
        })
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
            <div className='absolute w-full h-full flex items-center justify-center text-white z-2 bg-black/50'>
                <div className="w-full max-w-2xl bg-[#86ACE2] border border-black shadow-lg rounded">
                    <div className='relative'>
                        <div className='flex flex-row p-3 gap-x-3'> 
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <FaPlus />
                                </div>
                            </IconContext.Provider>   
                            <div className='text-xl'>
                                Add BEC
                            </div>
                        </div>
                        <div className='absolute right-2 top-2 cursor-pointer' onClick={onClick}>
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <MdOutlineCancel/>
                                </div>
                            </IconContext.Provider> 
                            
                        </div>
                    </div>
                    
                    <form className="px-8 pt-6 pb-8 mb-4" onSubmit={addBEC}>
                        <div className="mb-4 flex flex-col">
                            <div className='flex flex-col w-full mt-2.5 bg-white p-5 rounded-sm'>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="barangay_id" className="block mb-2 text-sm font-medium text-black">Barangay Name</label>
                                    <select name="barangay_id" id="barangay_id" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" required>
                                        {barangayList.map((brgy: any)=>{
                                            return (<option value={brgy.id} key={brgy.id}>{brgy.name}</option>)
                                        })}
                                    </select>
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="bec_name" className="block mb-2 text-sm font-medium text-black">BEC Name</label>
                                    <input name="bec_name" type="text" id="bec_name" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" placeholder="BEC Name" required />
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="population" className="block mb-2 text-sm font-medium text-black">Population</label>
                                    <input name="population" type="number" id="population" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" placeholder="Population" required />
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="catholic" className="block mb-2 text-sm font-medium text-black">Number of Catholic</label>
                                    <input name="catholic" type="number" id="catholic" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" placeholder="Number of Catholic" required />
                                </div>
                                <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full mt-4">{"Submit"}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

interface ViewData{
    data: {
        id: number,
        barangay_name: string,
        bec_name: string,
        population: number,
        bec_count: number,
        percentage: string,
        total_household: number,
        total_catholic_residence: number,
        total_baptism: number,
        total_isNotBaptismConfirmation: number,
        total_marrige: number,
        total_high_school: number,
        total_college: number,
        total_upper_class: number,
        total_middle_class: number,
        total_poor_class: number,
        very_poor_class: number,
        total_catholic: number,
        total_professional: number,
        total_veryPoor_class: number
    },
    onClose: () => void,
    setLoading: () => void
}

const ViewBECData:React.FC<ViewData> = (props)=>{
    const {data, onClose, setLoading} = props;
    const [isEditBECForm, setEditBECForm] = useState(false);
    const [dataEdit, setDataEdit] = useState({
        bec_id: 0,
        population: 0,
        no_catholic: 0,
        bec_name: "",
        barangay_name: "",
    })
    const getData = (getData: {bec_id: number, population: number, no_catholic: number, bec_name: string, barangay_name: string})=>{
        setEditBECForm(!isEditBECForm)
        setDataEdit(getData)
    }
    console.log(data)
    return (
        <>
            <div className='absolute w-full h-full flex items-center justify-center text-white z-2 bg-black/50'>
            {isEditBECForm&&<EditBECFormData onClose={()=>setEditBECForm(!isEditBECForm)} data={dataEdit} setLoading={()=>setLoading}/>}
                <div className="w-full max-w-2xl bg-[#86ACE2] border border-black shadow-lg rounded">
                    <div className='relative'>
                        <div className='flex flex-row p-3 gap-x-3'> 
                            <div className='flex flex-col'>
                                <div className='capitalize text-2xl font-bold'>{data.barangay_name}</div>
                                <div className='capitalize text-lg'>{data.bec_name}</div>
                            </div>
                        </div>
                        <div className='absolute right-2 top-2 cursor-pointer' onClick={onClose}>
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <MdOutlineCancel/>
                                </div>
                            </IconContext.Provider> 
                        </div>
                    </div>
                    <div className='p-3 text-black'>
                        <div className='w-full bg-white p-2 grid grid-cols-2 gap-3 rounded-lg'> 
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Population</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.population}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Percentage</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.percentage}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Encoded</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.bec_count}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Catholic</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_catholic}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Household</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_household}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Catholic Residince</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_catholic_residence}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Not Babtism</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_baptism}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Not Confirm</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_isNotBaptismConfirmation}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Not Married</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_marrige}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Professionals</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_professional}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Not High School</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_high_school}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Not College</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_college}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Upper class</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_upper_class}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Middle class</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_middle_class}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Poor class</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_poor_class}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='font-bold'>Very poor class</h2>
                                <div className='w-full rounded-sm bg-[#86ACE2] px-2'>
                                    {data.total_veryPoor_class}
                                </div>
                            </div>
                        </div>
                        {userData().user.rule==="admin"&&
                            <button className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full mt-4" onClick={()=>getData({bec_id: data.id, population: data.population, no_catholic: data.total_catholic, bec_name:data.bec_name, barangay_name: data.barangay_name})}>Edit</button>
                        }
                    </div>
                </div>    
            </div>        
        </>
    )
}

interface Data{
    onClose: ()=>void,
    data: {
        bec_name: string,
        bec_id: number,
        population: number,
        no_catholic: number,
        barangay_name: string,
    },
    setLoading: () => void
}

const EditBECFormData: React.FC<Data> = (props) => {
    const {data, onClose, setLoading} = props
    const [bec_name, setBecName] = useState(data.bec_name) 
    const [population, setPopulation] = useState(data.population) 
    const [no_catholic, setNo_catholic] = useState(data.no_catholic)
    const editData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        var formValues = Object.fromEntries(formData)
        formValues.bec_id = data.bec_id.toString()
        const token = userData().token
        setLoading()
        try {
            await axios.put(`${api_link()}/editBec`,
                formValues,
                {
                    headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        "authorization" : `bearer ${token}`,
                    }
                }
            );
            Swal.fire({
                position: "center",
                title: `Edit Success`,
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
            }).then(()=>{
                setLoading()
                window.location.reload()
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className='absolute w-full h-full flex items-center justify-center text-white z-2 bg-black/50'>
            
                <div className="w-full max-w-2xl bg-[#86ACE2] border border-black shadow-lg rounded">
                    <div className='relative'>
                        <div className='flex flex-row p-3 gap-x-3'> 
                            <div className='text-xl'>
                                Edit BEC
                            </div>
                        </div>
                        <div className='absolute right-2 top-2 cursor-pointer' onClick={onClose}>
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <MdOutlineCancel/>
                                </div>
                            </IconContext.Provider> 
                            
                        </div>
                    </div>
                    
                    <form className="px-8 pt-6 pb-8 mb-4" onSubmit={editData}>
                        <div className="mb-4 flex flex-col">
                            <div className='flex flex-col w-full mt-2.5 bg-white p-5 rounded-sm'>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="barangay_id" className="block mb-2 text-sm font-medium text-black">Barangay Name</label>
                                    <select name="barangay_id" id="barangay_id" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-500 border-gray-500 placeholder-gray-500 text-black focus:border-blue-500" required disabled>
                                        <option>{data.barangay_name}</option>
                                    </select>
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="bec_name" className="block mb-2 text-sm font-medium text-black">BEC Name</label>
                                    <input name="bec_name" type="text" id="bec_name" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" placeholder="BEC Name" required value={bec_name} onChange={(e)=>setBecName(e.target.value)} />
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="population" className="block mb-2 text-sm font-medium text-black">Population</label>
                                    <input name="population" type="number" id="population" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" placeholder="Population" required value={population} onChange={(e)=>setPopulation(parseInt(e.target.value))}/>
                                </div>

                                <div className='flex flex-col w-full'>
                                    <label htmlFor="catholic" className="block mb-2 text-sm font-medium text-black">Number of Catholic</label>
                                    <input name="catholic" type="number" id="catholic" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" placeholder="Number of Catholic" required value={no_catholic} onChange={(e)=>setNo_catholic(parseInt(e.target.value))}/>
                                </div>
    
                                <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full mt-4">{"Submit"}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}