import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


export default function UnderMaintenance() {
  const navigate=useNavigate()
  return (
    
<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
<div className="text-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
  <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
    🚧 Under Maintenance
  </h1>
  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
    I am currently working on updating this section. Check back soon for exciting new content!
  </p>
  <img
    src="https://static.vecteezy.com/system/resources/previews/021/666/233/original/3d-illustration-of-website-under-maintenance-website-under-construction-website-maintenance-service-web-development-under-process-3d-rendering-png.png"
    alt="Under Maintenance"
    className="mx-auto mb-6 w-36 h-36"
  />
  <p className="text-sm text-gray-500 dark:text-gray-600">
    Thank you for your patience.
  </p>

  <button onClick={()=>navigate('/')} className="mx-auto mt-6 px-6 py-3 bg-teal-500 text-white rounded-lg shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center">
      <span className="text-lg font-medium">Go to Home</span>
      <BsArrowRight className="ml-2 text-lg" />
    </button>
  
</div>
</div>
  )
}
