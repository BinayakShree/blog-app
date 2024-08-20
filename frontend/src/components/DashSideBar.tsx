import { Sidebar } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IoIosCreate } from "react-icons/io";
import { MdDashboard } from "react-icons/md";

export default function DashSideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setTab(urlParams.get("tab") || "profile");
  }, [location.search]);
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/logout"
      );
      if (res.data.success) {
        dispatch(logoutSuccess());
        navigate("/sign-in");
      }
    } catch {
      return;
    }
  };
  return (
    <div className="h-full">
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor={"dark"}
              onClick={() => {
                navigate("/dashboard?tab=profile");
              }}
              className="cursor-pointer"
            >
              Profile
            </Sidebar.Item>

            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Sidebar.Item>
            {currentUser?.isAdmin && (
              <div>
                <div className="my-4 h-px bg-gray-200 dark:bg-gray-700"></div>
                <h4 className="text-center font-semibold">Admin Features</h4>
              </div>
            )}
                  {currentUser?.isAdmin && (
              <Sidebar.Item
                active={tab === "admin-dashboard"}
                icon={MdDashboard}
                onClick={() => {
                  navigate("/dashboard?tab=admin-dashboard");
                }}
                className="cursor-pointer"
              >
                Dashboard
              </Sidebar.Item>
            )}
            {currentUser?.isAdmin && (
              <Sidebar.Item
                active={tab === "create-post"}
                icon={IoIosCreate}
                onClick={() => {
                  navigate("/dashboard?tab=create-post");
                }}
                className="cursor-pointer"
              >
                Create a post
              </Sidebar.Item>
            )}
            {currentUser?.isAdmin && (
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                onClick={() => {
                  navigate("/dashboard?tab=posts");
                }}
                className="cursor-pointer"
              >
                Posts
              </Sidebar.Item>
            )}
            {currentUser?.isAdmin && (
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                onClick={() => {
                  navigate("/dashboard?tab=users");
                }}
                className="cursor-pointer"
              >
                Users
              </Sidebar.Item>
            )}
            {currentUser?.isAdmin && (
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                onClick={() => {
                  navigate("/dashboard?tab=comments");
                }}
                className="cursor-pointer"
              >
                Comments
              </Sidebar.Item>
            )}
      
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
