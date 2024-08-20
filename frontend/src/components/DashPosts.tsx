import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useIsAdmin from "../utils/useIsAdmin";

interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  slug: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashPosts() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?userId=${currentUser?.id}`
        );
        setLoading(false);
        setPosts(res.data["posts"]);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser?.id, currentUser?.isAdmin, isAdmin, navigate]);
  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await axios.get(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?userId=${currentUser?.id}&startIndex=${startIndex}`
      );
      setPosts([...posts, ...res.data["posts"]]);
      if (res.data.posts.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    setShowModel(false);
    try {
      await axios.delete(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/deletepost/${postToDelete}/${currentUser?.id}`,
        { withCredentials: true }
      );
      setPosts(posts.filter((post) => post.id !== postToDelete));
      setPostToDelete(null);
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
      {currentUser?.isAdmin && posts.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post ID</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {posts.map((post: Post) => (
              <Table.Body className="divide-y" key={post.id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{post.id}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell
                    onClick={() => {
                      setShowModel(true);
                      setPostToDelete(post.id);
                    }}
                  >
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post.id}`}
                    >
                      <span>Edit</span>
                    </Link>
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
        <p>No Post Availabe</p>
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
            Are you sure you want to delete the post?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeletePost}>
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
