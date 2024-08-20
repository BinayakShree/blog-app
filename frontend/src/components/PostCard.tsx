import { Link } from "react-router-dom";

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

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg transform transition-transform hover:scale-105 bg-white dark:bg-gray-900">
      <Link to={`/post/${post.slug}`}>
        {/* Image with hover zoom effect */}
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.slug}
            className="h-[260px] w-full object-cover transition-transform duration-700 ease-in-out transform group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90"></div>
          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold uppercase shadow-md">
            {post.category}
          </span>
        </div>
        {/* Post Info */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300 group-hover:text-indigo-600">
            {post.title}
          </h2>
          {/* Displaying content as raw HTML */}
          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </div>
        </div>
      </Link>
      {/* Button Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Link to={`/post/${post.slug}`}>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
}
