import AdminHeader from "./adminHeader";
import MyAppNav from "./adminNav";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";
import { FaCross, FaEye, FaFileExport } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IconContext } from "react-icons";
import { useEffect, useState } from "react";
import { api_link, userData } from "../../../api_link";
import axios from "axios";
import { MdOutlineCancel, MdBusiness  } from "react-icons/md";
import DataTable from "react-data-table-component";
import * as XLSX from 'xlsx';
import { BounceLoader } from "react-spinners";
import ViewHouseholdData from "./subpage/viewHouseholdData"
import React from "react";
import 'animate.css'

interface dataToHouseholdProps {}
interface sendData {
    barangay: string;
    bec: string;
    barangay_name: string;
    bec_name: string
}

const Household:React.FC<dataToHouseholdProps> = ()=>{
    const [numberData, setnumberData] = useState({
        total_lumon : "0",  total_encoded : "0", total_encoded_catholic : "0" , total_household : "0", total_population : "0"
    })
    const [tableSettingData, settableSettingData] = useState( {barangay: "0", bec: "0", barangay_name: "All Barangay", bec_name: "All BEC"} )
    const [isTableSettingShow, setTableSettiingShow] = useState(false)
    const [dataTable, setDataTable] = useState([])
    const [allData, setAllData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isDisplayLoading, setIsDisplayLoading] = useState(true)
    const [isHouseholdDataShow, setHouseholdDataShow] = useState(false)
    const [householdData, setHouseholdData] = useState({
                                                baptism: 0, 
                                                barangay_id: 0,
                                                barangay_name: '',
                                                bec_id: 0,
                                                bec_name: '',
                                                comment: '',
                                                family_name: '',
                                                household: 0,
                                                husband_name: '',
                                                id: 0,
                                                isNotBaptismConfirmation: 0,
                                                living_condition: '',
                                                marrige: 0,
                                                mass_attendants: '',
                                                no_catholic_residence: 0,
                                                no_college: 0,
                                                no_high_school: 0,
                                                no_professional: 0, 
                                                occupation_husband: '',
                                                occupation_wife: '',
                                                wife_name: '',
                                                lumon: 0
                                            });

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
    

    
    const editHousehold = async (data: any)=>{
        setHouseholdDataShow(!isHouseholdDataShow)
        setHouseholdData(data)
    }

    const capitalize = (str: string)=>{
        if (str.length === 0) return ''
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const getDataTable = async () =>{
        const token = userData().token
        setIsDisplayLoading(true)
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
                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-blue-800" onClick={()=>editHousehold(data)}><FaEye/></button>
                                </div>,
                        "BARANGAY_ID": data.barangay_id,
                        "BEC_ID": data.bec_id,
                        "FAMILY NAME": capitalize(data.family_name),
                        "HUSBAND NAME": capitalize(data.husband_name),
                        "WIFE NAME": capitalize(data.wife_name),
                        "OCCUPATION HUSBAND": capitalize(data.occupation_husband),
                        "OCCUPATION WIFE": capitalize(data.occupation_wife),
                        "BARANGAY NAME": capitalize(data.barangay_name),
                        "BEC NAME": capitalize(data.bec_name),
                        "LUMON": data.lumon,
                        "HOUSEHOLDS": data.household,
                        "CATHOLIC": data.no_catholic_residence,
                        "ATTENDANTS": capitalize(data.mass_attendants),
                        "BAPTISM": data.baptism,
                        "CONFIRMATION": data.isNotBaptismConfirmation,
                        "MARRIED": data.marrige,
                        "PROFESSIONAL": data.no_professional,
                        "HIGH SCHOOL": data.no_high_school,
                        "COLLECE": data.no_college,
                        "LIVING CONDITION": capitalize(data.living_condition),
                        "COMMENT": data.comment
                    }
                )
            })
            setDataTable(datas)
            setAllData(datas)
            setIsDisplayLoading(false)
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
        { name: "Action", selector: ((row: any) => row["Action"])},
        {width: "200px", name: "FAMILY NAME", selector: ((row: any) => row["FAMILY NAME"]), sortable: true},
        {width: "200px", name: "HUSBAND NAME", selector: ((row: any) => row["HUSBAND NAME"]), sortable: true},
        {width: "200px", name: "WIFE NAME", selector: ((row: any) => row["WIFE NAME"]), sortable: true},
        {width: "200px", name: "OCCUPATION HUSBAND", selector: ((row: any) => row["OCCUPATION HUSBAND"]), sortable: true},
        {width: "200px", name: "OCCUPATION WIFE", selector: ((row: any) => row["OCCUPATION WIFE"]), sortable: true},
        {width: "200px", name: "BARANGAY NAME", selector: ((row: any) => row["BARANGAY NAME"]), sortable: true},
        {width: "200px", name: "BEC NAME", selector: ((row: any) => row["BEC NAME"]), sortable: true},
        {width: "200px", name: "LUMON", selector: ((row: any) => row["LUMON"]), sortable: true},
        {width: "200px", name: "HOUSEHOLDS", selector: ((row: any) => row["HOUSEHOLDS"]), sortable: true},
        {width: "200px", name: "CATHOLIC", selector: ((row: any) => row["CATHOLIC"]), sortable: true},
        {width: "200px", name: "ATTENDANTS", selector: ((row: any) => row["ATTENDANTS"]), sortable: true},
        {width: "200px", name: "BAPTISM", selector: ((row: any) => row["BAPTISM"]), sortable: true},
        {width: "200px", name: "CONFIRMATION", selector: ((row: any) => row["CONFIRMATION"]), sortable: true},
        {width: "200px", name: "MARRIED", selector: ((row: any) => row["MARRIED"]), sortable: true},
        {width: "200px", name: "PROFESSIONAL", selector: ((row: any) => row["PROFESSIONAL"]), sortable: true},
        {width: "200px", name: "HIGH SCHOOL", selector: ((row: any) => row["HIGH SCHOOL"]), sortable: true},
        {width: "200px", name: "COLLECE", selector: ((row: any) => row["COLLECE"]), sortable: true},
        {width: "200px", name: "LIVING CONDITION", selector: ((row: any) => row["LIVING CONDITION"])},
        {width: "200px", name: "COMMENT", selector: ((row: any) => row["COMMENT"])},
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
        <MyAppNav isOpenMasterList={true}/>

        {isLoading&&
        <div className='absolute bg-black/50 z-40 w-full h-full'>
            <div  className='flex items-center justify-center w-full h-full'>
                <BounceLoader color='#ffffff' size={120}/>
            </div>
        </div>    
        } 

        {/* add this to a file content */}
        {isTableSettingShow&&<TableSettings onClose={()=>setTableSettiingShow(!isTableSettingShow)} sendDataToHousehold={handleDataFromChild}/>}
        {isHouseholdDataShow&&<ViewHouseholdData data={householdData} onClose={()=>setHouseholdDataShow(!isHouseholdDataShow)} onLoading={()=>setLoading(!isLoading)} />}
        <div className='flex flex-col m-0 md:ml-[16%] text-white bg-[#86ACE2] py-1 h-screen'>
            <div className='text-white w-full'>
                <div className='w-full flex flex-row'>
                    <AdminHeader/>
                </div>
                {/* content here */}
                <div className='flex flex-col w-full'>
                    <div className='w-full flex flex-col px-10 animate__animated animate__fadeIn'>
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
                            <div className="grid md:grid-cols-4 w-full mt-10 gap-4">
                                <div className="flex flex-row bg-[#001656] rounded-lg p-2 items-center">
                                    <div className="bg-gray-500 rounded-sm p-3">
                                        <IconContext.Provider value={{ color: "white", size: "3em" }}>
                                            <RiSurveyFill/>                        
                                        </IconContext.Provider>  
                                    </div>
                                    <div className="flex flex-col px-3">
                                        <div className="text-2xl font-bold">Total Encode</div>
                                        <div className="font-bold text-lg">{isDisplayLoading?"Loading..":numberData.total_encoded}</div>
                                    </div>
                                </div>
                                <div className="flex flex-row bg-[#001656] rounded-lg p-2 items-center">
                                    <div className="bg-gray-500 rounded-sm p-3">
                                        <IconContext.Provider value={{ color: "white", size: "3em" }}>
                                            <FaCross/>                           
                                        </IconContext.Provider>  
                                    </div>
                                    <div className="flex flex-col px-3">
                                        <div className="text-2xl font-bold">Catholic</div>
                                        <div className="font-bold text-lg">{isDisplayLoading?"Loading..":numberData.total_encoded_catholic}</div>
                                    </div>
                                </div>
                                <div className="flex flex-row bg-[#001656] rounded-lg p-2 items-center">
                                    <div className="bg-gray-500 rounded-sm p-3">
                                        <IconContext.Provider value={{ color: "white", size: "3em" }}>
                                            <FaPeopleGroup/>                        
                                        </IconContext.Provider>
                                    </div>
                                    <div className="flex flex-col px-3">
                                        <div className="text-2xl font-bold">Populations</div>
                                        <div className="font-bold text-lg">{isDisplayLoading?"Loading..":numberData.total_population}</div>
                                    </div>
                                </div>
                                <div className="flex flex-row bg-[#001656] rounded-lg p-2 items-center">
                                    <div className="bg-gray-500 rounded-sm p-3">
                                        <IconContext.Provider value={{ color: "white", size: "3.5em" }}>
                                            <MdBusiness/>                     
                                        </IconContext.Provider>
                                    </div>
                                    <div className="flex flex-col px-3">
                                        <div className="text-2xl font-bold">Lumon</div>
                                        <div className="font-bold text-lg">{isDisplayLoading?"Loading..":numberData.total_lumon }</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className='flex flex-row justify-end items-center gap-x-2 bg-white p-3'>
                                    <label htmlFor="search" className="block mb-2 text-sm font-medium text-black">Search: </label>
                                    <input name="search" type="text" id="search" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white focus:border-blue-500 w-1/4" placeholder="Search Name" required onChange={handleSearch}/>
                                </div>
                                {!isDisplayLoading?<div className='w-full bg-white'>Loading..</div>:""}
                                {!isDisplayLoading&&
                                <DataTable columns={columns} data={dataTable} pagination paginationPerPage={4} responsive paginationRowsPerPageOptions={[1,2,3,4]} />
                                } 
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
                <div className="w-full max-w-2xl bg-[#86ACE2] border border-black shadow-lg rounded mx-5 animate__animated animate__fadeIn">
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
                            <select name="barangay" id="barangay" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required onChange={(e: any)=>getDataBangay(e)} value={barangay_id}>
                                {barangayList.map((brgy: any)=>{
                                    return(<option value={brgy.id} key={brgy.id}>{brgy.name}</option>)
                                })}
                            </select>
                            <select name="bec" id="bec" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required disabled={becList.length==0} onChange={(e: any)=>getBec_name(e)} value={bec_id}>
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