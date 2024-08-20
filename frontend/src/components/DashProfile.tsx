import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutSuccess,
  updateFailure,
  updateStart,
  updateSucess,
} from "../redux/user/userSlice";
import axios from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface FormData {
  username?: string;
  email?: string;
  profilePicture?: string;
  password?: string;
}

export default function DashProfile() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { error, loading } = useSelector((state: RootState) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileURL, setImageFileURL] = useState<string | null>(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const [imageFileUploading, setImageFileUploading] = useState<boolean>(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({});
  const [showModel, setShowModel] = useState<boolean>(false);
  const filePickerRef = useRef<HTMLInputElement>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoursDiff, setHoursDiff] = useState<number>(0);
  useEffect(() => {
    const checkUpdateEligibility = () => {
      dispatch(updateFailure(null));
      dispatch(deleteUserFailure(null));

      if (!currentUser?.updatedAt) return;

      const lastUpdated = new Date(currentUser.updatedAt);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdated.getTime();
      const hoursDifference = timeDiff / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        dispatch(updateFailure("Please wait 24 hours to update your profile"));
      } else {
        dispatch(updateFailure(null));
      }

      setHoursDiff(hoursDifference);
    };

    checkUpdateEligibility();
  }, [currentUser?.updatedAt, dispatch]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateFailure(null));
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      dispatch(updateFailure("No changes made"));
      return;
    }
    if (imageFileUploading) {
      dispatch(updateFailure("Image uploading in progress"));
      return;
    }
    try {
      dispatch(updateStart());
      const response = await axios.put(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/update/${currentUser?.id}`,
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(updateSucess(response.data.data));
        setUpdateUserSuccess("User Profile Updated Successfully");
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
        dispatch(updateFailure(msg));
        return;
      } else {
        dispatch(updateFailure("An unexpected error occurred."));
        return;
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(e.target.files[0]));
      setImageFileUploadError(null);
    }
  };
  const uploadImage = useCallback(async () => {
    if (!imageFile) return;
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(parseInt(progress.toFixed(0)));
      },
      () => {
        setImageFileUploadError(
          "Couldn't upload image. Please verify that your image is less than 2MB & try again"
        );
        setImageFileUploadingProgress(0);
        setImageFileURL(null);
        setImageFile(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  }, [imageFile]);
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile, uploadImage]);

  const handleDeleteAccount = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/delete/${currentUser?.id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(deleteUserSuccess());
        navigate("/sign-in");
      }
      dispatch(deleteUserFailure("Failed to delete user"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(deleteUserFailure("Failed to delete user"));
    }
  };
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
      dispatch(deleteUserFailure("Failed to logout"));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef as React.RefObject<HTMLInputElement>}
          hidden
          disabled={hoursDiff < 24 ? true : false}
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => {
            filePickerRef.current?.click();
          }}
        >
          {imageFileUploadingProgress > 0 &&
            imageFileUploadingProgress < 100 && (
              <CircularProgressbar
                value={imageFileUploadingProgress}
                text={`${imageFileUploadingProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62,152,199,${
                      imageFileUploadingProgress / 100
                    })`,
                  },
                }}
              />
            )}
          <img
            src={imageFileURL || currentUser?.profilePicture}
            alt="user_image"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading || hoursDiff < 24}
        >
          {loading ? "Loading..." : "Update Profile"}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleLogout} className="cursor-pointer">
          Logout
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          </div>
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 text-center">
            Are you sure you want to delete your account?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteAccount}>
              Yes I'm sure!
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
