import {RotateCw, Search} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Input} from "@/components/ui/input";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import PostCard from "@/components/own/PostCard.tsx";
import {useUser} from "@/Context/UserContext.tsx";
import {type Post, usePost} from "@/Context/PostContext.tsx";
import {PostType} from "@/Context/PostType";
import {Button} from "@/components/ui/button.tsx";
import { toast } from "sonner";

const UserPosts = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const { getPostsByUserId, setPosts } = usePost();

    const [posts, setPostsState] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<PostType | "all">("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const updatePosts = (newPosts: Post[]) => {
        setPostsState(newPosts);
        setPosts(newPosts);
    }

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const userIdNum = user.id;

            const userPosts = await getPostsByUserId(userIdNum);
            if (userPosts) {
                updatePosts(userPosts);
            }
            setLoading(false);
        };

        fetchUserPosts();
    }, [user?.id]);

    const availableTypes = useMemo(() => {
        const types = new Set<PostType>();
        posts.forEach(post => types.add(post.type));
        return Array.from(types);
    }, [posts]);

    const processedPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesType = filterType === "all" || post.type === filterType;
            const searchLower = searchQuery.toLowerCase();

            const matchesSearch =
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower) ||
                post.location?.title.toLowerCase().includes(searchLower) ||
                user?.weixinId.toLowerCase().includes(searchLower) ||
                user?.username.toLowerCase().includes(searchLower);

            return matchesType && matchesSearch;
        });
    }, [posts, filterType, searchQuery]);

    const handleConfirmDelete = (postId: number) => {
        toast.success(t("profile.delete_modal_title"));
        
        const updatedPosts = posts.filter(p => p.id !== postId);
        updatePosts(updatedPosts);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <RotateCw className="animate-spin text-orange-500 size-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                        placeholder={t("home.search_placeholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-slate-900 border-slate-800 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 rounded-xl transition-all"
                    />
                </div>

                <div className="flex flex-col gap-3">

                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-2 pb-1">
                            <Button
                                onClick={() => setFilterType("all")}
                                variant="tag"
                                size="tag-size"
                                className={filterType === "all" ?
                                    "bg-orange-600 text-white hover:bg-orange-700 border-orange-600" :
                                    "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"}
                            >
                                {t("filters.all")}
                            </Button>
                            {availableTypes.map((cat) => (
                                <Button
                                    key={cat}
                                    onClick={() => setFilterType(cat)}
                                    variant="tag"
                                    size="tag-size"
                                    className={filterType === cat ?
                                        "bg-orange-600 text-white hover:bg-orange-700 border-orange-600" :
                                        "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"}
                                >
                                    {t(`filters.${cat.toLowerCase()}`)}
                                </Button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="invisible" />
                    </ScrollArea>
                </div>
            </div>

            {processedPosts.length === 0 && (
                <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t("home.no_posts")}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {processedPosts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        user={user}
                        onDelete={handleConfirmDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserPosts;