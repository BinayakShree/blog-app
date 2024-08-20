import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";


export default function CallToAction() {
  const navigate=useNavigate()
  return (
    <div className="flex flex-col lg:flex-row p-6 bg-teal-50 dark:bg-gray-900 border border-teal-300 dark:border-teal-700 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex-1 flex flex-col justify-center p-6">
        <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-200 mb-4">
          Want to access premium blogs?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sign up today for exclusive access to my premium blogs and stay
          updated with the latest insights and trends.
        </p>
          <Button
            className="transition-transform transform hover:scale-105 rounded-lg w-1/3 whitespace-nowrap"
            gradientDuoTone="purpleToPink"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up Now
          </Button>
   
      </div>
      <div className="flex-1 flex justify-center items-center p-6 ">
        <img
          src="https://avatars.githubusercontent.com/u/146093014?v=4&size=256"
          alt="Premium Content"
          className="rounded-full shadow-md hidden sm:inline"
        />
      </div>
    </div>
  );
}
