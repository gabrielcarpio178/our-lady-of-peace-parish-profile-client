
import MyAppNav from './adminNav'
import AdminHeader from './adminHeader'

export default function Master_list(){
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
                        <div className='w-full h-[87.3%] flex flex-row'>
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}