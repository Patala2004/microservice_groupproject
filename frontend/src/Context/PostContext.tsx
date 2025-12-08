import { createContext, useContext, useState } from "react";
import type {PostType} from "@/Context/PostType.tsx";
import postApi from "@/lib/api/postApi.ts";
import i18n from "i18next";
import type { Dispatch, SetStateAction } from "react";

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
    setPosts: Dispatch<SetStateAction<Post[]>>;
    createPost: (data: CreatePostPayload) => Promise<Post | null>;
    getAllPosts: (filters?: {type?: PostType, posterId?: number}) => Promise<void>;
    getPostById: (id: number) => Promise<Post | null>;
    getPostsByUserId: (userId: number) => Promise<Post[] | null>;
    getPostsByType: (type: PostType) => Promise<Post[] | null>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    const getAllPosts = async (filters?: {type?: PostType, posterId?: number}) => {
        try {
            const params = new URLSearchParams();
            if (filters?.type) {
                params.append('type', filters.type);
            }
            if (filters?.posterId) {
                params.append('posterId', filters.posterId.toString());
            }

            const queryString = params.toString();
            const url = queryString ? `/post?${queryString}` : "/post";

            const response = await postApi.get(url);

            if (response.status === 200) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error") || "Error fetching all posts:", error);
        }
    };

    const getPostsByUserId = async (userId: number): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post?posterId=${userId}`);

            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error") || `Error fetching posts for user ${userId}:`, error);
            return null;
        }
    };

    const getPostsByType = async (type: PostType): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post?type=${type}`);

            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error") || `Error fetching posts by type ${type}:`, error);
            return null;
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
            console.error(i18n.t("errors.generic_fetch_error") || `Error fetching post ${id}:`, error);
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

        try {
            const response = await postApi.post(
                "/post",
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 201) {
                const newPost = response.data;
                setPosts(prev => [newPost, ...prev]);
                return newPost;
            }
            return null;

        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error") || "Error creating post:", error);
            return null;
        }
    };

    return (
        <PostContext.Provider
            value={{
                posts,
                setPosts,
                createPost,
                getAllPosts,
                getPostById,
                getPostsByUserId,
                getPostsByType,
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