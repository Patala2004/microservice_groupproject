import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PostCard from "@/components/own/PostCard.tsx";
import { useUser } from "@/Context/UserContext.tsx";
import { type Post, usePost } from "@/Context/PostContext.tsx";
import { RotateCw } from "lucide-react";
import { PostType } from "@/Context/PostType";

type SortOption = "recent" | "popular";

const UserPosts = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const { getPostsByUserId } = usePost();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortView, setSortView] = useState<SortOption>("recent");
    const [filterType, setFilterType] = useState<PostType | "all">("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const userPosts = await getPostsByUserId(user.id);
            if (userPosts) {
                setPosts(userPosts);
            }
            setLoading(false);
        };

        fetchUserPosts();
    }, [user?.id, getPostsByUserId]);

    const availableTypes = useMemo(() => {
        const types = new Set<PostType>();
        posts.forEach(post => types.add(post.type));
        return Array.from(types);
    }, [posts]);

    const processedPosts = useMemo(() => {
        let result = posts.filter((post) => {
            const matchesType = filterType === "all" || post.type === filterType;
            const searchLower = searchQuery.toLowerCase();

            const matchesSearch =
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower);

            return matchesType && matchesSearch;
        });

        if (sortView === "popular") {
            result.sort((a, b) => (b.id || 0) - (a.id || 0));
        } else {
            result.sort((a, b) => (b.id || 0) - (a.id || 0));
        }
        return result;
    }, [posts, filterType, searchQuery, sortView]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <RotateCw className="animate-spin text-cyan-500 size-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                    <Input
                        placeholder={t("home.search_placeholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-slate-900 border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl transition-all"
                    />
                </div>

                <div className="flex flex-col gap-3">

                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-2 pb-1">
                            <button onClick={() => setFilterType("all")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${filterType === "all" ? "bg-cyan-600 text-white border-cyan-600" : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"}`}>
                                {t("filters.all")}
                            </button>
                            {availableTypes.map((cat) => (
                                <button key={cat} onClick={() => setFilterType(cat)} className={`capitalize px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${filterType === cat ? "bg-cyan-600 text-white border-cyan-600" : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"}`}>
                                    {t(`filters.${cat.toLowerCase()}`)}
                                </button>
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
                        post={post}
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserPosts;