import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

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

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPost, setRecentPost] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?slug=${postSlug}`
        );

        if (res.data.posts.length === 0) {
          setError("Post not found");
          setPost(null);
        } else {
          setPost(res.data.posts[0]);
          setError(null);
        }
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Something went wrong");
        setPost(null);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const res = await axios.get(
          "https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?limit=3"
        );
        setRecentPost(res.data.posts);
      };
      fetchRecentPost();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-lg">{error}</p>
        <Link to="/" className="mt-4">
          <Button color={"gray"} pill size={"md"}>
            Go Home
          </Button>
        </Link>
      </div>
    );
  }

  return post ? (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link
        to={`/search?category=${post.category}`}
        className="self-center mt-5"
      >
        <Button color={"gray"} pill size={"xs"}>
          {post.category}
        </Button>
      </Link>
      <img
        src={post.image ?? ""}
        alt={post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic ">
          {Math.max(1, Math.ceil(post.content.length / 1000))} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <div className="max-w-4xl w-full mx-auto">
        <CallToAction />
      </div>
      <CommentSection postId={post.id} />
      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
          {recentPost &&
            recentPost.map((post) => (
              <div className="flex-1 min-w-[300px] max-w-[350px]">
                <PostCard key={post.id} post={post} />
              </div>
            ))}
        </div>
      </div>
    </main>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <Link to="/" className="mt-4">
        <Button color={"gray"} pill size={"md"}>
          Go Home
        </Button>
      </Link>
    </div>
  );
}
