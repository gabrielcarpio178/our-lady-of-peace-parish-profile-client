import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { userData, api_link } from '../../../../api_link';
import { useOutletContext } from 'react-router-dom';

type TOutLetCon = {
    family_name: string,
    oname: string,
    ooccupation: string,
    mname: string,
    moccupation: string,
    catholic_member: string,
    household_member: string,
    barangay_id: string,
    bec_id: string
}

export default function Sick() {
    const data_info: TOutLetCon = useOutletContext();
    const [barangayList, setBarangayList] = useState([])
    const [becList, setBecList] = useState([]);
    const [bec, getBEC] = useState("")
    const [family_name, setfamily_name] = useState("")
    const [husband_name, sethusband_name] = useState("")
    const [wife_name, setwife_name] = useState("")
    const [husband_occupation, sethusband_occupation] = useState("")
    const [wife_occupation, setwife_occupation] = useState("")
    const [household_member, sethousehold_member] = useState("")
    const [catholic_member, setcatholic_member] = useState("")
    const [barangay_id, setbarangay_id] = useState(0)

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
            if(!data_info){
                getBEClist(data[0].id)
            }
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
            setbarangay_id(id)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getBarangayList()
    },[])
    useEffect(() => {
        if (data_info) {
            setfamily_name(data_info.family_name)
            sethusband_name(data_info.oname)
            sethusband_occupation(data_info.ooccupation)
            setwife_name(data_info.mname)
            setwife_occupation(data_info.moccupation)
            sethousehold_member(data_info.household_member.toString())
            setcatholic_member(data_info.catholic_member.toString())
            getBEClist(parseInt(data_info.barangay_id))
            setbarangay_id(parseInt(data_info.barangay_id))
        }
    }, [data_info])

    
    return (
        <>
            <div className="w-full">
                <label htmlFor="family_name" className="block mb-2 text-sm font-medium capitalize">family name</label>
                <input value={family_name} onChange={e=>setfamily_name(e.target.value)} name="family_name" type="text" id="family_name" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" />
            </div>
            <div className="w-full">
                <label htmlFor="husband_name" className="block mb-2 text-sm font-medium capitalize">Husband Name</label>
                <input value={husband_name} onChange={e=>sethusband_name(e.target.value)} name="husband_name" type="text" id="husband_name" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" />
            </div>
            <div className="w-full">
                <label htmlFor="husband_occupation" className="block mb-2 text-sm font-medium capitalize">husband occupation</label>
                <input value={husband_occupation} onChange={e=>sethusband_occupation(e.target.value)} name="husband_occupation" type="text" id="husband_occupation" list='husband_occupationList' className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white"  />
                <datalist id={'husband_occupationList'}>
                    {["OFW","Pensioner"].map((name: string)=>{
                        return (<option key={name} value={name}>{name}</option>)
                    })}
                </datalist>
            </div>
            <div className="w-full">
                <label htmlFor="wife_name" className="block mb-2 text-sm font-medium capitalize">wife Name</label>
                <input value={wife_name} onChange={e=>setwife_name(e.target.value)} name="wife_name" type="text" id="wife_name" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" />
            </div>
            <div className="w-full">
                <label htmlFor="wife_occupation" className="block mb-2 text-sm font-medium capitalize">wife occupation</label>
                <input name="wife_occupation" type="text" id="wife_occupation" list='wife_occupationList' value={wife_occupation} onChange={e=>setwife_occupation(e.target.value)} className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full text-white" />
                <datalist id={'wife_occupationList'}>
                    {["OFW","Pensioner"].map((name: string)=>{
                        return (<option key={name} value={name}>{name}</option>)
                    })}
                </datalist>
            </div>
            <div className="w-full">
                <label htmlFor="no_catholic" className="block mb-2 text-sm font-medium capitalize">no. of household members</label>
                <input value={household_member} onChange={e=>sethousehold_member(e.target.value)} name="no_catholic" type="number" min="0" id="no_catholic" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
            </div>
            <div className="w-full">
                <label htmlFor="no_catholic_residence" className="block mb-2 text-sm font-medium capitalize">No. of catholic residing</label>
                <input value={catholic_member} onChange={e=>setcatholic_member(e.target.value)} name="no_catholic_residence" type="number" min="0" id="no_catholic_residence" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required />
            </div>
            <div className="w-full">
                <label htmlFor="barangay" className="block mb-2 text-sm font-medium capitalize">barangay</label>
                <select name="barangay" id="barangay" className="border text-sm rounded-lg focus:ring-gray-700 block p-2.5 bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-gray-700 w-full" required value={barangay_id.toString()} onChange={(e:any)=>{getBEClist(e.target.value)}}>
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
        </>
    )
}
