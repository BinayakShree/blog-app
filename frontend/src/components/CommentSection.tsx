import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
  };
  likes: {
    id:string;
  }[];
  postId: string;
  likesCount: number;
}

export default function CommentSection({ postId }: { postId: string }) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [allComments, setAllComments] = useState<CommentType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentToBeDeleted, setCommentToBeDeleted] = useState<string | null>(null);
  const navigate=useNavigate();
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    if (newComment.length <= 200) {
      setComment(newComment);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (comment.length > 200) {
        setCommentError("Comment must be less than 200 characters");
        return;
      }

      setCommentError(null);
      const res = await axios.post(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/create`,
        {
          content: comment,
          postId,
          userId: currentUser?.id,
        },
        { withCredentials: true }
      );
      setAllComments([res.data.data, ...allComments]);
      setComment("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setCommentError("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/getpostcomments/${postId}`
        );
        setAllComments(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId: string) => {
    try{
      if(!currentUser){
        navigate("/sign-in")
        return
      }
      const res=await axios.put(`https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/likecomment/${commentId}`,{},{withCredentials:true})
      setAllComments(allComments.map((comment)=>comment.id===commentId?{...comment,likesCount:res.data.data.likesCount,likes:res.data.data.likes}:comment))
    }
    catch(error){
      console.log(error)
    }

  };
  const handleEditComment=async(comment:CommentType,editedContent:string)=>{
    setAllComments(allComments.map((c)=>c.id===comment.id?{...comment,content:editedContent}:c))
  }

  const handleDeleteComment=async()=>{
    setShowModal(false)
    try{
      if(!currentUser){
        navigate("/sign-in")
        return;
      }
      await axios.delete(`https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/deletecomment/${commentToBeDeleted}`,{withCredentials:true})
      setAllComments(allComments.filter((comment)=>comment.id!==commentToBeDeleted))
      setCommentToBeDeleted(null)
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center my-5 text-gray-500 text-sm gap-1">
          <p>Signed in as:</p>
          <img
            className="object-cover rounded-full w-5 h-5"
            src={currentUser?.profilePicture}
            alt={currentUser?.username}
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser?.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must log in to comment on this post
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleCommentSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={handleCommentChange}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5 text-gray-500 text-sm">
            <p>{200 - comment.length} characters remaining</p>
            <Button
              type="submit"
              outline
              gradientDuoTone={"purpleToBlue"}
              disabled={comment.length === 0}
            >
              Comment
            </Button>
          </div>
        </form>
      )}
      {commentError && (
        <Alert color="failure" className="mt-5">
          {commentError}
        </Alert>
      )}
      {allComments.length === 0 ? (
        <p className="text-sm my-5">No Comments yet!</p>
      ) : (
        <>
          <div className="text-sm flex items-center my-5 gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{allComments.length}</p>
            </div>
          </div>
          {allComments.map((eachComment) => (
            <Comment key={eachComment.id} comment={eachComment} handleLike={handleLike} handleEditComment={handleEditComment} handleDeleteComment={(commentId:string)=>{setShowModal(true); setCommentToBeDeleted(commentId)}} />
          ))}
        </>
      )}
         <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          </div>
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 text-center">
            Are you sure you want to delete the comment?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteComment}>
              Yes I'm sure!
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No, Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
