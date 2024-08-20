import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { toggleTheme } from "../redux/theme/themeSlice";
import { logoutSuccess } from "../redux/user/userSlice";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state: RootState) => state?.user);
  const { theme } = useSelector((state: RootState) => state?.theme);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {search} = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    const urlParams= new URLSearchParams(search);
    const searchTermFromURLParams= urlParams.get("searchTerm");
    if(searchTermFromURLParams){
      setSearchTerm(searchTermFromURLParams);
    }
  },[search])
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    //Initialize a Navbar component from flowbite
    <Navbar className="border-b-2">
      {/* Create the Logo */}
      <Link to="/">
        <img
          src="https://avatars.githubusercontent.com/u/146093014?v=4&size=64"
          alt=""
          className="rounded-full"
        />
      </Link>
      {/* Creates the Search Bar */}
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {/* Creates the search button for mobile devices */}
      <Button onClick={() => navigate("/search")} className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      {/* Navbar collapse helps to generate that hamburger icon for mobile devices */}
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>

      {/* Creates the dark mode toggle and sign in button and Navbar toggle is that hamburger icon */}
      <div className="flex gap-2 ">
        <Button
          className="w-12 h-10 "
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user_avatar"
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign in
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
