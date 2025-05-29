
import {Outlet, Navigate } from "react-router-dom"
export default function ProtectedRoutes(){
    const user = localStorage.getItem("user")
    return user?<Outlet/>:<Navigate to="/"></Navigate>
}
