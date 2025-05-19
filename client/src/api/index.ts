import axios from "axios";
axios.defaults.withCredentials = true;

interface AuthDataInterface{
    username?: string;
    email: string;
    password: string;
}
export async function onSignup(data:AuthDataInterface) {
    console.log("Signup data:", data);
        return await axios.post("http://localhost:3000/api/v1/users/signup", data);
    } 

export async function onSignin(data:AuthDataInterface) {
        return await axios.post("http://localhost:3000/api/v1/users/signin", data);
}

export async function getUserVideos() {
    return await axios.get("http://localhost:3000/api/v1/users/userVideos")
}

export async function onLogout() {
    return await axios.post("http://localhost:3000/api/v1/users/logout")
}