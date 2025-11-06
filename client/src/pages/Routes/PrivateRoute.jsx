import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Cookies from "js-cookie";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  const authCheck = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = Cookies.get("access_token");
    const res = await fetch(`${apiUrl}/api/user/user-auth`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    if (data.check) setOk(true);
    else setOk(false);
  };

  useEffect(() => {
    if (currentUser !== null) authCheck();
  }, [currentUser]);

  return ok ? <Outlet /> : <Spinner />;
}
