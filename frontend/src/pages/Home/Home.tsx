import { Search, Flame, Clock, Sparkles, RotateCw } from "lucide-react";
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
import {toast} from "sonner";
import PostCard from "@/components/own/PostCard.tsx";


type SortOption = "recent" | "popular" | "recommended";

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { posts, getRecentPosts, getPostRecommendations, deletePost } = usePost();

  const [loading, setLoading] = useState(true);
  const [sortView, setSortView] = useState<SortOption>("recent");
  const [filterType, setFilterType] = useState<PostType | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await getRecentPosts();

      if (user?.id) {
        const recs = await getPostRecommendations(user.id);
        console.log("Recommended posts fetched:", recs);
        if (recs) {
          setRecommendedPosts(recs);
        }
      }

      setLoading(false);
    };
    
    fetchInitialData();
  }, [getRecentPosts, getPostRecommendations, user?.id]);

  const handleConfirmDelete = async  (postId: number) => {
    await deletePost(postId);
    toast.success(t("profile.delete_modal_title"));
  };



  const processedPosts = useMemo(() => {
    let listToFilter = posts;

    if (sortView === "recommended") {
      listToFilter = recommendedPosts;
    }

    let result = listToFilter.filter((post) => {
      const matchesType = filterType === "all" || post.type === filterType;
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch =
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower);

      return matchesType && matchesSearch;
    });

    if (sortView === "popular") {
      result.sort((a, b) => b.id - a.id);
    } else {
      result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [posts, recommendedPosts, filterType, searchQuery, sortView]);

  const availableTypes = useMemo(() => {
    const types = new Set<PostType>();
    posts.forEach(post => types.add(post.type));
    return Array.from(types);
  }, [posts]);
  
  if (loading) {
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

          <main className="lg:col-span-6 lg:order-2 order-3 min-h-[200vh]">

            <div className="sticky top-0 z-30 pb-4 pt-2 -mx-4 px-4 bg-slate-950/80 backdrop-blur-lg mb-6 space-y-4 border-b border-slate-800/60">
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
                <Tabs defaultValue="recent" value={sortView} onValueChange={(val:any) => setSortView(val as SortOption)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-10 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <TabsTrigger value="recent" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400">
                      <Clock className="w-3 h-3 mr-2" /> {t("sort.recent")}
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 text-slate-400">
                      <Flame className="w-3 h-3 mr-2" /> {t("sort.popular")}
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
                        className={filterType === "all" ?
                            "bg-orange-600 text-white border-orange-600 hover:bg-orange-700" :
                            "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"}
                    >
                      {t("filters.all")}
                    </Button>
                    {(availableTypes as PostType[]).map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => setFilterType(cat)}
                            variant="tag"
                            size="tag-size"
                            className={filterType === cat ?
                                "bg-orange-600 text-white border-orange-600 hover:bg-orange-700" :
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

            <div className="space-y-6 pb-20">
              {processedPosts.length === 0 && (
                  <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t("home.no_posts")}</p>
                  </div>
              )}
              {processedPosts.map((post) => (
                  <PostCard
                      key={post.id}
                      post={post}
                      user={user}
                      onDelete={handleConfirmDelete}
                  />
              ))}
            </div>
          </main>

          <aside className="hidden lg:block lg:col-span-3 lg:order-3 order-2">
            <UserDashboard onOpenCreatePost={() => setIsCreateOpen(true)} />
          </aside>
        </div>

        <CreatePostDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
        />

        {/* PostDetailsModal ne peut pas fonctionner ici sans fetch les détails du poster */}
        {/* <PostDetailsModal 
          post={selectedPost} 
          isOpen={!!selectedPost} 
          onClose={() => setSelectedPost(null)} 
          currentUser={user?.id || ""} 
          onJoin={handleJoin} 
        /> */}
      </div>
  );
};

export default HomePage;