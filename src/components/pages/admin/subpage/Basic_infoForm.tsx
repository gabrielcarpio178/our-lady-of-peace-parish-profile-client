import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';

type TbtnContent = {
    to: string,
    name: string
}


type TbasicInform = {
    family_name: string,
    oname: string,
    ooccupation: string,
    mname: string,
    moccupation: string,
    catholic_member: string,
    household_member: string,
    barangay_id: string,
    bec_id: string,

}

interface IbasicInform{
    data_info? : TbasicInform
}

export default function Basic_infoForm({data_info}: IbasicInform) {

    const [searchParams] = useSearchParams();
    const life_status = searchParams.get('life_status');
    const navigate = useNavigate();
    const btnContent: TbtnContent[] = [
        {to: "sick?life_status=sick", name:"sick"},
        {to: "single?life_status=single", name:"single"},
        {to: "living alone?life_status=living alone", name:"living alone"},
        {to: "widowed?life_status=widowed", name:"widowed"},
        {to: "widower?life_status=widower", name:"widower"},
    ]

    function navigateData(isToggle: boolean, link: string){
        if(isToggle){
            navigate("sick?life_status=");
        }else{
            navigate(link);
        }
    }
    return (
        <> 
            <div className="w-full bg-white p-5 rounded-lg shadow-2xl">
                <h2 className="uppercase">
                    Basic Information
                </h2>
                <div className="w-full h-[0.5vh] bg-black opacity-50 mt-2"></div>
                <div className="grid md:grid-cols-2 mt-2 gap-5">
                    <div className="w-full">
                        <div className="block mb-2 text-sm font-medium capitalize">Life Status</div>
                        <div className='w-full flex flex-col md:flex-row items-center gap-3'>
                            {btnContent.map((data: TbtnContent)=>{
                                return (
                                    <button onClick={()=>navigateData(life_status===data.name, data.to)} type='button' className={`${life_status===data.name?"bg-slate-600 text-white ":"text-black "}`+"shadow-sm p-2 rounded-lg hover:bg-slate-600 hover:text-white w-full md:w-[20%] text-center capitalize cursor-pointer"} key={data.name}>{data.name}</button>
                                )
                            })}
                        </div>
                    </div>
                    <Outlet context={data_info}/>
                </div>
            </div>
        </>
    )
}


