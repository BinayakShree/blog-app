import { useNavigate } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import HomePosts from "../components/HomePosts";
import HomeTop from "../components/HomeTop";


export default function Home() {
const navigate = useNavigate();
  return (
    <div className="w-full">
      <HomeTop/>
      
  
      <HomePosts/>
      <button onClick={()=>{navigate('/search')}} className="hover:underline font-semibold mt-6 text-teal-500 mx-auto w-full h-full">
        View More
      </button>
    <div className="mt-10">
    <CallToAction/>
    </div>
      
      </div>
  )
}
