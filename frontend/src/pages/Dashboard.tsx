import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import CreatePost from "../components/CreatePost";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");

    if (
      tabParam === "profile" ||
      tabParam === "create-post" ||
      tabParam === "posts" ||
      tabParam === "users" ||
      tabParam === "comments" ||
      tabParam === "admin-dashboard"
    ) {
      setTab(tabParam);
    } else {
      setTab("profile");
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-56 h-full md:h-screen">
        <DashSideBar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "create-post" && <CreatePost />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
      {tab === "admin-dashboard" && <AdminDashboard />}
    </div>
  );
}
