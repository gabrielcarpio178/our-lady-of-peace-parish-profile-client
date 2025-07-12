import { useEffect, useState } from "react";
import AdminHeader from "./adminHeader";
import MyAppNav from "./adminNav";
import axios from "axios";
import { userData, api_link } from "../../../api_link";
import BounceLoader from "react-spinners/BounceLoader";
import Swal from "sweetalert2";
import { useParams, useSearchParams } from 'react-router-dom';
import 'animate.css'
import Basic_infoForm from "./subpage/Basic_infoForm";
export default function EditSurveyForm(){
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [barangayList, setBarangayList] = useState([])
    const [becList, setBecList] = useState([]);
    const [isLoading, setLoading] = useState(false)
    const [family_name, setfamily_name] = useState("")
    const [oname, sethusband_name] = useState("")
    const [mname, setwife_name] = useState("")
    const [ooccupation, sethusband_occupation] = useState("")
    const [moccupation, setwife_occupation] = useState("")
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
    const [lumon, setlumon] = useState("")

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
            sethusband_name(user.oname ?? "")
            setwife_name(user.mname ?? "")
            sethusband_occupation(user.ooccupation ?? "")
            setwife_occupation(user.moccupation ?? "")
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
            setlumon(user.lumon ?? "");
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
            life_status: searchParams.get('life_status'),
            baptism: formData.get("baptism"),
            barangay: formData.get("barangay"),
            bec_id: formData.get("bec_id"),
            comment: formData.get("comment"),
            confirmation: formData.get("confirmation"),
            family_name: formData.get("family_name"),
            living_condition: formData.get("living_condition"),
            marrige: formData.get("marrige"),
            mass_attendants: formData.get("mass_attendants"),
            no_catholic: formData.get("no_catholic"),
            no_catholic_residence: formData.get("no_catholic_residence"),
            no_college: formData.get("no_college"),
            no_high_school: formData.get("no_high_school"),
            no_professional: formData.get("no_professional"),
            moccupation: formData.get("moccupation"),
            mname: formData.get("mname"),
            husband_name: formData.get("husband_name"),
            husband_occupation: formData.get("husband_occupation"),
            wife_name: formData.get("wife_name"),
            wife_occupation: formData.get("wife_occupation"),
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

        try {
            const token = userData().token;
            const res = await axios.put(`${api_link()}/editHousehold`, formValues, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status === 200) {
                Swal.fire({
                    position: "center",
                    title: `Update Successfully`,
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
            {isLoading&&
            <div className='absolute bg-black/50 z-40 w-full h-full'>
                <div  className='flex items-center justify-center w-full h-full'>
                    <BounceLoader color='#ffffff' size={120}/>
                </div>
            </div>    
            } 
            <MyAppNav/>
            {/* add this to a file content */}
            <div className='flex flex-col m-0 md:ml-[16%] text-white bg-[#86ACE2] py-1'>
                {/* add this to a file content */}
                <div className='text-white w-full md:mt-0 mt-10'>
                    {/* content here */}
                    <div className='flex flex-col w-full h-full'>
                        <div className='w-full flex flex-row'>
                            <AdminHeader/>
                        </div>
                        <div className='w-full flex flex-row'>
                            <div className='w-full flex flex-col px-10  animate__animated animate__fadeIn'>
                                <div className="">
                                    <h2 className='text-2xl text-black opacity-[50%]'>
                                        Edit Household Information
                                    </h2>
                                    <p>This form is execlusively for encoders to filled out. If there is no information for a field, please input 0(zero)</p>
                                </div>
                                <form className="flex flex-col mt-8 text-black gap-y-4" onSubmit={addHousehold}>
                                    <Basic_infoForm data_info={{ family_name, oname, ooccupation, mname, moccupation, catholic_member, household_member, barangay_id, bec_id}}/>
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
                                                <input name="baptism" type="number" min="0" id="baptism" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={baptism} onChange={e=>setbaptism(e.target.value)} />
                                            </div>  
                                            <div className="w-full">
                                                <label htmlFor="confirmation" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                    <div>Confirmation</div>
                                                    <p className="capitalize text-[0.7rem] opacity-70">How many are <span className="uppercase">not yet Confirmed?</span></p>
                                                </label>
                                                <input name="confirmation" type="number" min="0" id="confirmation" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={confirmation} onChange={e=>setconfirmation(e.target.value)} />
                                            </div>  
                                            <div className="w-full">
                                                <label htmlFor="marrige" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                    <div>Marriage</div>
                                                    <p className="capitalize text-[0.7rem] opacity-70">How many couple are <span className="uppercase">not yet married in the church?</span></p>
                                                </label>
                                                <input name="marrige" type="number" min="0" id="marrige" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={marriage} onChange={e=>setmarriage(e.target.value)} />
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
                                                <input name="no_professional" type="number" min="0" id="no_professional" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required value={professional} onChange={e=>setprofessional(e.target.value)} />
                                            </div>
                                            <div className="w-full">
                                                <label htmlFor="no_high_school" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                    How many did STOP studying in HIGH SCHOOL?
                                                </label>
                                                <input name="no_high_school" type="number" min="0" id="no_high_school" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={high_school} onChange={e=>sethigh_school(e.target.value)} />
                                            </div>  
                                            <div className="w-full">
                                                <label htmlFor="no_college" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                    How many did STOP studying in COLLEGE?
                                                </label>
                                                <input name="no_college" type="number" min="0" id="no_college" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={college} onChange={e=>setcollege(e.target.value)} />
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
                                                <label htmlFor="living_condition" className="block mb-2 text-sm font-medium capitalize">living condition</label>
                                                <select name="living_condition" id="living_condition" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required value={living_condition} onChange={e=>setliving_condition(e.target.value)}>
                                                    <option value="upper class">Upper Class</option>
                                                    <option value="middle class">Middle Class</option>
                                                    <option value="poor">Poor</option>
                                                    <option value="very poor">Very poor</option>
                                                </select>
                                            </div>
                                            <div className="w-full">
                                                <label htmlFor="lumon" className="block mb-2 text-sm font-medium capitalize">Lumon</label>
                                                <input name="lumon" type="number" min="0" id="lumon" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" value={lumon} onChange={e=>setlumon(e.target.value)} required />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="comment" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                    Comments
                                                </label>
                                                <textarea name="comment" rows={5} id="comment" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" onChange={e=>setcomment(e.target.value)} value={comment}></textarea>
                                            </div>  
                                        </div>
                                    </div>       
                                    <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" disabled={!bec_id}>{"Save"}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
        </>
    )
}