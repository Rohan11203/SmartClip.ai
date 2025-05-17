import { Navigate, Outlet } from "react-router-dom";

export default  function PrivateRoute(){
    const isAuth = localStorage.getItem("isAuth");

        return isAuth === "true" ? <Outlet /> : <Navigate to={"/"} replace/>
}