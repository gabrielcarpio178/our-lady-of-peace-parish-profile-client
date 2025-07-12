import AdminHeader from "./AdminHeader";
import MyAppNav from "./AdminNav";
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
import ViewHouseholdData from "./subpage/ViewHouseholdData"
import React from "react";
import 'animate.css'

interface dataToHouseholdProps {}

type ThouseholdData = {
    baptism: number, 
    barangay_id: number,
    life_status: string,
    barangay_name: string,
    bec_id: number,
    bec_name: string,
    comment: string,
    family_name: string,
    household: number,
    husband_name?: string,
    id: number,
    isNotBaptismConfirmation: number,
    living_condition: string,
    marrige: number,
    mass_attendants: string,
    no_catholic_residence: number,
    no_college: number,
    no_high_school: number,
    no_professional: number, 
    occupation_husband?: string,
    occupation_wife?: string,
    wife_name?: string,
    lumon: number,
    mname?:string,
    moccupation?: string
}

type TsickData = {
    baptism: number, 
    barangay_id: number,
    life_status: string,
    barangay_name: string,
    bec_id: number,
    bec_name: string,
    comment: string,
    family_name: string,
    household: number,
    oname: string,
    id: number,
    isNotBaptismConfirmation: number,
    living_condition: string,
    marrige: number,
    mass_attendants: string,
    no_catholic_residence: number,
    no_college: number,
    no_high_school: number,
    no_professional: number, 
    moccupation: string,
    ooccupation: string,
    mname: string,
    lumon: number,
}

type TnotSick = {
    baptism: number, 
    barangay_id: number,
    life_status: string,
    barangay_name: string,
    bec_id: number,
    bec_name: string,
    comment: string,
    family_name: string,
    household: number,
    id: number,
    isNotBaptismConfirmation: number,
    living_condition: string,
    marrige: number,
    mass_attendants: string,
    no_catholic_residence: number,
    no_college: number,
    no_high_school: number,
    no_professional: number, 
    lumon: number,
    mname:string,
    moccupation: string
}

type TtableContentData = {
    columns: string[],
    data: any[]
}

type TcolumnTableName = {
    name: string,
    selector: (row: any) => string | number | boolean,
    width?: string,
    sortable?: boolean
}

type TtableContent = {
    columns: TcolumnTableName[],
    data: any[]
}

type sendData = {
    barangay: string;
    bec: string;
    barangay_name: string;
    bec_name: string
}

type Tlife_statusCount = {
    sick: number,
    single: number,
    widower: number
    living_alone: number,
    widowed: number
}

