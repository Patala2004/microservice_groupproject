import { Search, Flame, Clock, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import RecommendationsSidebar from "./components/RecommendationsSidebar";
import UserDashboard from "./components/UserDashboard";
import CreatePostDialog from "./components/CreatePostDialog";
import PostDetailsModal from "./components/PostDetailsModal";
import { FAKE_POSTS, CURRENT_USER} from "./mockData";
import type { Post, PostCategory } from "./mockData";
import PostCard from "@/components/own/PostCard.tsx";

type SortOption = "recent" | "popular" | "recommended";

const HomePage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(FAKE_POSTS);
  const [sortView, setSortView] = useState<SortOption>("recent");
  const [filterType, setFilterType] = useState<PostCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  const processedPosts = useMemo(() => {
    let result = posts.filter((post) => {
      const matchesType = filterType === "all" || post.type === filterType;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.user.toLowerCase().includes(searchLower);
      return matchesType && matchesSearch;
    });

    if (sortView === "popular") {
      result.sort((a, b) => b.likes + b.comments - (a.likes + a.comments));
    } else if (sortView === "recommended") {
      result.sort((a, b) => {
        const scoreA = (a.type === "activity" ? 50 : 0) + a.likes;
        const scoreB = (b.type === "activity" ? 50 : 0) + b.likes;
        return scoreB - scoreA;
      });
    } else {
      result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [posts, filterType, searchQuery, sortView]);

  const handleJoin = (postId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id === postId) {
          if (post.attendees.includes(CURRENT_USER)) return post;
          return { ...post, attendees: [...post.attendees, CURRENT_USER] };
        }
        return post;
      })
    );

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev ? { ...prev, attendees: [...prev.attendees, CURRENT_USER] } : null
      );
    }
  };

  const handleCreatePost = (newPostData: Partial<Post>) => {
    const postToAdd: Post = {
      id: Date.now(),
      user: CURRENT_USER,
      initials: "ME",
      date: "Just now",
      likes: 0,
      comments: 0,
      attendees: [],
      title: newPostData.title || "Untitled",
      content: newPostData.content || "",
      type: (newPostData.type as PostCategory) || "activity",
      price: newPostData.price,
      location: newPostData.location,
    };

    setPosts([postToAdd, ...posts]);
    setIsCreateOpen(false);
  };

  return (
    <div className="dark relative min-h-screen w-full flex justify-center bg-slate-950 text-slate-100 selection:bg-orange-500/30">
      
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left: Recommendations */}
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
                  <button onClick={() => setFilterType("all")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${filterType === "all" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"}`}>
                    {t("filters.all")}
                  </button>
                  {(["sell", "buy", "activity", "sport"] as const).map((cat) => (
                    <button key={cat} onClick={() => setFilterType(cat)} className={`capitalize px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${filterType === cat ? "bg-orange-600 text-white border-orange-600" : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"}`}>
                      {t(`filters.${cat}`)}
                    </button>
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
            {processedPosts.map((post, index) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={CURRENT_USER} 
                onClick={setSelectedPost} 
                onJoin={handleJoin} 
                index={index} 
              />
            ))}
          </div>
        </main>

        <aside className="hidden lg:block lg:col-span-3 lg:order-3 order-2">
          <UserDashboard onOpenCreatePost={() => setIsCreateOpen(true)} />
        </aside>
      </div>

      {/* Modals */}
      <CreatePostDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreate={handleCreatePost} 
      />
      
      <PostDetailsModal 
        post={selectedPost} 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        currentUser={CURRENT_USER} 
        onJoin={(id) => handleJoin(id)} 
      />
    </div>
  );
};

export default HomePage;