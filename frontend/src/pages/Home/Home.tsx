import { Search, Clock, Sparkles, RotateCw } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import RecommendationsSidebar from "./components/RecommendationsSidebar";
import UserDashboard from "./components/UserDashboard";
import CreatePostDialog from "./components/CreatePostDialog";
import { usePost, type Post } from "@/Context/PostContext.tsx";
import { useUser } from "@/Context/UserContext.tsx";
import { PostType } from "@/Context/PostType";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import PostCard from "@/components/own/PostCard.tsx";

type SortOption = "recent" | "popular" | "recommended";

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { getRecentPosts, getPostRecommendations, searchPosts, deletePost } = usePost();

  const [initialLoading, setInitialLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [sortView, setSortView] = useState<SortOption>("recent");
  const [filterType, setFilterType] = useState<PostType | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const [postsToDisplay, setPostsToDisplay] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const topics = [PostType.ACTIVITY, PostType.SELL, PostType.BUY];

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      const recent = await getRecentPosts();
      if (recent) setPostsToDisplay(recent);
      setInitialLoading(false);
    };
    fetchInitialData();
  }, [getRecentPosts]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (sortView === "recommended" && user?.id) {
        if (recommendedPosts.length === 0) setPostsLoading(true);
        const recs = await getPostRecommendations(user.id);
        if (recs) setRecommendedPosts(recs);
        setPostsLoading(false);
      }
    };
    fetchRecommendations();
  }, [sortView, user?.id, getPostRecommendations]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchPosts(searchQuery, filterType);
      if (results) setSearchResults(results);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, filterType, searchPosts]);

  const handlePostCreated = (newPost: Post) => {
    setPostsToDisplay((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    const updateList = (list: Post[]) => list.map(p => p.id === updatedPost.id ? updatedPost : p);
    setPostsToDisplay(prev => updateList(prev));
    setRecommendedPosts(prev => updateList(prev));
    setSearchResults(prev => updateList(prev));
  };

  const handleConfirmDelete = async (postId: number) => {
    const success = await deletePost(postId);
    if (success) {
      const filterOut = (list: Post[]) => list.filter(p => p.id !== postId);
      setPostsToDisplay(prev => filterOut(prev));
      setRecommendedPosts(prev => filterOut(prev));
      setSearchResults(prev => filterOut(prev));
      toast.success(t("profile.delete_modal_title"));
    }
  };

  const processedPosts = useMemo(() => {
    let baseList: Post[] = [];
    if (searchQuery.trim().length > 0) {
      baseList = searchResults;
    } else {
      baseList = sortView === "recommended" ? recommendedPosts : postsToDisplay;
    }
    const result = baseList.filter((post) => {
      const matchesType = filterType === "all" || post.type === filterType;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || post.title?.toLowerCase().includes(searchLower) || post.content?.toLowerCase().includes(searchLower);
      return matchesType && matchesSearch;
    });
    return [...result].sort((a, b) => b.id - a.id);
  }, [postsToDisplay, recommendedPosts, searchResults, filterType, searchQuery, sortView]);

  if (initialLoading) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
          <RotateCw className="animate-spin text-orange-500 size-12" />
        </div>
    );
  }

  return (
      <div className="dark relative min-h-screen w-full flex justify-center bg-slate-950 text-slate-100 selection:bg-orange-500/30">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <div className="hidden lg:block lg:col-span-3 lg:order-1 order-1 space-y-6">
            <RecommendationsSidebar />
          </div>

          <main className="lg:col-span-6 lg:order-2 order-3 min-h-screen">
            <div className="sticky top-0 z-30 pb-4 pt-2 -mx-4 px-4 bg-slate-950/80 backdrop-blur-lg mb-6 space-y-4 border-b border-slate-800/60">
              <div className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearching ? 'text-orange-500 animate-pulse' : 'text-slate-500'}`} />
                <Input
                    placeholder={t("home.search_placeholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11 bg-slate-900 border-slate-800 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 rounded-xl transition-all"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Tabs defaultValue="recent" value={sortView} onValueChange={(val: any) => setSortView(val as SortOption)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <TabsTrigger value="recent" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400">
                      <Clock className="w-3 h-3 mr-2" /> {t("sort.recent")}
                    </TabsTrigger>
                    <TabsTrigger value="recommended" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400">
                      <Sparkles className="w-3 h-3 mr-2" /> {t("sort.recommended")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-2 pb-1">
                    <Button
                        onClick={() => setFilterType("all")}
                        variant="tag"
                        size="tag-size"
                        className={filterType === "all" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-900 text-slate-400 border-slate-800"}
                    >
                      {t("filters.all")}
                    </Button>
                    {topics.map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => setFilterType(cat)}
                            variant="tag"
                            size="tag-size"
                            className={filterType === cat ? "bg-orange-600 text-white border-orange-600" : "bg-slate-900 text-slate-400 border-slate-800"}
                        >
                          {t(`filters.${cat.toLowerCase()}`)}
                        </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
              </div>
            </div>

            <div className="space-y-6 pb-20">
              {postsLoading && recommendedPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <RotateCw className="animate-spin text-orange-500 size-10" />
                    <p className="text-slate-400 text-sm animate-pulse">{t("sort.recommended")}...</p>
                  </div>
              ) : processedPosts.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t("home.no_posts")}</p>
                  </div>
              ) : (
                  processedPosts.map((post) => (
                      <PostCard
                          key={`${sortView}-${post.id}`}
                          post={post}
                          user={user}
                          onDelete={handleConfirmDelete}
                          canEditPost={user?.id === post?.poster?.toString()}
                          onPostUpdated={handlePostUpdated}
                      />
                  ))
              )}
            </div>
          </main>

          <aside className="hidden lg:block lg:col-span-3 lg:order-3 order-2">
            <UserDashboard onOpenCreatePost={() => setIsCreateOpen(true)} />
          </aside>
        </div>

        <CreatePostDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onPostCreated={handlePostCreated}
        />
      </div>
  );
};

export default HomePage;