const Household:React.FC<dataToHouseholdProps> = ()=>{
    const [numberData, setnumberData] = useState({
        total_lumon : "0",  total_encoded : "0", total_encoded_catholic : "0" , total_household : "0", total_population : "0"
    })
    const [tableSettingData, settableSettingData] = useState( {barangay: "0", bec: "0", barangay_name: "All Barangay", bec_name: "All BEC"} )
    const [isTableSettingShow, setTableSettiingShow] = useState(false)
    const [dataTables, setDataTable] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isDisplayLoading, setIsDisplayLoading] = useState(true)
    const [isHouseholdDataShow, setHouseholdDataShow] = useState(false)
    const [householdData, setHouseholdData] = useState<ThouseholdData|null>(null); 
    const [tableContent, setTableContent] = useState<TtableContent>({
        columns: [],
        data: []
    })
    const [allData, setAllData] = useState([])

    const [tableSelectContent, setTableSelectContent] = useState("sick")
    const [life_statusCount, setLife_statusCount] = useState<Tlife_statusCount|null>(null)

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

            const lifeCountdataTable: Tlife_statusCount = {
                sick:res.data.filter((dataTable: any)=>{return (dataTable.life_status==="sick")}).length,
                single:res.data.filter((dataTable: any)=>{return (dataTable.life_status==="single")}).length,
                living_alone:res.data.filter((dataTable: any)=>{return (dataTable.life_status==="living alone")}).length,
                widowed:res.data.filter((dataTable: any)=>{return (dataTable.life_status==="widowed")}).length,
                widower:res.data.filter((dataTable: any)=>{return (dataTable.life_status==="widower")}).length
            }
            setAllData(res.data)
            setDataTable(res.data)
            setLife_statusCount(lifeCountdataTable)
            allTableData('sick')
            setIsDisplayLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    const allTableData = (selectTableContent: string) =>{
        setTableSelectContent(selectTableContent)
        const resultData = dataTables.filter((data: any)=>{return (data.life_status===selectTableContent)})
        setAllData(resultData);
        if(selectTableContent==="sick"){
            sickContentData(resultData)
        }else{
            singleContentData(resultData)
        }
    }


    

    const singleContentData = (datas: TnotSick[]) =>{
        const columnName = ["FAMILY NAME", "FIRST NAME", "OCCUPATION", "BARANGAY NAME", "BEC NAME", "LUMON", "HOUSEHOLDS", "CATHOLIC", "ATTENDANTS","BAPTISM", "CONFIRMATION","MARRIED", "PROFESSIONAL", "HIGH SCHOOL", "COLLECE", "LIVING CONDITION", "COMMENT"];
        const data = datas.map((data: TnotSick)=>{
            return ({
                "Action": <div>
                            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-blue-800" onClick={()=>editHousehold(data)}><FaEye/></button>
                        </div>,
                "BARANGAY_ID": data.barangay_id,
                "BEC_ID": data.bec_id,
                "FAMILY NAME": capitalize(data.family_name),
                "FIRST NAME": capitalize(data.mname),
                "OCCUPATION": capitalize(data.moccupation),
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
            })
        })
        displayTableData({columns: columnName, data: data})
        
    }

    const sickContentData = (datas: TsickData[]) => {
        const columnName = ["FAMILY NAME", "HUSBAND NAME", "WIFE NAME", "OCCUPATION HUSBAND", "OCCUPATION WIFE", "BARANGAY NAME", "BEC NAME", "LUMON", "HOUSEHOLDS", "CATHOLIC", "ATTENDANTS","BAPTISM", "CONFIRMATION","MARRIED", "PROFESSIONAL", "HIGH SCHOOL", "COLLECE", "LIVING CONDITION", "COMMENT"]

        const data = datas.map((data:TsickData)=>{
            return ({
                "Action": <div>
                            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 mb-2 focus:outline-none dark:focus:ring-blue-800" onClick={()=>editHousehold(data)}><FaEye/></button>
                        </div>,
                "BARANGAY_ID": data.barangay_id,
                "BEC_ID": data.bec_id,
                "FAMILY NAME": capitalize(data.family_name),
                "HUSBAND NAME": capitalize(data.oname),
                "WIFE NAME": capitalize(data.mname),
                "OCCUPATION HUSBAND": capitalize(data.ooccupation),
                "OCCUPATION WIFE": capitalize(data.moccupation),
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
            })
        })
        displayTableData({columns: columnName, data: data})
    }

    const displayTableData = (contentdatas: TtableContentData)=>{
        const {columns, data} = contentdatas;
        const columnName: TcolumnTableName[] = columns.map((col: string) => ({
            name: col,
            selector: (row: any) => row[col],
            sortable: true,
            width: "200px"
        }));
        columnName.unshift({name: "Action", selector: ((row: any) => row["Action"])})
        setTableContent({columns: columnName, data:data})
    }

    // const tableData = (bec_id: any, barangay_id: any) => {
    //     barangay_id = barangay_id=="all"?0:parseInt(barangay_id)
    //     bec_id = bec_id=="all"?0:parseInt(bec_id)
    //     if(barangay_id!=0||bec_id!=0){
    //         let searchRes = allData;
    //         if(barangay_id!=0){
    //             searchRes = allData.filter((data: any)=>{
    //                 return (data["BARANGAY_ID"]===barangay_id)
    //             })
    //         }
    //         if(bec_id!=0){
    //             searchRes = allData.filter((data: any)=>{
    //                 return (data["BEC_ID"]===bec_id)
    //             })
    //         }
    //         if(bec_id!=0&&barangay_id!=0){
    //             searchRes = allData.filter((data: any)=>{
    //                 return (data["BEC_ID"]===bec_id&&data["BARANGAY_ID"]===barangay_id)
    //             })
    //         }
    //         setDataTable(searchRes);
    //     }
    // }
    // const handleDataFromChild = (data: sendData): void => {
    //     setTableSettiingShow(!isTableSettingShow)
    //     settableSettingData(data)
    //     tableData(data.bec, data.barangay)
    // };
    useEffect(()=>{
        getDataTable()
        getNumberData()
    },[])

    useEffect(() => {
        if (dataTables.length > 0) {
            allTableData('sick')
        }
    }, [dataTables]);
    const handleSearch = (e: any)=>{
        let query = e.target.value;
        console.log(allData)
        if(tableSelectContent==="sick"){
            const resSearch = allData.filter((data: any)=>{
                return (
                    data.bec_name.toUpperCase().includes(query.toUpperCase())||data.family_name.toUpperCase().includes(query.toUpperCase())||data.mname.toUpperCase().includes(query.toUpperCase())||data.oname.toUpperCase().includes(query.toUpperCase())||data.mname.toUpperCase().includes(query.toUpperCase())
                )
            })
            sickContentData(resSearch)
        }else{
            const resSearch = allData.filter((data: any)=>{
                return (
                    data.bec_name.toUpperCase().includes(query.toUpperCase())||data.family_name.toUpperCase().includes(query.toUpperCase())||data.mname.toUpperCase().includes(query.toUpperCase())||data.mname.toUpperCase().includes(query.toUpperCase())
                )
            })
            singleContentData(resSearch)
        }
    }
    const exportExcel = () =>{
        const dataExport = dataTables.map((data: any)=>{
            delete data["BARANGAY_ID"];
            delete data["BEC_ID"];
            delete data["Action"]
            return data;
        })
        console.log(dataExport)
        const downloadfileData = dataExport.map((data: any)=>{
            return (
                {id: data.id, "Family name": data.family_name, "Life Status": data.life_status, "Wife name": data.mname, "Husband name": data.oname, "Barangay name": data.barangay_name, "BEC name": data.bec_name, "Household": data.household, "Catholic": data.no_catholic_residence, "Lumon": data.lumon, "Attendants": data.mass_attendants, "Baptism": data.baptism, "Confirmation": data.isNotBaptismConfirmation, "Married": data.marrige, "Professional": data.no_professional, "College": data.no_college,"High School": data.no_high_school, "Living condition": data.living_condition, "Comment": data.comment}
            )
        })
        const worksheet = XLSX.utils.json_to_sheet(downloadfileData);
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
        {/* {isTableSettingShow&&<TableSettings onClose={()=>setTableSettiingShow(!isTableSettingShow)} sendDataToHousehold={handleDataFromChild}/>} */}
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
                                    Household - <span>{tableSettingData==null?"All Barangay":tableSettingData.barangay_name+" - "+`${tableSettingData.bec_name==""||tableSettingData.bec_name==""?"All BEC":tableSettingData.bec_name}`}</span>
                                </h2>
                                <div className="flex flex-row border border-black rounded-sm">
                                    {/* <div className="flex flex-row bg-[#001656] items-center px-2 gap-x-1 cursor-pointer" onClick={()=>setTableSettiingShow(!isTableSettingShow)}>
                                        <div>
                                            <IconContext.Provider value={{ color: "white", size: "1em" }}>
                                                <IoMdSettings/>
                                            </IconContext.Provider>
                                        </div>
                                        <div>
                                            Table Settings
                                        </div>
                                    </div> */}
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
                                <div className="flex flex-col md:flex-row md:items-end w-full justify-between bg-white gap-x-3 py-2 px-3">
                                    <div className="flex flex-col w-full">
                                        <div className="text-black">
                                            Life Status
                                        </div>
                                        <div className="flex flex-col md:flex-row w-full gap-3">
                                            <div onClick={()=>{allTableData("sick")}} className={(tableSelectContent==="sick"?"bg-slate-600 text-white ":"text-black ")+"shadow-sm p-2 rounded-lg hover:bg-slate-600 hover:text-white md:w-[20%] text-center cursor-pointer group w-full"}>
                                                <span className={(tableSelectContent==="sick"?"bg-white text-black px-2 ":"bg-slate-600 text-white px-2 group-hover:bg-white group-hover:text-black ")+ "px-1 rounded-full mr-1"}>{life_statusCount?.sick!==null?life_statusCount?.sick:0}</span>
                                                Sick
                                            </div>
                                            <div onClick={()=>{allTableData("single")}} className={(tableSelectContent==="single"?"bg-slate-600 text-white ":"text-black ")+"shadow-sm p-2 rounded-lg hover:bg-slate-600 hover:text-white md:w-[20%] text-center cursor-pointer group w-full"}>
                                                <span className={(tableSelectContent==="single"?"bg-white text-black px-2 ":"bg-slate-600 text-white px-2 group-hover:bg-white group-hover:text-black ")+ "px-1 rounded-full mr-1"}>{life_statusCount?.single!==null?life_statusCount?.single:0}</span>
                                                Single
                                            </div>
                                            <div onClick={()=>{allTableData("living alone")}} className={(tableSelectContent==="living alone"?"bg-slate-600 text-white ":"text-black ")+"shadow-sm p-2 rounded-lg hover:bg-slate-600 hover:text-white md:w-[20%] text-center cursor-pointer group w-full text-sm"}>
                                                <span className={(tableSelectContent==="living alone"?"bg-white text-black px-2 ":"bg-slate-600 text-white px-2 group-hover:bg-white group-hover:text-black ")+ "px-1 rounded-full mr-1"}>{life_statusCount?.living_alone!==null?life_statusCount?.living_alone:0}</span>
                                                Living Alone
                                            </div>
                                            <div onClick={()=>{allTableData('widowed')}} className={(tableSelectContent==="widowed"?"bg-slate-600 text-white ":"text-black ")+"shadow-sm p-2 rounded-lg hover:bg-slate-600 hover:text-white md:w-[20%] text-center cursor-pointer group w-full"}>
                                                <span className={(tableSelectContent==="widowed"?"bg-white text-black px-2 ":"bg-slate-600 text-white px-2 group-hover:bg-white group-hover:text-black ")+ "px-1 rounded-full mr-1"}>{life_statusCount?.widowed!==null?life_statusCount?.widowed:0}</span>
                                                Widowed
                                            </div>
                                            <div onClick={()=>{allTableData('widower')}} className={(tableSelectContent==="widower"?"bg-slate-600 text-white ":"text-black ")+"shadow-sm p-2 rounded-lg hover:bg-slate-600 hover:text-white md:w-[20%] text-center cursor-pointer group w-full"}>
                                                <span className={(tableSelectContent==="widower"?"bg-white text-black px-2 ":"bg-slate-600 text-white px-2 group-hover:bg-white group-hover:text-black ")+ "px-1 rounded-full mr-1"}>{life_statusCount?.widower!==null?life_statusCount?.widower:0}</span>
                                                Widower
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="w-[40%]">
                                        <label htmlFor="search" className="block mb-2 text-sm font-medium text-black">Search: </label>
                                        <input name="search" type="text" id="search" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 border-gray-700 placeholder-gray-700 text-white focus:border-blue-500 w-full" placeholder="Search Name" required onChange={handleSearch}/>
                                    </div>
                                </div>
                                
                                {!isDisplayLoading?<div className='w-full bg-white'>Loading..</div>:""}
                                {/* columns is error. how this happen? */}
                                {!isDisplayLoading&&
                                <DataTable columns={tableContent.columns} data={tableContent.data} pagination paginationPerPage={4} responsive paginationRowsPerPageOptions={[1,2,3,4]} />
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