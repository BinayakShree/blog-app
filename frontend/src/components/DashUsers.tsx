import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useIsAdmin from "../utils/useIsAdmin";
import { FaCheck, FaTimes } from "react-icons/fa";

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
}

export default function DashUsers() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/getusers`,
          { withCredentials: true }
        );
        setLoading(false);
        setUsers(res.data["users"]);
        if (res.data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?.id, currentUser?.isAdmin, isAdmin, navigate]);
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/users?startIndex=${startIndex}`
      );
      setUsers([...users, ...res.data["users"]]);
      if (res.data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      if (currentUser?.id === userToDelete) {
        throw new Error("Cannot delete yourself");
      }
      await axios.delete(
        `https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/delete/${userToDelete}`,
        { withCredentials: true }
      );
      setUsers(users.filter((user) => user.id !== userToDelete));
      setUserToDelete(null);
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
      {currentUser?.isAdmin && users.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>User ID</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user: User) => (
              <Table.Body className="divide-y" key={user.id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>
                    <Link to={`${user.profilePicture}`}>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover rounded-full bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                 
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell
                    onClick={() => {
                      setShowModel(true);
                      setUserToDelete(user.id);
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
        <p>No User Availabe</p>
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
            Are you sure you want to delete the user?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>
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
