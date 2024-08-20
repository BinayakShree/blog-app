import axios from 'axios';
import { Button, Select, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

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

export default function Search() {
    function capitalizeFirstLetter(string: string) {
        if (string.length === 0) return string; 
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [categories, setCategories] = useState<string[]>([]);
    const { search } = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        const searchTermFromURLParams = urlParams.get("searchTerm");
        const sortFromURLParams = urlParams.get("sort");
        const categoryFromURLParams = urlParams.get("category");

        if (searchTermFromURLParams || sortFromURLParams || categoryFromURLParams) {
            setSideBarData((prev) => ({
                ...prev,
                searchTerm: searchTermFromURLParams || prev.searchTerm,
                sort: sortFromURLParams || prev.sort,
                category: categoryFromURLParams || prev.category,
            }));
        }

        const fetchPosts = async () => {
            try {
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await axios.get(`https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?${searchQuery}`);
                const categoryRes = await axios.get('https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getpostcategory');
                setCategories(categoryRes.data.categories);
                setPosts(res.data.posts);
                setLoading(false);
                if (res.data.posts.length < 9) {
                    setShowMore(false);
                } else {
                    setShowMore(true);
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setError("Error fetching posts");
                setLoading(false);
            }
        };
        fetchPosts();
    }, [search]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        if (e.target.id === 'searchTerm') {
            setSideBarData({ ...sideBarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSideBarData({ ...sideBarData, sort: order });
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSideBarData({ ...sideBarData, category });
        }
    };
    const handleSubmit=(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(search);
        urlParams.set('searchTerm', sideBarData.searchTerm);
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('category', sideBarData.category);
        navigate(`/search?${urlParams.toString()}`);
    }
    const handleShowMore = async () => {
       
        try {
            const startIndex = posts.length.toString();
            const urlParams = new URLSearchParams(search);
            urlParams.set('startIndex', startIndex);
            const searchQuery = urlParams.toString();
          const res = await axios.get(
            `https://backend.bshreeshrestha.workers.dev/blog/api/v1/post/getposts?${searchQuery}`
          );
          setPosts([...posts, ...res.data["posts"]]);
          if (res.data.posts.length < 9) {
            setShowMore(false);
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setError("Error fetching posts");
          setLoading(false);
          return
        }
      };
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

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term</label>
                        <TextInput value={sideBarData.searchTerm} onChange={handleChange} type="text" placeholder='Search Term...' id='searchTerm' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Sort</label>
                        <Select onChange={handleChange} id="sort" value={sideBarData.sort}>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Category</label>
                        <Select onChange={handleChange} id="category" value={sideBarData.category}>
                            {categories.map((category) => <option key={category} value={category}>{capitalizeFirstLetter(category)}</option>)}
                        </Select>
                    </div>
                    <Button type="submit" gradientDuoTone="purpleToPink" outline size="md">Apply Filters</Button>
                    <Button onClick={()=>{navigate('/search')}} gradientDuoTone="purpleToPink" size="md">Delete Filters</Button>
                </form>
            </div>
            <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Post Results:   {posts.length}</h1>
        <div className='grid grid-cols-2 gap-4 p-7'>
    {!loading && posts.length === 0 && (
        <p className='text-xl text-gray-500 col-span-2'>No posts found</p>
    )}
    {!loading && posts && posts.map((post) => (
        <PostCard 
            key={post.id} 
            post={post} 
        />
    ))}
    {showMore && <button className='col-span-2 text-center text-lg font-semibold text-teal-500 hover:underline w-full p-7 ' onClick={handleShowMore}>Show More</button>}
</div>

            </div>
        </div>
    );
}
