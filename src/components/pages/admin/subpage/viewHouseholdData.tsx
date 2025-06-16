import axios from "axios"
import { IconContext } from "react-icons"
import { MdOutlineCancel } from "react-icons/md"
import Swal from "sweetalert2"
import { userData, api_link } from "../../../../api_link"
import { Link } from "react-router-dom"

interface datauser {
    data: {
        baptism: number, 
        barangay_id: number,
        barangay_name: string,
        bec_id: number,
        bec_name: string,
        comment: string, 
        family_name: string,
        household: number,
        husband_name: string,
        id: number,
        isNotBaptismConfirmation: number,
        living_condition: string,
        marrige: number,
        mass_attendants: string,
        no_catholic_residence: number,
        no_college: number,
        no_high_school: number,
        no_professional: number, 
        occupation_husband: string
        occupation_wife:  string
        wife_name: string,
        lumon: number
    }
    onClose: () => void
    onLoading: ()=>void
}

const ViewHouseholdData: React.FC<datauser> = (props) =>{
    const {data, onClose, onLoading} = props


    const deleteHouseHold = async (id: any) =>{
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = userData().token
                onLoading()
                try {
                    await axios.delete(`${api_link()}/deleteHousehold`,{
                        headers:{
                                'Content-type':'application/x-www-form-urlencoded',
                                "authorization" : `bearer ${token}`,
                            },
                            data: {
                                id: id
                            }
                    })
                    Swal.fire({
                        position: "center",
                        title: `Delete Success`,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1000,
                    }).then(()=>{
                        onLoading()
                        window.location.reload()
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    
    return (
        <>
        <div className='absolute w-full h-full flex items-center justify-center text-white z-1 bg-black/50 p-4'>
            <div className="w-auto md:h-auto h-[80%] md:overflow-y-visible overflow-y-scroll bg-[#86ACE2] border border-black shadow-lg rounded md:mx-0 mx-3 relative p-3">
                <div className='absolute right-2 top-2 cursor-pointer' onClick={onClose}>
                    <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                        <div>
                            <MdOutlineCancel/>
                        </div>
                    </IconContext.Provider> 
                </div>
                <div className="text-2xl font-bold capitalize">
                    Household infomation
                </div>
                <div className="flex flex-col md:flex-row gap-2 text-black mt-2">
                    <div className="bg-white rounded-lg py-2 px-3 w-auto md:w-[25%]">
                        <div className="uppercase">
                            Basic Information
                        </div>
                        <div className="w-full h-1 bg-gray-700">
                            {/* line */}
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                            <div className="col-span-2">
                                <div className="text-sm">
                                    Family Name:
                                </div>
                                <div className="capitalize bg-gray-700 text-white w-[48%] p-1 rounded-sm">
                                    {data.family_name}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    Husband name:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.husband_name}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    Occupation:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.occupation_husband}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    Wife name:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.wife_name}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    Occupation:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.occupation_wife}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="capitalize text-sm">
                                    no. of household members
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.household}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="capitalize text-sm">
                                    No. of catholic residence
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.no_catholic_residence}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="capitalize text-sm">
                                    barangay:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.barangay_name}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="capitalize text-sm">
                                    BEC name:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.bec_name}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg py-2 px-3  w-auto md:w-[25%]">
                        <div className="uppercase">
                            Sacraments
                        </div>
                        <div className="w-full h-1 bg-gray-700">
                            {/* line */}
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                            <div className="col-span-2">
                                <div className="capitalize text-sm">
                                    Mass attendants of family member:
                                </div>
                                <div className="capitalize bg-gray-700 text-white w-[48%] p-1 rounded-sm">
                                    {data.mass_attendants}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    Baptism:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.baptism}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="capitalize text-sm">
                                    Confirmation:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.isNotBaptismConfirmation}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    Marriage
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.marrige}
                                </div>
                            </div>
                        </div>    
                    </div>


                    <div className="bg-white rounded-lg py-2 px-3 w-auto md:w-[25%]">
                        <div className="uppercase">
                            Education
                        </div>
                        <div className="w-full h-1 bg-gray-700">
                            {/* line */}
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                            <div className="col-span-2">
                                <div className="capitailze text-sm">
                                    How many are professional:
                                </div>
                                <div className="capitalize bg-gray-700 text-white w-[48%] p-1 rounded-sm">
                                    {data.no_professional}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    How many did STOP studying in HIGH SCHOOL:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.no_high_school}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm">
                                    How many did STOP studying in COLLEGE:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.no_college}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-lg py-2 px-3 w-auto md:w-[25%]">
                        <div className="uppercase">
                            Others
                        </div>
                        <div className="w-full h-1 bg-gray-700">
                            {/* line */}
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                            <div className="col-span-1">
                                <div className="capitalize text-sm">
                                    Lumon:
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.lumon}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="capitalize text-sm">
                                    living condition
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm w-full">
                                    {data.living_condition}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-sm">
                                    Comment
                                </div>
                                <div className="capitalize bg-gray-700 text-white p-1 rounded-sm">
                                    {data.comment}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row mt-2">
                    <Link to={`/survey_form/${data.id}`} className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 w-full md:w-[50%] text-center">Edit</Link>
                    <button className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-red-800 w-full md:w-[50%]"  onClick={()=>deleteHouseHold(data.id)}>Delete</button>
                </div>
            </div>    
        </div>
        </>
    )
}

export default ViewHouseholdData