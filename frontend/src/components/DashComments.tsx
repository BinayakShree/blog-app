import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import {  useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useIsAdmin from "../utils/useIsAdmin";

interface Comment {
  id: string;
  content: string;
  createdAt: Date; 
  updatedAt: Date; 
  authorUsername: string;
  postSlug: string;
  likesCount: number;
}

export default function DashComments() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/getcomments`,
          { withCredentials: true }
        );
        setComments(res.data["comments"]);
        setLoading(false);
        if (res.data.comments.length < 9) {
          setShowMore(false);

        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser?.id, currentUser?.isAdmin, isAdmin, navigate]);
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/comments?startIndex=${startIndex}`
      );
      setComments([...comments, ...res.data["comments"]]);
      if (res.data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async () => {
    setShowModel(false);
    try {
      await axios.delete(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/deletecomment/${commentToDelete}`,
        { withCredentials: true }
      );
      setComments(comments.filter((comment) => comment.id !== commentToDelete));
      setCommentToDelete(null);
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return (
      <div className="mx-auto flex items-center justify-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 sm:scrollbar-none">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Post Slug</Table.HeadCell>
              <Table.HeadCell>Author username</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment.id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.likesCount}</Table.Cell>
                  <Table.Cell>{comment.postSlug}</Table.Cell>
                  <Table.Cell>{comment.authorUsername}</Table.Cell>
                  <Table.Cell
                    onClick={() => {
                      setShowModel(true);
                      setCommentToDelete(comment.id);
                    }}
                  >
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </div>
      ) : (
        <p>No Comments Availabe</p>
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
            Are you sure you want to delete this comment?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteComment}>
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
