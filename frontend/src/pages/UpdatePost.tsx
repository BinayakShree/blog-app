import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useIsAdmin from "../utils/useIsAdmin";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// Custom Quill modules and formats
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    ["link", "image"],
    [{ "code-block": "code" }],
    ["clean"], // remove formatting button
  ],
};

export default function UpdatePost() {
  interface FormData {
    image?: string;
    title?: string;
    content?: string;
    category?: string;
  }

  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    category: "uncategorized",
    image: "",
  });
  const [customCategory, setCustomCategory] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { postId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    try {
      const fetchPost = async () => {
        const res = await axios.get(
          `https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?postId=${postId}`
        );
        setApiError(null);
        setFormData(res.data.posts[0]);
      };
      fetchPost();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setApiError("Something went wrong");
    }
  }, [isAdmin, navigate, postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(parseInt(progress.toFixed(0)));
        },
        () => {
          setImageUploadError("Image Upload Failed");
          setImageUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(0);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setImageUploadError("Something went wrong");
      setImageUploadProgress(0);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setApiError(null);
      setApiLoading(true);
      const res = await axios.put(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/updatepost/${postId}/${currentUser?.id}`,
        formData,
        { withCredentials: true }
      );
      if (res.data.success) {
        setApiLoading(false);
        setApiError(null);
        navigate(`/post/${res.data.data.slug}`);
      }
    } catch (err: unknown) {
      setApiLoading(false);
      if (axios.isAxiosError(err)) {
        let msg = "Internal Server Error";
        if (err.response) {
          if (err.response.data.error.title?._errors?.length > 0) {
            msg = err.response.data.error.title._errors[0];
          } else if (err.response.data.error.content?._errors?.length > 0) {
            msg = err.response.data.error.content._errors[0];
          } else if (err.response.data.error.category?._errors?.length > 0) {
            msg = err.response.data.error.category._errors[0];
          } else if (err.response.data.error.image?._errors?.length > 0) {
            msg = err.response.data.error.image._errors[0];
          } else if (err.response.data?.error.length > 0) {
            msg = err.response.data.error;
          }
        }
        setApiError(msg);
        return;
      } else {
        setApiError("An unexpected error occurred.");
        return;
      }
    }
  };

  return (
    <div className="w-full sm:max-w-3xl p-3 mx-auto min-h-screen ">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form className="flex flex-col gap-4 " onSubmit={submitHandler}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            required
            placeholder="Title"
            id="title"
            className="flex-1 "
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            value={formData.title}
          />
          <div className="relative flex-1">
            <Select
              onChange={(e) => {
                const value = e.target.value;
                if (value === "add-custom") {
                  // Set custom category field visible
                  setCustomCategory(formData.category || "");
                } else {
                  setFormData({ ...formData, category: value });
                }
              }}
              value={formData.category}
            >
              <option value="uncategorized">Select a Category</option>
              <option value="add-custom">Add Custom Category</option>
            </Select>
            {customCategory && (
              <TextInput
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onBlur={() => {
                  setFormData({ ...formData, category: customCategory });
                  setCustomCategory(""); // Clear custom category input
                }}
                className="absolute top-full left-0 mt-2"
              />
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            typeof="file"
            accept="image/*"
            onChange={(e) => setFile(e.target?.files?.[0] || null)}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            outline
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress > 0}
          >
            {imageUploadProgress > 0 && imageUploadProgress < 100 ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}

        {formData.image && (
          <img
            src={formData.image}
            alt="Upload"
            className="object-cover w-full h-72"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write your post..."
          className="h-72 mb-12"
          modules={modules} // Apply custom modules
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData.content}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={apiLoading || imageUploadProgress > 0}
        >
          {apiLoading ? "Updating..." : "Update Post"}
        </Button>
        {apiError && (
          <Alert color={"failure"} className="mt-5">
            {apiError}
          </Alert>
        )}
      </form>
    </div>
  );
}
