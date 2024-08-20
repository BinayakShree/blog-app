import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function HomeTop() {
  const navigate=useNavigate()
  return (
    <div className="mx-auto flex flex-col md:flex-row items-center justify-between p-10 min-h-screen bg-gray-50 dark:bg-[rgb(16,23,42)]">
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 dark:text-gray-200">
          Hi, I'm <span className="text-teal-600">BinayakShree</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-400 mb-6">
          A passionate teen developer who loves to build cool stuff.
        </p>
        <div className="flex justify-center md:justify-start gap-4 flex-col sm:flex-row">
          <button onClick={()=>navigate('/search')} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300">
            Check out Blog
          </button>
          <button onClick={()=>navigate('/about')} className="flex flex-row items-center justify-center px-6 py-2 border border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-600 hover:text-white transition duration-300">
            About Me <span className="ml-2"><FiArrowUpRight/></span>
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative md:w-1/2 flex items-center justify-center mt-0 sm:mt-10 md:mt-0">
        <img
          src="https://avatars.githubusercontent.com/u/146093014?v=4"
          alt="Profile"
          className="w-60 h-60 md:w-80 md:h-80 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute -top-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-teal-600 rounded-full flex items-center justify-center">
          <img
            src="https://pbs.twimg.com/profile_images/1825443531600830464/wzIb5lOJ.jpg"
            alt="Circle Image 1"
            className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-full"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 md:w-32 md:h-32 bg-teal-600 rounded-full flex items-center justify-center">
          <img
            src="https://scontent.fktm21-1.fna.fbcdn.net/v/t39.30808-6/345880389_701420018449872_6566163613955409241_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=BC7YGrsxoEAQ7kNvgHi6N_O&_nc_ht=scontent.fktm21-1.fna&oh=00_AYDWAgSWvr8kr78W1uDNl51G9BpkjKCTuS3DJOEiAypBJA&oe=66C8BDD5"
            alt="Circle Image 2"
            className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-full"
          />
        </div>
      </div>
      <div className="hidden absolute bottom-10 left-1/2 transform -translate-x-1/2 sm:flex gap-4">
        <a href="https://www.instagram.com/binayak_shree/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
          <FaInstagram className="w-8 h-8" />
        </a>
        <a href="https://github.com/BinayakShree" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
          <FaGithub className="w-8 h-8" />
        </a>
        <a href="https://www.facebook.com/binayakshree/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          <FaFacebook className="w-8 h-8" />
        </a>
      </div>
    </div>
  );
}
