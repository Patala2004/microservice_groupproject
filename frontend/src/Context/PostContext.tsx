import { createContext, useContext, useState, useCallback } from "react";
import type { PostType } from "@/Context/PostType.tsx";
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
    creationTime: string;
    eventTime?: string;
    imageUrl?: string;
    joinedUsers: number[];
}

export interface CreatePostPayload {
    title: string;
    content: string;
    type: PostType;
    locationTitle: string;
    poster: number;
    eventTime?: string;
    imageFile?: File | null;
}

export interface UpdatePostPayload {
    title?: string;
    content?: string;
    type?: PostType;
    location?: Location;
    eventTime?: string;
}

interface PostContextType {
    posts: Post[];
    setPosts: Dispatch<SetStateAction<Post[]>>;
    createPost: (data: CreatePostPayload) => Promise<Post | null>;
    updatePost: (id: number, data: UpdatePostPayload) => Promise<Post | null>;
    deletePost: (id: number) => Promise<boolean>;
    getAllPosts: (filters?: {type?: PostType, posterId?: number}) => Promise<void>;
    getPostById: (id: number) => Promise<Post | null>;
    getPostsByUserId: (userId: number) => Promise<Post[] | null>;
    getPostsByType: (type: PostType) => Promise<Post[] | null>;
    getRecentPosts: () => Promise<Post[] | null>;
    getPostRecommendations: (userId: number) => Promise<Post[] | null>;
    searchPosts: (query: string, type?: PostType | "all") => Promise<Post[] | null>;
    joinPost: (postId: number, userId: number) => Promise<boolean>;
    leavePost: (postId: number, userId: number) => Promise<boolean>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    const getAllPosts = useCallback(async (filters?: {type?: PostType, posterId?: number}) => {
        try {
            const params = new URLSearchParams();
            if (filters?.type) params.append('type', filters.type);
            if (filters?.posterId) params.append('posterId', filters.posterId.toString());
            const url = params.toString() ? `/post?${params.toString()}` : "/post";
            const response = await postApi.get(url);
            if (response.status === 200) setPosts(response.data);
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
        }
    }, []);

    const getRecentPosts = useCallback(async (): Promise<Post[] | null> => {
        try {
            const response = await postApi.get("/post");
            if (response.status === 200) {
                const postsData: Post[] = Array.isArray(response.data) ? response.data : [];
                const limited = postsData.slice(0, 15);
                setPosts(limited);
                return limited;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const getPostRecommendations = useCallback(async (userId: number): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post/recomendations?userId=${userId}&limit=5`);
            return response.status === 200 ? response.data : null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const searchPosts = useCallback(async (query: string, type?: PostType | "all"): Promise<Post[] | null> => {
        try {
            const params = new URLSearchParams();
            if (query) params.append('titleContains', query);
            if (type && type !== "all") params.append('type', type);
            const response = await postApi.get(`/post?${params.toString()}`);
            if (response.status === 200) {
                return Array.isArray(response.data) ? response.data.slice(0, 15) : [];
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const getPostsByUserId = useCallback(async (userId: number): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post?posterId=${userId}`);
            return response.status === 200 ? response.data : null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const getPostsByType = useCallback(async (type: PostType): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post?type=${type}`);
            return response.status === 200 ? response.data : null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const getPostById = useCallback(async (id: number): Promise<Post | null> => {
        try {
            const response  = await postApi.get(`/post/${id}`);
            return response.status === 200 ? response.data : null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const deletePost = useCallback(async (id: number): Promise<boolean> => {
        try {
            const response = await postApi.delete(`/post/${id}`);
            if (response.status === 200 || response.status === 204) {
                setPosts(prev => prev.filter(p => p.id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error(i18n.t("errors.generic_delete_error"), error);
            return false;
        }
    }, []);

    const createPost = useCallback(async ({ imageFile, ...postData }: CreatePostPayload): Promise<Post | null> => {
        try {
            const response = await postApi.post("/post", {
                title: postData.title,
                content: postData.content,
                type: postData.type,
                location: { title: postData.locationTitle },
                poster: postData.poster,
                eventTime: postData.eventTime
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 201) {
                setPosts(prev => [response.data, ...prev]);
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const updatePost = useCallback(async (id: number, data: UpdatePostPayload): Promise<Post | null> => {
        try {
            const response = await postApi.put(`/post/${id}`, {
                title: data.title,
                content: data.content,
                type: data.type,
                location: data.location,
                eventTime: data.eventTime
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                setPosts(prev => prev.map(p => p.id === id ? response.data : p));
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const joinPost = useCallback(async (postId: number, userId: number): Promise<boolean> => {
        try {
            const response = await postApi.post(`/post/${postId}/join?userId=${userId}`);
            if (response.status === 200) {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...response.data } : p));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error joining post", error);
            return false;
        }
    }, []);

    const leavePost = useCallback(async (postId: number, userId: number): Promise<boolean> => {
        try {
            const response = await postApi.post(`/post/${postId}/leave?userId=${userId}`);
            if (response.status === 200) {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...response.data } : p));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error leaving post", error);
            return false;
        }
    }, []);

    return (
        <PostContext.Provider value={{ posts, setPosts, createPost, updatePost, deletePost, getAllPosts, getPostById, getPostsByUserId, getPostsByType, getRecentPosts, getPostRecommendations, searchPosts, joinPost, leavePost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) throw new Error("usePost must be used within a PostProvider");
    return context;
};