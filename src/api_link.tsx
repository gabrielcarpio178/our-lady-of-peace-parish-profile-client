export function api_link(){
    return "http://localhost:8080/auth";
};

export function socket_link()
{
    return "http://localhost:8080";
}
export function userData(){
    const user = localStorage.getItem("user")
    return JSON.parse(user||"")
}
