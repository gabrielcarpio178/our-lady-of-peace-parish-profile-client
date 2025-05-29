import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'
import BarangayTable from './subpage/barangayTable'
import { useState , useEffect} from 'react'
import { IconContext } from 'react-icons'
import { FaPlus } from 'react-icons/fa'
import { MdOutlineCancel } from 'react-icons/md'
import { userData ,api_link } from '../../../api_link';
import axios from 'axios'
import Swal from 'sweetalert2'

export default function Baranagay(){
    const [isBarangayTableShow, setBarangayTable] = useState(false)
    const [barangayList, setBarangayList] = useState([])
    const [isShowAddFormBEC, setShowAddFormBEC] = useState(false)
    const [numberOfbrgy, setNumberOfbrgy] = useState(0)
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
    useEffect(()=>{
        getBarangayList()
    },[])
    

    return (
        <>
            <div className="flex flex-row">
                <MyAppNav/>
                {/*add subpage content */}
                {isShowAddFormBEC&&<AddBECForm barangayList={barangayList} onClick={()=>setShowAddFormBEC(!isShowAddFormBEC)}/>}
                {isBarangayTableShow&&<BarangayTable onClick={showBarangayTableFun}/>}
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
                                    <p>La Carlota consists of <span>{numberOfbrgy}</span> barangay: <span className='cursor-pointer text-blue-600 underline' onClick={showBarangayTableFun}>Show Barangay</span></p>
                                </div>
                                <div>
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
                                </div>
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
    onClick: ()=>void
}

const AddBECForm:React.FC<AddBECFormData> = (props)=>{
    const {barangayList, onClick} = props
    const addBEC = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
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
            window.location.reload()
        })
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
            <div className='absolute w-full h-full flex items-center justify-center text-white z-1'>
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