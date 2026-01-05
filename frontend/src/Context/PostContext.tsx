import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
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
    poster: number;
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
    getAllPosts: (filters?: {type?: PostType, posterId?: number, page?: number, size?: number}) => Promise<Post[] | null>;
    getPostById: (id: number, userId: string | number) => Promise<Post | null>;
    getPostsByUserId: (userId: number) => Promise<Post[] | null>;
    getPostsByType: (type: PostType) => Promise<Post[] | null>;
    getRecentPosts: (page?: number) => Promise<Post[] | null>;
    getPostRecommendations: (userId: string | number) => Promise<Post[] | null>;
    searchPosts: (query: string, userId: string | number, type?: PostType | "all") => Promise<Post[] | null>;
    joinPost: (postId: number, userId: number) => Promise<boolean>;
    leavePost: (postId: number, userId: number) => Promise<boolean>;
    collectEvent: (userId: string | number, itemIds: number | number[], type: "POST" | "CLICK" | "JOIN" | "SEARCH") => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    const collectEvent = useCallback(async (userId: string | number, itemIds: number | number[], type: "POST" | "CLICK" | "JOIN" | "SEARCH") => {
        try {
            const isMulti = type === "SEARCH" || Array.isArray(itemIds);
            const endpoint = isMulti ? "/evcollector/multi" : "/evcollector";
            const payload = {
                userId: userId,
                itemId: itemIds,
                timestamp: new Date().toISOString(),
                type
            };
            await postApi.post(endpoint, payload);
        } catch (error) {
            console.error("Event collection failed", error);
        }
    }, []);

    const getAllPosts = useCallback(async (filters?: {type?: PostType, posterId?: number, page?: number, size?: number}) => {
        try {
            const params = new URLSearchParams();
            if (filters?.type) params.append('type', filters.type);
            if (filters?.posterId) params.append('posterId', filters.posterId.toString());
            if (filters?.page !== undefined) params.append('page', filters.page.toString());
            if (filters?.size !== undefined) params.append('size', filters.size.toString());
            params.append('sort', 'creationTime,DESC');
            const url = `/post?${params.toString()}`;
            const response = await postApi.get(url);
            if (response.status === 200) {
                return response.data.content;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const getRecentPosts = useCallback(async (page: number = 0): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post?page=${page}&size=15&sort=creationTime,DESC`);
            if (response.status === 200) {
                const postsData: Post[] = Array.isArray(response.data.content) ? response.data.content : [];
                if (page === 0) setPosts(postsData);
                return postsData;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const getPostRecommendations = useCallback(async (userId: string | number): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post/recomendations?userId=${userId}&limit=5`);
            if (response.status === 200) {
                return Array.isArray(response.data.content) ? response.data.content : response.data;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const searchPosts = useCallback(async (query: string, userId: string | number, type?: PostType | "all"): Promise<Post[] | null> => {
        try {
            const params = new URLSearchParams();
            if (query) params.append('titleContains', query);
            if (type && type !== "all") params.append('type', type);
            params.append('sort', 'creationTime,DESC');
            const response = await postApi.get(`/post?${params.toString()}`);
            if (response.status === 200) {
                const results = Array.isArray(response.data.content) ? response.data.content.slice(0, 15) : [];
                if (results.length > 0 && userId) {
                    collectEvent(userId, results.map((p: Post) => p.id), "SEARCH");
                }
                return results;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, [collectEvent]);

    const getPostById = useCallback(async (id: number, userId: string | number): Promise<Post | null> => {
        try {
            const response  = await postApi.get(`/post/${id}`);
            if (response.status === 200) {
                if (userId) collectEvent(userId, id, "CLICK");
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, [collectEvent]);

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
                const newPost = response.data;
                setPosts(prev => [newPost, ...prev]);
                collectEvent(postData.poster, newPost.id, "POST");
                return newPost;
            }
            return null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, [collectEvent]);

    const joinPost = useCallback(async (postId: number, userId: number): Promise<boolean> => {
        try {
            let targetPost = posts.find(p => p.id === postId) ?? null;
            if (!targetPost) {
                targetPost = await getPostById(postId, userId)
            }
            if (targetPost?.type === "ACTIVITY" && targetPost.eventTime) {
                try {
                    const startOriginal = new Date(targetPost.eventTime);
                    const start = new Date(startOriginal.getTime() - 8 * 60 * 60 * 1000);
                    const end = new Date(start.getTime() + 60 * 60 * 1000);

                    const startStr = start.toISOString().replace('Z', '');
                    const endStr = end.toISOString().replace('Z', '');

                    const scheduleRes = await postApi.get(`/schedule/${userId}`, {
                        params: {
                            start: startStr,
                            end: endStr
                        }
                    });

                    if (scheduleRes.status === 200 && scheduleRes.data?.length > 0) {
                        toast.warning(i18n.t("post_actions.schedule_conflict_warning") || "Schedule conflict detected.");
                    }
                } catch (e) {
                    console.error("Schedule check failed", e);
                }
            }

            const response = await postApi.post(`/post/${postId}/join`, null, {
                params: { userId }
            });

            if (response.status === 200) {
                const updatedPost = response.data;
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updatedPost } : p));
                collectEvent(userId, postId, "JOIN");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error joining post", error);
            return false;
        }
    }, [posts, collectEvent]);

    const updatePost = useCallback(async (id: number, data: UpdatePostPayload): Promise<Post | null> => {
        try {
            const response = await postApi.put(`/post/${id}`, {
                poster: data.poster,
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

    const getPostsByUserId = useCallback(async (userId: number): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post?posterId=${userId}`);
            return response.status === 200 ? response.data.content : null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
        }
    }, []);

    const getPostsByType = useCallback(async (type: PostType): Promise<Post[] | null> => {
        try {
            const response = await postApi.get(`/post?type=${type}`);
            return response.status === 200 ? response.data.content : null;
        } catch (error) {
            console.error(i18n.t("errors.generic_fetch_error"), error);
            return null;
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
        <PostContext.Provider value={{ posts, setPosts, createPost, updatePost, deletePost, getAllPosts, getPostById, getPostsByUserId, getPostsByType, getRecentPosts, getPostRecommendations, searchPosts, joinPost, leavePost, collectEvent }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) throw new Error("usePost must be used within a PostProvider");
    return context;
};