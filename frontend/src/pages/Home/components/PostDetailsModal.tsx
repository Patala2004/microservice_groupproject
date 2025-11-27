import { Heart, MessageCircle, MapPin, DollarSign, Users, X, ChevronRight, Share2, Calendar, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import type { Post } from "../mockData";
import { getTypeLabel } from "./homeUtils";

interface PostDetailsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  onJoin: (postId: number) => void;
}

const PostDetailsModal = ({ post, isOpen, onClose, currentUser, onJoin }: PostDetailsModalProps) => {
  const { t } = useTranslation();

  if (!post) return null;

  const headerGradient = 
    post.type === "activity" ? "bg-gradient-to-r from-orange-900 to-amber-900" :
    post.type === "buy" ? "bg-gradient-to-r from-emerald-900 to-teal-900" :
    post.type === "transport" ? "bg-gradient-to-r from-purple-900 to-indigo-900" :
    "bg-gradient-to-r from-blue-900 to-cyan-900";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-900 border-slate-800 shadow-2xl text-slate-200">
        <div className="relative">
          {/* Header */}
          <div className={`h-32 w-full relative overflow-hidden flex items-end p-6 ${headerGradient}`}>
            <div className="absolute top-0 right-0 p-4 opacity-20">
              {post.type === "activity" && <Calendar className="w-32 h-32 -mt-8 -mr-8" />}
              {post.type === "sell" && <Tag className="w-32 h-32 -mt-8 -mr-8" />}
            </div>
            
            <div className="relative z-10 flex w-full justify-between items-end">
              <Badge className="bg-black/40 hover:bg-black/60 text-white border-none backdrop-blur-md px-4 py-1.5 text-sm">
                {getTypeLabel(post.type, t)}
              </Badge>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                  <Share2 className="w-5 h-5" />
                </Button>
                <DialogClose asChild>
                  <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-14 w-14 border-4 border-slate-900 -mt-12 shadow-md">
                <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-lg">{post.initials}</AvatarFallback>
              </Avatar>
              <div className="-mt-2">
                <h4 className="text-lg font-bold text-white">{post.user}</h4>
                <p className="text-sm text-slate-400">{post.date}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{post.title}</h2>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {post.price && (
                <Badge variant="secondary" className="bg-emerald-950/40 text-emerald-400 border border-emerald-900 py-1.5 px-3 rounded-lg">
                  <DollarSign className="w-4 h-4 mr-1"/> {post.price}
                </Badge>
              )}
              {post.location && (
                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border border-slate-700 py-1.5 px-3 rounded-lg">
                  <MapPin className="w-4 h-4 mr-1"/> {post.location}
                </Badge>
              )}
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 mb-8">
              <p>{post.content}</p>
            </div>

            {/* Join Section */}
            {(post.type === "activity" || post.type === "transport") && (
              <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    {t("home.guest_list_label")} <span className="text-slate-500 text-sm font-normal">({post.attendees.length} attending)</span>
                  </h4>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {post.attendees.length > 0 ? post.attendees.slice(0, 5).map((name, i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-300" title={name}>
                        {name.charAt(0)}
                      </div>
                    )) : <span className="text-sm text-slate-500">{t("post_actions.be_first")}</span>}
                  </div>

                  {post.user !== currentUser && (
                    <Button 
                      className={`px-6 rounded-full font-semibold transition-all ${post.attendees.includes(currentUser) ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-orange-600 hover:bg-orange-500 text-white'}`}
                      onClick={() => onJoin(post.id)}
                    >
                      {post.attendees.includes(currentUser) ? t("post_actions.leave") : t("post_actions.join")}
                      {!post.attendees.includes(currentUser) && <ChevronRight className="w-4 h-4 ml-1" />}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-950/30 border-t border-slate-800 flex items-center gap-4">
            <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200">
              <Heart className="w-4 h-4 mr-2 text-pink-500" /> Like ({post.likes})
            </Button>
            <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200">
              <MessageCircle className="w-4 h-4 mr-2 text-blue-500" /> Comment ({post.comments})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailsModal;