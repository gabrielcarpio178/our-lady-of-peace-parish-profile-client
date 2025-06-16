import { useEffect } from "react";

export function api_link(){
    return "https://our-lady-of-peace-parish-profile-backend.onrender.com/auth";
};

export function socket_link()
{
    return "https://our-lady-of-peace-parish-profile-backend.onrender.com/";
}
export function userData(){
    try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        return {
            user: user ? JSON.parse(user) : null,
            token: token || null,
        };
    } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        return {
            user: null,
            token: null,
        };
    }
}