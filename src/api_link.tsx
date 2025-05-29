export function api_link(){
    return "http://localhost:8080/auth";
};

export function userData(){
    const user = localStorage.getItem("user")
    return JSON.parse(user||"")
}
