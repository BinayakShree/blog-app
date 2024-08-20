import axios from "axios";
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleInputBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage("All fields are required");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await axios.post(
        "https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/signup",
        formData
      );
      setLoading(false);
      if (response.data.success) {
        navigate("/sign-in");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        let msg = "Internal Server Error";
        if (err.response) {
          if (err.response.data.error.email?._errors?.length > 0) {
            msg = err.response.data.error.email._errors[0];
          } else if (err.response.data.error.password?._errors?.length > 0) {
            msg = err.response.data.error.password._errors[0];
          } else if (err.response.data.error.username?._errors?.length > 0) {
            msg = err.response.data.error.username._errors[0];
          } else if (err.response.data?.error.length > 0) {
            msg = err.response.data.error;
          }
        }
        setLoading(false);
        setErrorMessage(msg);
      } else {
        setLoading(false);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };
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
            Signup now for exclusive access to my blog post & latest news
          </p>
        </div>
        {/* For Right Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                onChange={handleInputBox}
                required
              />
            </div>
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
                placeholder="Password"
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
                "Signup"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an Account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Signin
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
