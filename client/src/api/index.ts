import axios from "axios";
axios.defaults.withCredentials = true;

export const BACKEND_URL = "https://smartclip.duckdns.org"
interface AuthDataInterface{
    username?: string;
    email: string;
    password: string;
}
export async function onSignup(data:AuthDataInterface) {
    console.log("Signup data:", data);
        return await axios.post(`${BACKEND_URL}/api/v1/users/signup`, data);
    } 

export async function onSignin(data:AuthDataInterface) {
        return await axios.post(`${BACKEND_URL}/api/v1/users/signin`, data);
}


export async function onLogout() {
    return await axios.post(`${BACKEND_URL}/api/v1/users/logout`)
}