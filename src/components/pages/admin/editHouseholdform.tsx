import { useEffect, useState } from "react";
import AdminHeader from "./adminHeader";
import MyAppNav from "./adminNav";
import axios from "axios";
import { userData, api_link } from "../../../api_link";
import BounceLoader from "react-spinners/BounceLoader";
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';

export default function EditSurveyForm(){
    const { id } = useParams();
    const [barangayList, setBarangayList] = useState([])
    const [becList, setBecList] = useState([]);
    const [isLoading, setLoading] = useState(false)
    const [family_name, setfamily_name] = useState("")
    const [husband_name, sethusband_name] = useState("")
    const [wife_name, setwife_name] = useState("")
    const [husband_occupation, sethusband_occupation] = useState("")
    const [wife_occupation, setwife_occupation] = useState("")
    const [household_member, sethousehold_member] = useState("")
    const [catholic_member, setcatholic_member] = useState("")
    const [barangay_id, setbarangay_id] = useState("")
    const [bec_id, setbec_id] = useState("")
    const [attendants, setattendants] = useState("")
    const [baptism, setbaptism] = useState("")
    const [confirmation, setconfirmation] = useState("")
    const [marriage, setmarriage] = useState("")
    const [professional, setprofessional] = useState("")
    const [high_school, sethigh_school] = useState("")
    const [college, setcollege] = useState("")
    const [living_condition, setliving_condition] = useState("")
    const [comment, setcomment] = useState("")

    function capitalizeFirstLetter(item: string) {
        return item.charAt(0).toUpperCase() + item.slice(1);
    }

    const houseHoldData = async () =>{
        const token = userData().token
            try {
            const res = await axios.get(`${api_link()}/getHouseholData/${id}`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const user = res.data[0]
            setfamily_name(user.family_name ?? "")
            sethusband_name(user.husband_name ?? "")
            setwife_name(user.wife_name ?? "")
            sethusband_occupation(user.occupation_husband ?? "")
            setwife_occupation(user.occupation_wife ?? "")
            sethousehold_member(user.no_catholic ?? "")
            setcatholic_member(user.no_catholic_residence ?? "")
            setbarangay_id(user.barangay_id)
            setbec_id(user.bec_id ?? "")
            setattendants(user.mass_attendants ?? "");
            setbaptism(user.baptism ?? "")
            setconfirmation(user.isNotBaptismConfirmation)
            setmarriage(user.marrige ?? "")
            setprofessional(user.no_professional ?? "")
            sethigh_school(user.no_high_school ?? "")
            setcollege(user.no_college ?? "");
            setliving_condition(user.living_condition ?? "")
            setcomment(user.comment ?? "")
            getBEClist(user.barangay_id ?? 0)
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
    const getBEClist = async (id: number)=>{
        setbarangay_id(id.toString())
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
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getBarangayList()
        houseHoldData()
    },[])

    const addHousehold = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(!isLoading)
        const formData = new FormData(e.currentTarget)
        const formValues = {
            id: id,
            baptism: formData.get("baptism"),
            barangay: formData.get("barangay"),
            bec_id: formData.get("bec_id"),
            comment: formData.get("comment"),
            confirmation: formData.get("confirmation"),
            family_name: formData.get("family_name"),
            husband_name: formData.get("husband_name"),
            living_condition: formData.get("living_condition"),
            marrige: formData.get("marrige"),
            mass_attendants: formData.get("mass_attendants"),
            no_catholic: formData.get("no_catholic"),
            no_catholic_residence: formData.get("no_catholic_residence"),
            no_college: formData.get("no_college"),
            no_high_school: formData.get("no_high_school"),
            no_professional: formData.get("no_professional"),
            occupation_husband: formData.get("occupation_husband"),
            occupation_wife: formData.get("occupation_wife"),
            wife_name: formData.get("wife_name"),
        }
        try {
            const token = userData().token;
            const res = await axios.put(`${api_link()}/auth/editHousehold`, formValues, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                Swal.fire({
                    position: "center",
                    title: `Update Success`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000,
                }).then(()=>{
                    setLoading(false)
                    window.location.reload()
                })
            } else {
                Swal.fire({
                    position: "center",
                    title: `Something want wrong`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1000,
                })
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                position: "center",
                title: `Server error occurred.`,
                icon: "error",
                showConfirmButton: false,
                timer: 1000,
            })
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="flex md:flex-row flex-col">
                    {isLoading&&
                    <div className='absolute bg-black/50 z-40 w-full h-full'>
                        {/* how to make this first layer of the screen */}
                        <div  className='flex items-center justify-center w-full h-full'>
                            <BounceLoader color='#ffffff' size={120}/>
                        </div>
                    </div>    
                    } 
                    <MyAppNav/>
                    {/* add this to a file content */}
                    <div className='md:w-[80%] h-screen bg-[#86ACE2] text-white w-full md:mt-0 mt-10'>
                        {/* content here */}
                        <div className='flex flex-col w-full h-full'>
                            <div className='w-full h-[12.7%] flex flex-row'>
                                <AdminHeader/>
                            </div>
                            <div className='w-full h-[87.3%] flex flex-row overflow-y-scroll'>
                                <div className='w-full flex flex-col px-10'>
                                    <div className="">
                                        <h2 className='text-2xl text-black opacity-[50%]'>
                                            Edit Household Information
                                        </h2>
                                        <p>This form is execlusively for encoders to filled out. If there is no information for a field, please input 0(zero)</p>
                                    </div>
                                    <form className="flex flex-col mt-8 text-black gap-y-4" onSubmit={addHousehold}>

                                        <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                                            <h2 className="uppercase">
                                                Basic Information
                                            </h2>
                                            <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                                            <div className="grid grid-cols-2 mt-2 gap-5">
                                                <div className="col-span-2">
                                                    <label htmlFor="family_name" className="block mb-2 text-sm font-medium capitalize">family name</label>
                                                    <input name="family_name" type="text" id="family_name" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required value={family_name} onChange={(e)=>setfamily_name(e.target.value)} />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="husband_name" className="block mb-2 text-sm font-medium capitalize">Husband name</label>
                                                    <input name="husband_name" type="text" id="husband_name" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" value={husband_name}  onChange={e=>sethusband_name(e.target.value)} required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="occupation_husband" className="block mb-2 text-sm font-medium capitalize">occupation</label>
                                                    <input name="occupation_husband" type="text" id="occupation_husband" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={husband_occupation} onChange={e=>sethusband_occupation(e.target.value)} />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="wife_name" className="block mb-2 text-sm font-medium capitalize">Wife Name</label>
                                                    <input name="wife_name" type="text" id="wife_name" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={wife_name} onChange={e=>setwife_name(e.target.value)}/>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="occupation_wife" className="block mb-2 text-sm font-medium capitalize">occupation</label>
                                                    <input name="occupation_wife" type="text" id="occupation_wife" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={wife_occupation} onChange={e=>setwife_occupation(e.target.value)} />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_catholic" className="block mb-2 text-sm font-medium capitalize">no. of household members</label>
                                                    <input name="no_catholic" type="number" id="no_catholic" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={household_member} onChange={e=>sethousehold_member(e.target.value)} />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_catholic_residence" className="block mb-2 text-sm font-medium capitalize">No. of catholic residence</label>
                                                    <input name="no_catholic_residence" type="number" id="no_catholic_residence" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={catholic_member} onChange={e=>setcatholic_member(e.target.value)}/>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="barangay" className="block mb-2 text-sm font-medium capitalize">barangay</label>
                                                    <select name="barangay" id="barangay" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required onChange={(e:any)=>{getBEClist(e.target.value)}} value={barangay_id}>
                                                        {barangayList.map((brgy: any)=>{
                                                            return(<option value={brgy.id} key={brgy.id}>{brgy.name}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="bec_id" className="block mb-2 text-sm font-medium capitalize">BEC name</label>
                                                    <select name="bec_id" id="bec_id" value={bec_id} className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required onChange={(e:any)=>{setbec_id(e.target.value)}}>
                                                        {becList.length==0?<option value="" disabled selected>No BEC Name for this Barangay</option>:""}
                                                        {becList.map((bec: any)=> {return (<option value={bec.id} key={bec.id} >{bec.bec_name}</option>)})}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                                            <h2 className="uppercase">
                                                Sacraments
                                            </h2>
                                            <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                                            <div className="grid grid-cols-2 mt-2 gap-5">
                                                <div className="col-span-2">
                                                    <label htmlFor="mass_attendants" className="block mb-2 text-sm font-medium capitalize">Mass attendants of family member</label>
                                                    <select name="mass_attendants" id="mass_attendants" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required value={attendants} onChange={e=>setattendants(e.target.value)}>
                                                        <option value="daily" className="capitalize">Daily</option>
                                                        <option value="every sunday" className="capitalize">Every sunday</option>
                                                        <option value="monthly" className="capitalize">Monthly</option>
                                                        <option value="occasionally" className="capitalize">Occasionally</option>
                                                        <option value="don't attend mass" className="capitalize">Don't attend mass</option>
                                                    </select>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="baptism" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Baptism</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many are <span className="uppercase">not yet baptized?</span></p>
                                                    </label>
                                                    <input name="baptism" type="number" id="baptism" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={baptism} onChange={e=>setbaptism(e.target.value)} />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="confirmation" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Confirmation</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many are <span className="uppercase">not yet Confirmed?</span></p>
                                                    </label>
                                                    <input name="confirmation" type="number" id="confirmation" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={confirmation} onChange={e=>setconfirmation(e.target.value)} />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="marrige" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Marriage</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many couple are <span className="uppercase">not yet married in the church?</span></p>
                                                    </label>
                                                    <input name="marrige" type="number" id="marrige" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={marriage} onChange={e=>setmarriage(e.target.value)} />
                                                </div>  
                                            </div>
                                        </div>    

                                        <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                                            <h2 className="uppercase">
                                                Education
                                            </h2>
                                            <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                                            <div className="grid grid-cols-2 mt-2 gap-5">
                                                <div className="col-span-2">
                                                    <label htmlFor="no_professional" className="block mb-2 text-sm font-medium capitalize">How many are professional?</label>
                                                    <input name="no_professional" type="number" id="no_professional" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required value={professional} onChange={e=>setprofessional(e.target.value)} />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_high_school" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        How many did STOP studying in HIGH SCHOOL?
                                                    </label>
                                                    <input name="no_high_school" type="number" id="no_high_school" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={high_school} onChange={e=>sethigh_school(e.target.value)} />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="no_college" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        How many did STOP studying in COLLEGE?
                                                    </label>
                                                    <input name="no_college" type="number" id="no_college" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={college} onChange={e=>setcollege(e.target.value)} />
                                                </div>  
                                            </div>
                                        </div> 

                                        <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                                            <h2 className="uppercase">
                                                Others
                                            </h2>
                                            <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                                            <div className="grid grid-cols-2">
                                                <div className="col-span-2">
                                                    <label htmlFor="living_condition" className="block mb-2 text-sm font-medium capitalize">living condition</label>
                                                    <select name="living_condition" id="living_condition" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required value={living_condition} onChange={e=>setliving_condition(e.target.value)}>
                                                        <option value="upper class">Upper Class</option>
                                                        <option value="middle class">Middle Class</option>
                                                        <option value="poor">Poor</option>
                                                        <option value="very poor">Very poor</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="comment" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        Comments
                                                    </label>
                                                    <textarea name="comment" rows={5} id="comment" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" onChange={e=>setcomment(e.target.value)} value={comment}></textarea>
                                                </div>  
                                            </div>
                                        </div>       
                                        <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" disabled={!bec_id}>{"Submit"}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
        </>
    )
}