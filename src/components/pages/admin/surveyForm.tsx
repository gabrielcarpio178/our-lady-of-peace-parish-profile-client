import { useEffect, useState } from "react";
import AdminHeader from "./adminHeader";
import MyAppNav from "./adminNav";
import axios from "axios";
import { userData, api_link } from "../../../api_link";

export default function SurveyForm(){
    const [barangayList, setBarangayList] = useState([])
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
                    {/* add this to a file content */}
                    <div className='w-[80%] h-screen bg-[#86ACE2] text-white'>
                        {/* content here */}
                        <div className='flex flex-col w-full h-full'>
                            <div className='w-full h-[12.7%] flex flex-row'>
                                <AdminHeader/>
                            </div>
                            <div className='w-full h-[87.3%] flex flex-row overflow-y-scroll'>
                                <div className='w-full flex flex-col px-10'>
                                    <div className="">
                                        <h2 className='text-2xl text-black opacity-[50%]'>
                                            Add Household Information
                                        </h2>
                                        <p>This form is execlusively for encoders to filled out. If there is no information for a field, please input 0(zero)</p>
                                    </div>
                                    <form className="flex flex-col mt-8 text-black gap-y-4">

                                        <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                                            <h2 className="uppercase">
                                                Basic Information
                                            </h2>
                                            <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                                            <div className="grid grid-cols-2 mt-2 gap-5">
                                                <div className="col-span-2">
                                                    <label htmlFor="family_name" className="block mb-2 text-sm font-medium capitalize">family name</label>
                                                    <input name="family_name" type="text" id="family_name" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="husband_name" className="block mb-2 text-sm font-medium capitalize">Husband name</label>
                                                    <input name="husband_name" type="text" id="husband_name" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="occupation_husband" className="block mb-2 text-sm font-medium capitalize">occupation</label>
                                                    <input name="occupation_husband" type="text" id="occupation_husband" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="wife_name" className="block mb-2 text-sm font-medium capitalize">Wife Name</label>
                                                    <input name="wife_name" type="text" id="wife_name" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="occupation_wife" className="block mb-2 text-sm font-medium capitalize">occupation</label>
                                                    <input name="occupation_wife" type="text" id="occupation_wife" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_catholic" className="block mb-2 text-sm font-medium capitalize">no. of members</label>
                                                    <input name="no_catholic" type="number" id="no_catholic" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_catholic_residence" className="block mb-2 text-sm font-medium capitalize">No. of catholic residence</label>
                                                    <input name="no_catholic_residence" type="number" id="no_catholic_residence" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="barangay" className="block mb-2 text-sm font-medium capitalize">barangay</label>
                                                    <select name="barangay" id="barangay" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required >
                                                        {barangayList.map((brgy: any)=>{
                                                            return(<option value={brgy.id} key={brgy.id}>{brgy.name}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="address" className="block mb-2 text-sm font-medium capitalize">Address</label>
                                                    <input name="address" type="text" id="address" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="has_lumon" className="block mb-2 text-sm font-medium capitalize">Has Lumon</label>
                                                    <select name="has_lumon" value={0} id="has_lumon" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required >
                                                        <option value="1">Yes</option>
                                                        <option value="0">No</option>
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
                                                    <select name="mass_attendants" id="mass_attendants" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required >
                                                        <option value="daily" className="capitalize">Daily</option>
                                                        <option value="every sunday" className="capitalize">Every sunday</option>
                                                        <option value="monthly" className="capitalize">Monthly</option>
                                                        <option value="occasionally" className="capitalize">Occasionally</option>
                                                        <option value="don't attend mass" className="capitalize">Don't attend mass</option>
                                                    </select>
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="baptism" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Babtism</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many are <span className="uppercase">not yet baptized?</span></p>
                                                    </label>
                                                    <input name="baptism" type="number" id="baptism" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="confirmation" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Confirmation</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many are <span className="uppercase">not yet Confirmed?</span></p>
                                                    </label>
                                                    <input name="confirmation" type="number" id="confirmation" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="marrige" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        <div>Marriage</div>
                                                        <p className="capitalize text-[0.7rem] opacity-70">How many couple are <span className="uppercase">not yet married in the church?</span></p>
                                                    </label>
                                                    <input name="marrige" type="number" id="marrige" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
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
                                                    <input name="no_professional" type="number" id="no_professional" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="no_high_school" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        How many did STOP studying in HIGH SCHOOL?
                                                    </label>
                                                    <input name="no_high_school" type="number" id="no_high_school" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
                                                </div>  
                                                <div className="w-full">
                                                    <label htmlFor="no_college" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        How many did STOP studying in COLLEGE?
                                                    </label>
                                                    <input name="no_college" type="number" id="no_college" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" required />
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
                                                    <select name="living_condition" id="living_condition" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-[49%]" required >
                                                        <option value="upper class">Upper Class</option>
                                                        <option value="middle class">Middle Class</option>
                                                        <option value="poor">Poor</option>
                                                        <option value="very poor">Very poor</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="no_college" className="mb-2 text-sm font-medium capitalize flex flex-col">
                                                        Comments
                                                    </label>
                                                    <textarea name="no_college" rows={5} id="no_college" className="border text-sm rounded-lg focus:ring-blue-500 block p-2.5 bg-[#86ACE2] border-gray-600 placeholder-gray-400 focus:border-blue-500 w-full" ></textarea>
                                                </div>  
                                            </div>
                                        </div>       
                                        <button type="submit" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">{"Submit"}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
        </>
    )
}