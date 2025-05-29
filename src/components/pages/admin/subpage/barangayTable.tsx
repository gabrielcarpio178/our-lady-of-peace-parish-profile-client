import DataTable from 'react-data-table-component';
import { IconContext } from 'react-icons';
import { FaEdit, FaTable, FaPlus } from 'react-icons/fa';
import { MdOutlineCancel, MdDelete  } from 'react-icons/md';
import { userData ,api_link } from '../../../../api_link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';



interface IProps {
    onClick: () => void;
}

const BarangayTable:React.FC<IProps> = (props)=> {
    const [barangayList, setBarangayList] = useState([]);
    const [allData, setAllData] = useState([])
    const [editName, setNAme]  = useState({barangay_name: "", id:0});
    const [isShowformEdit, setShowformEdit]  = useState(false);
    const [isShowformAdd, setShowformAdd] = useState(false)
    const [isLoadingTable, setLoadingTable] = useState(false)
    function capitalizeFirstLetter(item: string) {
        return item.charAt(0).toUpperCase() + item.slice(1);
    }
    const getBarangayList = async ()=>{
        const token = userData().token
        setLoadingTable(!isLoadingTable);
        try {
            const res = await axios.get(`${api_link()}/getBarangay`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const data  = res.data.map((result: any)=>{
                return {
                    NAME: capitalizeFirstLetter(result.barangay_name),
                    ACTION:
                    <div>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-blue-800 cursor-pointer" onClick={()=>editBarangay(result)}><FaEdit/></button>
                        <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-red-800 cursor-pointer" onClick={()=>deleteBarangay(result.id)}><MdDelete/></button>
                    </div> 
                    
                }
            })
            setAllData(data)
            setBarangayList(data)
            setLoadingTable(!isLoadingTable);   
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBarangay = async (id: number)=>{
        Swal.fire({
            title: "Are you sure?",
            text: "All data belonging to this barangay will be deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => { 
            if (result.isConfirmed) {
                const token = userData().token
                try {
                    await axios.delete(`${api_link()}/deleteBarangay`,{
                        headers:{
                                'Content-type':'application/x-www-form-urlencoded',
                                "authorization" : `bearer ${token}`,
                            },
                            data: {
                                id: id
                            }
                    })
                Swal.fire({
                    position: "center",
                    title: `Delete Success`,
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
        });
        
    }
    useEffect(()=>{
        getBarangayList()
    },[])

    const columns = [
        {
            name: "NAME",
            selector: (row: any) => row.NAME
        },
        { 
            name: "ACTION", 
            selector: (row: any)=> row.ACTION
        }
    ]

    const editBarangay = (props: {barangay_name: string, id: number}):void=>{
        setNAme(props)
        setShowformEdit(!isShowformEdit)
    }
    const handleSearch = (e: any)=>{
        let query = e.target.value;
        const searchRes = allData.filter((item: any)=>item.NAME.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
        setBarangayList(searchRes)
    }

    return (
        <>
            <div className='absolute w-full h-full flex items-center justify-center text-white z-1'>
                <div className="w-full max-w-lg bg-[#86ACE2] border border-black shadow-lg rounded">
                    <div className='relative'>
                        {isShowformEdit&&<FormEdit dataObj={editName} onClick={()=>setShowformEdit(!isShowformEdit)}/>}
                        {isShowformAdd&&<AddForm onClick={()=>setShowformAdd(!isShowformAdd)} />}
                        <div className='flex flex-row p-3 gap-x-3'>
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <FaTable/>
                                </div>
                            </IconContext.Provider>   
                            <div className='text-xl'>
                                Barangay Name List:
                            </div>
                        </div>
                        <div className='absolute right-2 top-2 cursor-pointer' onClick={props.onClick}>
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <MdOutlineCancel/>
                                </div>
                            </IconContext.Provider> 
                        </div>
                    </div>
                    <div className='p-10'>
                        <div className='flex flex-row justify-between items-center bg-white p-3 gap-x-2'>
                            <button type="button" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-1/4 flex gap-x-2" onClick={()=>setShowformAdd(!isShowformAdd)}>
                            <span>
                                <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                    <div>
                                        <FaPlus />
                                    </div>
                                </IconContext.Provider>   
                            </span>
                                Add
                            </button>
                            <div className='flex flex-col'>
                                <label htmlFor="search" className="block mb-2 text-sm font-medium text-black">Search Name:</label>
                                <input name="search" type="text" id="search" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500 w-full" placeholder="Search Name" onChange={handleSearch} required/>
                            </div>
                            
                        </div>
                        {isLoadingTable?<DataTable columns={columns} data={barangayList} pagination paginationPerPage={5} responsive paginationRowsPerPageOptions={[1,2,3,4,5]}></DataTable>:"Loading.."}
                        
                    </div>
                    
                </div>
            </div>
        </>
    )
}

interface IAddForm {
    onClick: ()=> void
}

const AddForm: React.FC<IAddForm> = (props)=>{
    const [isLoading, setLoading] = useState(false)
    const addSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formValue = Object.fromEntries(formData)
        setLoading(true)
        const token = userData().token
        try {
            await axios.post(`${api_link()}/addBarangay`, formValue, 
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
            setLoading(false)
            window.location.reload()
        })
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
            <div className='w-full h-fit absolute z-1 top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
                <div className='flex items-center justify-center'>
                    <form className="px-8 pt-6 pb-8 mb-4 bg-[#86ACE2] border border-black shadow-lg rounded relative" onSubmit={addSubmit}>
                        <div className='absolute right-2 top-2 cursor-pointer' onClick={props.onClick}>
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <MdOutlineCancel/>
                                </div>
                            </IconContext.Provider> 
                        </div>
                        <div>
                            Add Barangay
                        </div>
                        <div className="mb-4 flex flex-col mt-5 bg-white p-5 rounded-sm">
                            <div className='flex flex-col w-full'>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Name</label>
                                <input name="barangay" type="text" id="name" className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500" placeholder="Name" required />
                            </div>
                            <div className='flex flex-col w-full mt-2.5'>

                                <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full">{isLoading?"Loading...":"Submit"}</button>

                            </div>
                        </div>
                    </form>
                </div>    
            </div>
        </>
    )
}

interface IForm{
    dataObj: {
        barangay_name: string,
        id: number
    },
    onClick: () => void
}

const FormEdit: React.FC<IForm> = (props) => {
    const {barangay_name, id} = props.dataObj
    const [name, setName] = useState(barangay_name)
    const [isLoading, setLoading] = useState(false)
    const editSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setLoading(true);
        const formData = new FormData(e.currentTarget)
        const formValue = {
            barangay_name : formData.get("name"),
            id: id
        }
        const token = userData().token;
        try {
            await axios.put(`${api_link()}/editBarangay`,
                formValue,
                {
                    headers:{
                        'Content-type':'application/x-www-form-urlencoded',
                        "authorization" : `bearer ${token}`,
                    }
                })
            Swal.fire({
                position: "center",
                title: `Edit Success`,
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
            }).then(()=>{
                setLoading(false)
                window.location.reload()
            })
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
            <div className='w-full h-fit absolute z-1 top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
                <div className='flex items-center justify-center'>
                    <form className="px-8 pt-6 pb-8 mb-4 bg-[#86ACE2] border border-black shadow-lg rounded relative" onSubmit={editSubmit}>
                        <div className='absolute right-2 top-2 cursor-pointer' onClick={props.onClick}>
                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                <div>
                                    <MdOutlineCancel/>
                                </div>
                            </IconContext.Provider> 
                        </div>
                        <div>
                            Edit Barangay Name
                        </div>
                        <div className="mb-4 flex flex-col mt-5 bg-white p-5">
                            <div className='flex flex-col w-full'>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">Name</label>
                                <input name="name" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-gray-400 focus:border-blue-500 text-black" placeholder="Name" required />
                            </div>
                            <div className='flex flex-col w-full mt-2.5'>

                                <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full">{isLoading?"Loading...":"Submit"}</button>

                            </div>
                        </div>
                    </form>
                </div>    
            </div>
        </>
    )
}

export default BarangayTable