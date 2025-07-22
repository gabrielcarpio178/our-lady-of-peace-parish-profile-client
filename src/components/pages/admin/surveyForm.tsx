import { useState } from "react";
import AdminHeader from "./adminHeader";
import MyAppNav from "./adminNav";
import axios from "axios";
import { userData, api_link } from "../../../api_link";
import BounceLoader from "react-spinners/BounceLoader";
import Swal from "sweetalert2";
import 'animate.css'
import Basic_infoForm from "./subpage/Basic_infoForm";
import { useSearchParams } from 'react-router-dom';
export default function SurveyForm(){
    const [isLoading, setLoading] = useState(false)
    const [searchParams] = useSearchParams();

    const checkNames = (husband_name: string, wife_name: string)=>{
        return !(husband_name === '' && wife_name === '');
    } 

    const addHousehold = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const user_id = userData().user.id
        const formData = new FormData(e.currentTarget)
        const formValues = {
            user_id: user_id,
            life_status: searchParams.get('life_status'),
            baptism: formData.get("baptism") as string,
            barangay: formData.get("barangay") as string,
            bec_id: formData.get("bec_id") as string,
            comment: formData.get("comment") as string,
            confirmation: formData.get("confirmation") as string,
            family_name: formData.get("family_name") as string,
            living_condition: formData.get("living_condition") as string,
            marrige: formData.get("marrige") as string,
            mass_attendants: formData.get("mass_attendants") as string,
            no_catholic: formData.get("no_catholic") ?? 0,
            no_catholic_residence: formData.get("no_catholic_residence") ?? 0,
            no_college: formData.get("no_college") as string,
            no_high_school: formData.get("no_high_school") as string,
            no_professional: formData.get("no_professional") as string,
            moccupation: formData.get("moccupation") as string,
            mname: formData.get("mname") as string,
            husband_name: formData.get("husband_name") as string,
            husband_occupation: formData.get("husband_occupation") as string,
            wife_name: formData.get("wife_name") as string,
            wife_occupation: formData.get("wife_occupation") as string,
            lumon: formData.get('lumon') as string
        }


        setLoading(false)
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
        if(searchParams.get('life_status')==='sick'||searchParams.get('life_status')==''){
            if(!checkNames(formValues.husband_name, formValues.wife_name)){
                Swal.fire({
                    position: "center",
                    title: `Please Add Name`,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1000,
                })
                setLoading(false);
                return;
            }
        }
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
                title: `Add Successfully`,
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
            {isLoading&&
            <div className='absolute bg-black/50 z-40 w-full h-full'>
                {/* how to make this first layer of the screen */}
                <div  className='flex items-center justify-center w-full h-full'>
                    <BounceLoader color='#ffffff' size={120}/>
                </div>
            </div>    
            } 
            <MyAppNav/>
            <div className='flex flex-col m-0 md:ml-[16%] text-white bg-[#86ACE2] py-1'>
                    {/* add this to a file content */}
                    <div className='text-white w-full md:mt-0 mt-10 px-10'>
                        {/* content here */}
                        <div className='flex flex-col w-full h-full'>
                            <div className='w-full flex flex-row'>
                                <AdminHeader/>
                            </div>
                            <div className='w-full flex flex-row'>
                                <div className='w-full flex flex-col md:px-10 px-0 animate__animated animate__fadeIn'>
                                    <div className="">
                                        <h2 className='text-2xl text-black opacity-[50%]'>
                                            Add Household Information
                                        </h2>
                                        <p>This form is execlusively for encoders to filled out. If there is no information for a field, please input 0(zero)</p>
                                    </div>
                                    <form className="flex flex-col mt-8 text-black gap-y-4" onSubmit={addHousehold}>
                                        <Basic_infoForm/>
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
                                                    <label htmlFor="living_condition" className="block mb-2 text-sm font-medium capitalize">living condition</label>
                                                    <select name="living_condition" id="living_condition" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required >
                                                        <option value="upper class">Upper Class</option>
                                                        <option value="middle class">Middle Class</option>
                                                        <option value="poor">Poor</option>
                                                        <option value="very poor">Very poor</option>
                                                    </select>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="lumon" className="block mb-2 text-sm font-medium capitalize">Lumon</label>
                                                    <input name="lumon" type="number" min="0" id="lumon" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
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