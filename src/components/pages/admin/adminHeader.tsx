

export default function AdminHeader(){
    const localData = localStorage.getItem("user")
    const user = JSON.parse(localData?localData:"")
    
    return (
        <div className='w-full flex items-center justify-end text-2xl p-10 font-bold'>
            Current user: <span className="capitalize pl-4">{user.user.firstname+" "+user.user.lastname}</span> 
        </div>
    )
}