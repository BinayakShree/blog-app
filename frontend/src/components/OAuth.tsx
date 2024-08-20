import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const response = await axios.post(
        "https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/google",
        {
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          profilePicture: resultFromGoogle.user.photoURL,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(signinSuccess(response.data.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        type="button"
        gradientDuoTone="pinkToOrange"
        outline
        onClick={handleGoogleClick}
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2"></AiFillGoogleCircle>
        Continue with Google
      </Button>
    </div>
  );
}
