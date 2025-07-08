export function api_link(){
    return import.meta.env.VITE_APP_API_LNK+"/auth";
};

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