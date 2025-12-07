import { createContext, useContext, useState } from "react";
import type {PostType} from "@/Context/PostType.tsx";
import postApi from "@/lib/api/postApi.ts";

export interface Location {
    title: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    type: PostType;
    poster: number;
    location?: Location;
    imageUrl?: string;
    joinedUsers: number[];
}

export interface CreatePostPayload {
    title: string;
    content: string;
    type: PostType;
    locationTitle: string;
    poster: number;
    imageFile?: File | null;
}

interface PostContextType {
    posts: Post[];
    createPost: (data: CreatePostPayload) => Promise<Post | null>;
    getAllPosts: () => Promise<void>;
    getPostById: (id: number) => Promise<Post | null>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    const getAllPosts = async () => {
        try {
            const response = await postApi.get("/post");

            if (response.status === 200) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error("Error fetching all posts:", error);
        }
    };

    const getPostById = async (id: number): Promise<Post | null> => {
        try {
            const response  = await postApi.get(`/post/${id}`);

            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching post ${id}:`, error);
            return null;
        }
    };


    const createPost = async ({ imageFile, ...postData }: CreatePostPayload): Promise<Post | null> => {
        const formData = new FormData();

        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('type', postData.type);
        formData.append('locationTitle', postData.locationTitle);
        formData.append('poster', postData.poster.toString());
        if (imageFile) {
            formData.append('image', imageFile);
        }

        console.log("Creating post with data:", postData, "and imageFile:", imageFile);
        try {
            const response = await postApi.post(
                "/post",
                formData,
                { }
            );
            console.log(response);

            if (response.status === 201) {
                const newPost = response.data;
                setPosts(prev => [newPost, ...prev]);
                return newPost;
            }
            return null;

        } catch (error) {
            console.error("Error creating post:", error);
            return null;
        }
    };

    return (
        <PostContext.Provider
            value={{
                posts,
                createPost,
                getAllPosts,
                getPostById,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePost must be used within a PostProvider");
    }
    return context;
};