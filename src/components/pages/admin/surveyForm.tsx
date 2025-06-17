import { useEffect, useState } from "react";
import AdminHeader from "./adminHeader";
import MyAppNav from "./adminNav";
import axios from "axios";
import { userData, api_link } from "../../../api_link";
import BounceLoader from "react-spinners/BounceLoader";
import Swal from "sweetalert2";
import 'animate.css'
export default function SurveyForm(){
    const [barangayList, setBarangayList] = useState([])
    const [becList, setBecList] = useState([]);
    const [isLoading, setLoading] = useState(false)
    const [bec, getBEC] = useState("")
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
        setBarangayList(data);
        getBEClist(data[0].id)
    } catch (error) {
        console.log(error)
    }
    }
    const getBEClist = async (id: number)=>{
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
        
    },[])

    const addHousehold = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const user_id = userData().user.id
        const formData = new FormData(e.currentTarget)
        const formValues = {
            user_id: user_id,
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
            lumon: formData.get('lumon')
        }

        const numericFields = [
            'no_catholic',
            'no_catholic_residence',
            'no_college',
            'no_high_school',
            'no_professional',
            'marrige',
            'lumon',
            'baptism',
            'confirmation'
        ];

        const hasNegative = numericFields.some(field => {
            const value = Number(formData.get(field));
            return !isNaN(value) && value < 0;
        });

        if (hasNegative) return;
        const token = userData().token
        try {
            const res = await axios.post(`${api_link()}/addHousehold`, formValues, {
            headers:{
                'Content-type':'application/x-www-form-urlencoded',
                "authorization" : `bearer ${token}`,
            }
        })
        if(res.data.msg=="bec_id is not found"){
            Swal.fire({
                position: "center",
                title: `Add BEC Name`,
                icon: "error",
                showConfirmButton: false,
                timer: 1000,
            })
            setLoading(false)
        }else{
            Swal.fire({
                position: "center",
                title: `Add Success`,
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
            }).then(()=>{
                setLoading(!isLoading)
                window.location.reload()
            })
        }
        
        } catch (error) {
            console.log(error)
        }
    }   



    return (
        <>
            <div className="flex md:flex-row flex-col bg-[#86ACE2] md:h-[100vh] h-auto">
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
                    <div className='md:w-[80%] text-white w-full md:mt-0 mt-10'>
                        {/* content here */}
                        <div className='flex flex-col w-full h-full'>
                            <div className='w-full flex flex-row'>
                                <AdminHeader/>
                            </div>
                            <div className='w-full flex flex-row overflow-y-scroll'>
                                <div className='w-full flex flex-col px-10  animate__animated animate__fadeIn'>
                                    <div className="">
                                        <h2 className='text-2xl text-black opacity-[50%]'>
                                            Add Household Information
                                        </h2>
                                        <p>This form is execlusively for encoders to filled out. If there is no information for a field, please input 0(zero)</p>
                                    </div>
                                    <form className="flex flex-col mt-8 text-black gap-y-4" onSubmit={addHousehold}>

                                        <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                                            <h2 className="uppercase">
                                                Basic Information
                                            </h2>
                                            <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                                            <div className="grid md:grid-cols-2 mt-2 gap-5">
                                                <div className="col-span-2">
                                                    <label htmlFor="family_name" className="block mb-2 text-sm font-medium capitalize">family name</label>
                                                    <input name="family_name" type="text" id="family_name" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-[49%] text-white" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="husband_name" className="block mb-2 text-sm font-medium capitalize">Husband name</label>
                                                    <input name="husband_name" type="text" id="husband_name" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="occupation_husband" className="block mb-2 text-sm font-medium capitalize">occupation</label>
                                                    <input name="occupation_husband" type="text" id="occupation_husband" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="wife_name" className="block mb-2 text-sm font-medium capitalize">Wife Name</label>
                                                    <input  name="wife_name" type="text" id="wife_name" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="occupation_wife" className="block mb-2 text-sm font-medium capitalize">occupation</label>
                                                    <input name="occupation_wife" type="text" id="occupation_wife" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_catholic" className="block mb-2 text-sm font-medium capitalize">no. of household members</label>
                                                    <input name="no_catholic" type="number" min="0" id="no_catholic" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_catholic_residence" className="block mb-2 text-sm font-medium capitalize">No. of catholic residence</label>
                                                    <input name="no_catholic_residence" type="number" min="0" id="no_catholic_residence" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="barangay" className="block mb-2 text-sm font-medium capitalize">barangay</label>
                                                    <select name="barangay" id="barangay" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required onChange={(e:any)=>{getBEClist(e.target.value)}}>
                                                        {barangayList.map((brgy: any)=>{
                                                            return(<option value={brgy.id} key={brgy.id}>{brgy.name}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="bec_id" className="block mb-2 text-sm font-medium capitalize">BEC name</label>
                                                    <select name="bec_id" id="bec_id" value={bec} className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required disabled={becList.length==0} onChange={(e:any)=>{getBEC(e.target.value)}}>
                                                        {becList.length==0?<option value="" disabled>No BEC Name for this Barangay</option>:""}
                                                        {becList.map((bec: any)=> {return (<option value={bec.id} key={bec.id}>{bec.bec_name}</option>)})}
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
                                                    <select name="mass_attendants" id="mass_attendants" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-[49%]" required >
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
                                                    <input name="baptism" type="number" min="0" id="baptism" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="confirmation" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Confirmation</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many are <span className="uppercase">not yet Confirmed?</span></p>
                                                    </label>
                                                    <input name="confirmation" type="number" min="0" id="confirmation" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="marrige" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Marriage</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many couple are <span className="uppercase">not yet married in the church?</span></p>
                                                    </label>
                                                    <input name="marrige" type="number" min="0" id="marrige" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
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
                                                    <input name="no_professional" type="number" min="0" id="no_professional" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-[49%]" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_high_school" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        How many did STOP studying in HIGH SCHOOL?
                                                    </label>
                                                    <input name="no_high_school" type="number" min="0" id="no_high_school" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="no_college" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        How many did STOP studying in COLLEGE?
                                                    </label>
                                                    <input name="no_college" type="number" min="0" id="no_college" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
                                                </div>  
                                            </div>
                                        </div> 

                                        <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                                            <h2 className="uppercase">
                                                Others
                                            </h2>
                                            <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="w-full">
                                                    <label htmlFor="lumon" className="block mb-2 text-sm font-medium capitalize">Lumon</label>
                                                    <input name="lumon" type="number" min="0" id="lumon" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="living_condition" className="block mb-2 text-sm font-medium capitalize">living condition</label>
                                                    <select name="living_condition" id="living_condition" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required >
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
                                                    <textarea name="comment" rows={5} id="comment" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" ></textarea>
                                                </div>  
                                            </div>
                                        </div>       
                                        <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-gray-700">{"Submit"}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
        </>
    )
}