import axios from "axios";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Spinner } from "flowbite-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  slug: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function HomePosts() {
  const [posts, setPosts] = useState<BlogPost[] >([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRecentPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?limit=9"
        );
        setLoading(false);
        setPosts(res.data.posts);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchRecentPost();
  }, []);
  if (loading) {
    return (
      <div className="mx-auto flex items-center justify-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center mb-5">
      <h1 className="text-xl mt-5">Recent Articles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 w-full max-w-6xl">
        {posts &&
          posts.map((post) => (
            <div key={post.id} className="flex-1">
              <PostCard post={post} />
            </div>
          ))}

      </div>
  
    </div>
  );
}
