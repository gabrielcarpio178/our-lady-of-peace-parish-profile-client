import { useEffect, useState } from "react"
import { userData } from "../../../api_link"


export default function AdminHeader(){
    const [firstname, setfirstname] = useState("") 
    const [lastname, setlastname] = useState("") 

    useEffect(()=>{
        const user = userData().user
        setfirstname(user.firstname)
        setlastname(user.lastname)
    },[])

    return (
        <div className='w-full flex items-center justify-end md:text-2xl md:p-10 p-5 font-bold'>
            Current user: <span className="capitalize md:pl-4">{firstname+" "+lastname}</span> 
        </div>
    )
}