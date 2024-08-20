import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useIsAdmin from "../utils/useIsAdmin";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Spinner, Table } from "flowbite-react";
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
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
  interface User {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
    isAdmin: boolean;
  }
  interface Comment {
    id: string;
    content: string;
    createdAt: Date; 
    updatedAt: Date; 
    authorUsername: string;
    postSlug: string;
    likesCount: number;
  }
export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [lastMonthUsers, setLastMonthUsers] = useState<number>(0);
    const [lastMonthComments, setLastMonthComments] = useState<number>(0);
    const [lastMonthPosts, setLastMonthPosts] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const {currentUser} = useSelector((state: RootState) => state.user)
    const navigate = useNavigate();
    const isAdmin = useIsAdmin();
    useEffect(() => {
        if (!isAdmin) {
          navigate("/");
        }
    },[isAdmin, navigate])
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          const fetchUsers = async () => {
            const res = await axios.get("https://backend.bshreeshrestha.workers.dev/blog/api/v1/user/getusers?limit=5", {
              withCredentials: true,
            });
            setUsers(res.data.users);
            setTotalUsers(res.data.totalUsers);
            setLastMonthUsers(res.data.lastMonthUsers);
          };
  
          const fetchComments = async () => {
            const res = await axios.get("https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/getcomments?limit=5", {
              withCredentials: true,
            });
            setComments(res.data.comments);
            setTotalComments(res.data.totalComments);
            setLastMonthComments(res.data.lastMonthComments);
          };
  
          const fetchPosts = async () => {
            const res = await axios.get("https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?limit=5", {
              withCredentials: true,
            });
            setPosts(res.data.posts);
            setTotalPosts(res.data.totalPosts);
            setLastMonthPosts(res.data.lastMonthPosts);
          };
  
          if (currentUser?.isAdmin) {
            await Promise.all([fetchUsers(), fetchComments(), fetchPosts()]);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [currentUser?.isAdmin]);
  
    if (loading) {
      return (
        <div className="mx-auto flex items-center justify-center min-h-screen">
          <Spinner size={"xl"} />
        </div>
      );
    }
    return (
        <div className='p-3 md:mx-auto'>
          <div className='flex-wrap flex gap-4 justify-center'>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                  <p className='text-2xl'>{totalUsers}</p>
                </div>
                <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex  gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                
                {lastMonthUsers>0 ?<><HiArrowNarrowUp /> {lastMonthUsers} </>  : null}
                </span>
                <div className='text-gray-500'>{lastMonthUsers>0 ? 'Last month' : null}</div>
              </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>
                    Total Comments
                  </h3>
                  <p className='text-2xl'>{totalComments}</p>
                </div>
                <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex  gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                  
                  {lastMonthComments>0 ?<><HiArrowNarrowUp /> {lastMonthComments} </>  : null}
                </span>
                <div className='text-gray-500'>{lastMonthComments>0 ? 'Last month' : null}</div>
              </div>
            </div>
            <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                  <p className='text-2xl'>{totalPosts}</p>
                </div>
                <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
              <div className='flex  gap-2 text-sm'>
                <span className='text-green-500 flex items-center'>
                {lastMonthPosts>0 ?<><HiArrowNarrowUp /> {lastMonthPosts} </>  : null}
                </span>
                <div className='text-gray-500'>{lastMonthPosts>0 ? 'Last month' : null}</div>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent users</h1>
                <Button outline gradientDuoTone='purpleToPink'>
                  <Link to={'/dashboard?tab=users'}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>User image</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                </Table.Head>
                {users &&
                  users.map((user) => (
                    <Table.Body key={user.id} className='divide-y'>
                      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            alt='user'
                            className='w-10 h-10 rounded-full bg-gray-500'
                          />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent comments</h1>
                <Button outline gradientDuoTone='purpleToPink'>
                  <Link to={'/dashboard?tab=comments'}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Comment</Table.HeadCell>
                  <Table.HeadCell>Likes</Table.HeadCell>
                </Table.Head>
                {comments &&
                  comments.map((comment) => (
                    <Table.Body key={comment.id} className='divide-y'>
                      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell className='w-96'>
                            <p className='line-clamp-2'>{comment.content}</p>
                        </Table.Cell>
               
                        <Table.Cell>{comment.likesCount}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </div>
            <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
              <div className='flex justify-between  p-3 text-sm font-semibold'>
                <h1 className='text-center p-2'>Recent posts</h1>
                <Button outline gradientDuoTone='purpleToPink'>
                  <Link to={'/dashboard?tab=posts'}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Post image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                </Table.Head>
                {posts &&
                  posts.map((post) => (
                    <Table.Body key={post.id} className='divide-y'>
                      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>
                            <Link to={`/post/${post.slug}`}> <img
                            src={post.image}
                            alt='user'
                            className='w-14 h-10 rounded-md bg-gray-500'
                          /></Link>
                         
                        </Table.Cell>
                        <Table.Cell className='w-96'>{post.title}</Table.Cell>
                        <Table.Cell className='w-5'>{post.category}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </div>
          </div>
        </div>
      );
}
