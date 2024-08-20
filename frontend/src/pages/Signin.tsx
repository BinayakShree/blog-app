import axios from "axios";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signinFailure,
  signinStart,
  signinSuccess,
} from "../redux/user/userSlice";
import { RootState } from "../redux/store";
import OAuth from "../components/OAuth";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function Signin() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signinFailure("All fields are required"));
      return;
    }
    try {
      dispatch(signinStart());
      const response = await axios.post(
        "https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/signin",
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(signinSuccess(response.data.data));
        navigate("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        let msg = "Internal Server Error";
        if (err.response) {
          if (err.response.data.error.email?._errors?.length > 0) {
            msg = err.response.data.error.email._errors[0];
          } else if (err.response.data.error.password?._errors?.length > 0) {
            msg = err.response.data.error.password._errors[0];
          } else if (err.response.data?.error.length > 0) {
            msg = err.response.data.error;
          }
        }
        dispatch(signinFailure(msg));
        return;
      } else {
        dispatch(signinFailure("An unexpected error occurred."));
        return;
      }
    }
  };

  useEffect(() => {
    dispatch(signinFailure(null));
  }, [dispatch]);
  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* For left Side */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              BinayakShree
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Signin back to get access to your account
          </p>
        </div>
        {/* For Right Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                id="email"
                type="email"
                placeholder="example@gmail.com"
                onChange={handleInputBox}
                required
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                id="password"
                type="password"
                placeholder="***********"
                onChange={handleInputBox}
                required
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm"></Spinner>
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Signin"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont't Have an Account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Signup
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
