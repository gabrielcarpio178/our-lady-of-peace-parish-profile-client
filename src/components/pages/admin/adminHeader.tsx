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
        <div className='w-full flex items-center justify-end text-2xl p-10 font-bold'>
            Current user: <span className="capitalize pl-4">{firstname+" "+lastname}</span> 
        </div>
    )
}