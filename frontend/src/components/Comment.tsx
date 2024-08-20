import  { FC, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Textarea } from "flowbite-react";
import axios from "axios";

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
    id: string;
  }[];
  postId: string;
  likesCount: number;
}

interface CommentProps {
  comment: CommentType;
  handleLike: (commentId: string) => void;
  handleEditComment: (comment: CommentType, editedContent: string) => void;
  handleDeleteComment: (commentId: string) => void;
}

const Comment: FC<CommentProps> = ({ comment, handleLike, handleEditComment,handleDeleteComment }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [editing, setEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(comment.content);
  const currentUserId = currentUser?.id;

  const likes = comment.likes || [];
  const isLiked = currentUserId && likes.map(like => like.id).includes(currentUserId);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try{
      await axios.put(`https://backend.bshreeshrestha.workers.dev/blog/api/v1/comment/editcomment/${comment.id}`,{content:editedContent},{withCredentials:true})
      handleEditComment(comment,editedContent)
      setEditing(false);
    }
    catch(error){
      console.log(error)
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="mr-3 flex-shrink-0">
        <img
          src={comment.author.profilePicture}
          alt={comment.author.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {comment.author ? comment.author.username : "Anonymous"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {editing ? (
          <div className="mb-2">
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                outline
                gradientDuoTone="purpleToBlue"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xl border-t dark:border-gray-700 max-w-fit gap-2">
              <button 
                onClick={() => handleLike(comment.id)} 
                type="button" 
                className={`text-gray-400 hover:text-blue-500 ${isLiked ? "!text-blue-500" : ""}`}
              >
                <FaThumbsUp className="text-xs"/>
              </button>
              <p className="text-gray-400 text-xs">
                {comment.likesCount > 0 && comment.likesCount + " " + (comment.likesCount > 1 ? "likes" : "like")}
              </p>
              {currentUser && (currentUser.id === comment.author.id || currentUser.isAdmin) && (
               <>
               <button 
                  onClick={handleEdit}
                  type="button"
                  className="text-gray-400 hover:text-blue-500 text-xs"
                >
                  Edit
                </button>
                <button 
                  onClick={()=>handleDeleteComment(comment.id)}
                  type="button"
                  className="text-gray-400 hover:text-red-500 text-xs"
                >
                  Delete
                </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
