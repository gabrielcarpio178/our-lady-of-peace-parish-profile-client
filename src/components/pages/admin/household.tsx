import AdminHeader from "./adminHeader";
import MyAppNav from "./adminNav";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";
import { FaCross, FaEdit, FaFileExport } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IconContext } from "react-icons";
import { useEffect, useState } from "react";
import { api_link, userData } from "../../../api_link";
import axios from "axios";
import { MdOutlineCancel, MdDelete  } from "react-icons/md";
import DataTable from "react-data-table-component";
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { BounceLoader } from "react-spinners";

interface dataToHouseholdProps {}
interface sendData {
    barangay: string;
    bec: string;
    barangay_name: string;
    bec_name: string
}

const Household:React.FC<dataToHouseholdProps> = ()=>{
    const [numberData, setnumberData] = useState({
        total_catholic : "0",  total_encoded : "0", total_encoded_catholic : "0" , total_household : "0", total_population : "0"
    })
    const [tableSettingData, settableSettingData] = useState( {barangay: "0", bec: "0", barangay_name: "All Barangay", bec_name: "All BEC"} )
    const [isTableSettingShow, setTableSettiingShow] = useState(false)
    const [dataTable, setDataTable] = useState([])
    const [allData, setAllData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const getNumberData = async () =>{
        const token = userData().token
        try {
            const res = await axios.get(`${api_link()}/getHouseHoldData`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            setnumberData(res.data[0])
        } catch (error) {
            console.log(error)
        }
    }
    const deleteHouseHold = async (id: any) =>{
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = userData().token
                setLoading(true)
                try {
                    await axios.delete(`${api_link()}/deleteHousehold`,{
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
                        setLoading(false)
                        window.location.reload()
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    const editHousehold = async (id: any)=>{
        window.location.href = `/survey_form/${id}`
    }

    const getDataTable = async () =>{
        const token = userData().token
        try {
            const res = await axios.get(`${api_link()}/getHouseHoldDataTable`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            
            const datas = res.data.map((data:any)=>{
                return (
                    {
                        "Action": <div>
                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-blue-800" onClick={()=>editHousehold(data.id)}><FaEdit/></button>
                                    <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-red-800" onClick={()=>deleteHouseHold(data.id)}><MdDelete/></button>
                                </div>,
                        "BARANGAY_ID": data.barangay_id,
                        "BEC_ID": data.bec_id,
                        "FAMILY NAME": data.family_name,
                        "WIFE NAME": data.wife_name,
                        "HUSBAND NAME": data.husband_name,
                        "OCCUPATION WIFE": data.occupation_wife,
                        "OCCUPATION HUSBAND": data.occupation_husband,
                        "BARANGAY NAME": data.barangay_name,
                        "BEC NAME": data.bec_name,
                        "HOUSEHOLDS": data.household,
                        "CATHOLIC": data.no_catholic_residence,
                        "ATTENDANTS": data.mass_attendants,
                        "BAPTISM": data.baptism,
                        "CONFIRMATION": data.isNotBaptismConfirmation,
                        "MARRIED": data.marrige,
                        "PROFESSIONAL": data.no_professional,
                        "HIGH SCHOOL": data.no_high_school,
                        "COLLECE": data.no_college,
                        "LIVING CONDITION": data.living_condition
                    }
                )
            })
            setDataTable(datas)
            setAllData(datas)
        } catch (error) {
            console.log(error)
        }
    }
    const tableData = (bec_id: any, barangay_id: any) => {
        barangay_id = barangay_id=="all"?0:parseInt(barangay_id)
        bec_id = bec_id=="all"?0:parseInt(bec_id)
        if(barangay_id!=0||bec_id!=0){
            let searchRes = allData;
            if(barangay_id!=0){
                searchRes = allData.filter((data: any)=>{
                    return (data["BARANGAY_ID"]===barangay_id)
                })
            }
            if(bec_id!=0){
                searchRes = allData.filter((data: any)=>{
                    return (data["BEC_ID"]===bec_id)
                })
            }
            if(bec_id!=0&&barangay_id!=0){
                searchRes = allData.filter((data: any)=>{
                    return (data["BEC_ID"]===bec_id&&data["BARANGAY_ID"]===barangay_id)
                })
            }
            setDataTable(searchRes);
        }
    }
    const handleDataFromChild = (data: sendData): void => {
        setTableSettiingShow(!isTableSettingShow)
        settableSettingData(data)
        tableData(data.bec, data.barangay)
    };
    useEffect(()=>{
        getNumberData()
        getDataTable()
        tableData(0, 0)
    },[])
    const columns = [
        {name: "Action", selector: ((row: any) => row["Action"]), grow: 2},
        {name: "FAMILY NAME", selector: ((row: any) => row["FAMILY NAME"]), sortable: true},
        {name: "WIFE NAME", selector: ((row: any) => row["WIFE NAME"]), sortable: true},
        {name: "HUSBAND NAME", selector: ((row: any) => row["HUSBAND NAME"]), sortable: true},
        {name: "OCCUPATION WIFE", selector: ((row: any) => row["OCCUPATION WIFE"]), sortable: true},
        {name: "OCCUPATION HUSBAND", selector: ((row: any) => row["OCCUPATION HUSBAND"]), sortable: true},
        {name: "BARANGAY NAME", selector: ((row: any) => row["BARANGAY NAME"]), sortable: true},
        {name: "BEC NAME", selector: ((row: any) => row["BEC NAME"]), sortable: true},
        {name: "HOUSEHOLDS", selector: ((row: any) => row["HOUSEHOLDS"]), sortable: true},
        {name: "CATHOLIC", selector: ((row: any) => row["CATHOLIC"]), sortable: true},
        {name: "ATTENDANTS", selector: ((row: any) => row["ATTENDANTS"]), sortable: true},
        {name: "BAPTISM", selector: ((row: any) => row["BAPTISM"]), sortable: true},
        {name: "CONFIRMATION", selector: ((row: any) => row["CONFIRMATION"]), sortable: true},
        {name: "MARRIED", selector: ((row: any) => row["MARRIED"]), sortable: true},
        {name: "PROFESSIONAL", selector: ((row: any) => row["PROFESSIONAL"]), sortable: true},
        {name: "HIGH SCHOOL", selector: ((row: any) => row["HIGH SCHOOL"]), sortable: true},
        {name: "COLLECE", selector: ((row: any) => row["COLLECE"]), sortable: true},
        {name: "LIVING CONDITION", selector: ((row: any) => row["LIVING CONDITION"])},
        
    ]
    const handleSearch = (e: any)=>{
        let query = e.target.value;
        const searchRes = allData.filter((data: any)=>{
            return (data["BEC NAME"].toLocaleLowerCase().includes(query.toLocaleLowerCase())||data["BARANGAY NAME"].toLocaleLowerCase().includes(query.toLocaleLowerCase())||data["FAMILY NAME"].toLocaleLowerCase().includes(query.toLocaleLowerCase())||data["WIFE NAME"].toLocaleLowerCase().includes(query.toLocaleLowerCase())||data["HUSBAND NAME"].toLocaleLowerCase().includes(query.toLocaleLowerCase()))
        })
        setDataTable(searchRes);
    }
    const exportExcel = () =>{
        const dataExport = dataTable.map((data: any)=>{
            delete data["BARANGAY_ID"];
            delete data["BEC_ID"];
            delete data["Action"]
            return data;
        })
        const worksheet = XLSX.utils.json_to_sheet(dataExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "household.xlsx");
    }
    return(
        <>
        <div className="flex md:flex-row flex-col">
            {isLoading&&
            <div className='absolute bg-black/50 z-40 w-full h-full'>
                <div  className='flex items-center justify-center w-full h-full'>
                    <BounceLoader color='#ffffff' size={120}/>
                </div>
            </div>    
            } 
            <MyAppNav/>
            {/* add this to a file content */}
            {isTableSettingShow&&<TableSettings onClose={()=>setTableSettiingShow(!isTableSettingShow)} sendDataToHousehold={handleDataFromChild}/>}
            <div className='md:w-[80%] md:h-screen bg-[#86ACE2] text-white w-full md:mt-0 mt-10'>
                {/* content here */}
                <div className='flex flex-col w-full h-full'>
                    <div className='w-full h-[12.7%] flex flex-row'>
                        <AdminHeader/>
                    </div>
                    <div className='w-full h-[87.3%] flex flex-col p-4'>
                        <div className='w-full'>
                            <div className='flex flex-row justify-between'>
                                <h2 className='text-2xl text-black opacity-[50%]'>
                                    Households - <span>{tableSettingData==null?"All Barangay":tableSettingData.barangay_name+" - "+`${tableSettingData.bec_name==""||tableSettingData.bec_name==""?"All BEC":tableSettingData.bec_name}`}</span>
                                </h2>
                                <div className="flex flex-row border border-black rounded-sm">
                                    <div className="flex flex-row bg-[#001656] items-center px-2 gap-x-1 cursor-pointer" onClick={()=>setTableSettiingShow(!isTableSettingShow)}>
                                        <div>
                                            <IconContext.Provider value={{ color: "white", size: "1em" }}>
                                                <IoMdSettings/>
                                            </IconContext.Provider>
                                        </div>
                                        <div>
                                            Table Settings
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center px-2 gap-x-1 cursor-pointer" onClick={exportExcel}>
                                        <div>
                                            <IconContext.Provider value={{ color: "white", size: "1em" }}>
                                                <FaFileExport/>
                                            </IconContext.Provider>
                                        </div>
                                        <div>
                                            Export
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse md:flex-col">
                            <div className="grid md:grid-cols-3 w-full mt-10 gap-4">
                                <div className="flex flex-row bg-[#001656] rounded-lg p-4 items-center">
                                    <div className="bg-gray-500 rounded-sm p-3">
                                        <IconContext.Provider value={{ color: "white", size: "3em" }}>
                                            <RiSurveyFill/>                        
                                        </IconContext.Provider>  
                                    </div>
                                    <div className="flex flex-col px-3">
                                        <div className="text-2xl font-bold">Total Encode</div>
                                        <div className="font-bold text-lg">{numberData.total_encoded}</div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className="flex flex-row bg-[#001656] rounded-lg p-4 items-center">
                                    <div className="bg-gray-500 rounded-sm p-3">
                                        <IconContext.Provider value={{ color: "white", size: "3em" }}>
                                            <FaCross/>                           
                                        </IconContext.Provider>  
                                    </div>
                                    <div className="flex flex-col px-3">
                                        <div className="text-2xl font-bold">Total Catholic</div>
                                        <div className="font-bold text-lg">{numberData.total_catholic}</div>
                                        <div>Catholic: <span>{numberData.total_encoded_catholic}</span></div>
                                    </div>
                                </div>
                                <div className="flex flex-row bg-[#001656] rounded-lg p-4 items-center">
                                    <div className="bg-gray-500 rounded-sm p-3">
                                        <IconContext.Provider value={{ color: "white", size: "3em" }}>
                                            <FaPeopleGroup/>                        
                                        </IconContext.Provider>
                                    </div>
                                    <div className="flex flex-col px-3">
                                        <div className="text-2xl font-bold">Total Populations</div>
                                        <div className="font-bold text-lg">{numberData.total_population}</div>
                                        <div>Households: <span>{numberData.total_household}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10">
                                <div className='flex flex-row justify-end items-center gap-x-2 bg-white p-3'>
                                    <label htmlFor="search" className="block mb-2 text-sm font-medium text-black">Search: </label>
                                    <input name="search" type="text" id="search" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-[#86ACE2] placeholder-[#86ACE2] text-black focus:border-blue-500 w-1/4" placeholder="Search Name" required onChange={handleSearch}/>
                                </div>
                                <DataTable columns={columns} data={dataTable} pagination paginationPerPage={4} responsive paginationRowsPerPageOptions={[1,2,3,4,5]}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

interface settingTableProps {
    sendDataToHousehold: (data:sendData) => void; 
    onClose: () => void
}

const TableSettings: React.FC<settingTableProps> = ({sendDataToHousehold, onClose}) => {
    const [barangayList, setBarangayList] = useState([])
    const [becList, setBecList] = useState([]);
    const [bec_id, setBec_id] = useState("");
    const [barangay_id, setBarangay_id] = useState("")
    const [bec_nameData, setBec_name] = useState("");
    const [barangay_nameData, setBarangay_name] = useState("")
    function capitalizeFirstLetter(item: string) {
        return item.charAt(0).toUpperCase() + item.slice(1);
    }

    const getBEClist = async (id: string)=>{
        const token = userData().token
        try {
            const res = await axios.get(`${api_link()}/getBecList`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const datas = res.data.filter((data: any)=>{return data.barangay_id == id})
            setBecList(datas)
            setBarangay_id(id)
        } catch (error) {
            console.log(error)
        }
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
            setBarangayList(data);
        } catch (error) {
            console.log(error)
        }
    }

    const getDataBangay = (e: any) =>{
        const id = e.target.value;
        const barangay_name = e.target.options[e.target.selectedIndex].text
        getBEClist(id)
        setBarangay_name(barangay_name)
    }

    const getBec_name = (e: any)=>{
        const bec_name = e.target.options[e.target.selectedIndex].text
        const id = e.target.value;
        setBec_id(id)
        setBec_name(bec_name)
    }

    const procced = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const {barangay, bec} = {
            barangay: formData.get("barangay"),
            bec: formData.get("bec")
        }
        sendDataToHousehold({ barangay: barangay as string, bec: bec as string, barangay_name: barangay_nameData as string, bec_name: bec_nameData as string })
    }

    useEffect(()=>{
        getBarangayList()
    },[])
    return (
        <>
            <div className='md:absolute w-full h-full flex items-center justify-center text-white z-1 bg-black/50 fixed'>
                <div className="w-full max-w-2xl bg-[#86ACE2] border border-black shadow-lg rounded mx-5">
                    <div className='relative'>
                        <div className='flex flex-row p-3 gap-x-3'>
                            <div className='text-xl'>
                                Table Settings
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
                    <form className="flex flex-col m-3 bg-white text-black rounded-sm p-2" onSubmit={procced}>
                        <div>Select Barangay</div>
                        <div className="flex flex-row gap-x-1 p-3">
                            <select name="barangay" id="barangay" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required onChange={(e: any)=>getDataBangay(e)} value={barangay_id}>
                                {barangayList.map((brgy: any)=>{
                                    return(<option value={brgy.id} key={brgy.id}>{brgy.name}</option>)
                                })}
                            </select>
                            <select name="bec" id="bec" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required disabled={becList.length==0} onChange={(e: any)=>getBec_name(e)} value={bec_id}>
                                {becList.length==0?<option value="" disabled>No BEC Name for this Barangay</option>:""}
                                <option value="all" >All</option>
                                {becList.map((bec: any)=> {return (<option value={bec.id} key={bec.id}>{bec.bec_name}</option>)})}
                            </select>
                        </div>
                        <div className="ml-3">
                            <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">{"Proceed"}</button>
                        </div>
                    </form>
                </div>
            </div>        
        </>
    )
}


export default Household;