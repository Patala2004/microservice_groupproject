import { Heart, MessageCircle, MapPin, Users, X, ChevronRight, Share2, Calendar, Tag, ShoppingBag, Dumbbell } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { getTypeLabel } from "./homeUtils";
import type { Post } from "@/Context/PostContext.tsx";
import { PostType } from "@/Context/PostType";

interface PostDetailsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  onJoin: (postId: number) => void;
  posterName: string;
  posterAvatarUrl?: string;
}

const PostDetailsModal = ({ post, isOpen, onClose, currentUser, onJoin, posterName, posterAvatarUrl }: PostDetailsModalProps) => {
  const { t } = useTranslation();

  if (!post) return null;

  const isHost = post.poster.toString() === currentUser;
  const isJoined = post.joinedUsers.some(id => id.toString() === currentUser);
  const initials = posterName.charAt(0).toUpperCase() || post.poster.toString().charAt(0);
  const locationTitle = post.location?.title || t('post_actions.no_location');
  const datePlaceholder = "2025-01-01"; // Date non disponible dans l'interface Post

  const getHeaderGradient = () => {
    switch (post.type) {
      case PostType.ACTIVITY: return "bg-gradient-to-r from-orange-900 to-amber-900";
      case PostType.SELL: return "bg-gradient-to-r from-red-900 to-rose-900";
      case PostType.BUY: return "bg-gradient-to-r from-indigo-900 to-purple-900";
      case PostType.SPORT: return "bg-gradient-to-r from-pink-900 to-fuchsia-900";
      default: return "bg-slate-800";
    }
  };

  const getHeaderIcon = () => {
    switch (post.type) {
      case PostType.ACTIVITY: return <Calendar className="w-32 h-32" />;
      case PostType.SELL: return <Tag className="w-32 h-32" />;
      case PostType.BUY: return <ShoppingBag className="w-32 h-32" />;
      case PostType.SPORT: return <Dumbbell className="w-32 h-32" />;
      default: return <Tag className="w-32 h-32" />;
    }
  };
  const joinButtonClasses = isJoined ?
      'bg-red-500/10 text-red-400 hover:bg-red-500/20' :
      'bg-orange-600 hover:bg-orange-500 text-white';

  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-900 border-slate-800 shadow-2xl text-slate-200 rounded-xl">
          <div className="relative">
            {/* Header */}
            <div className={`h-32 w-full relative overflow-hidden flex items-end p-6 ${getHeaderGradient()} rounded-t-xl`}>
              <div className="absolute top-0 right-0 p-4 opacity-20">
                {getHeaderIcon()}
              </div>

              <div className="relative z-10 flex w-full justify-between items-end">
                <div className="bg-black/40 text-white border-none backdrop-blur-md px-4 py-1.5 text-sm rounded-full">
                  {getTypeLabel(post.type, t)}
                </div>
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
                  {posterAvatarUrl && <AvatarImage src={posterAvatarUrl} />}
                  <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="-mt-2">
                  <h4 className="text-lg font-bold text-white">{posterName}</h4>
                  <p className="text-sm text-slate-400">{datePlaceholder}</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{post.title}</h2>

              <div className="flex flex-wrap gap-3 mb-6">
                {post.location && (
                    <div className="inline-flex items-center text-sm font-medium text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                      <MapPin className="w-4 h-4 mr-1"/> {locationTitle}
                    </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 mb-8">
                <p>{post.content}</p>
              </div>

              {(post.type === PostType.ACTIVITY || post.type === PostType.SPORT) && (
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        {t("home.guest_list_label")} <span className="text-slate-500 text-sm font-normal">({post.joinedUsers.length} attending)</span>
                      </h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {post.joinedUsers.length > 0 ? post.joinedUsers.slice(0, 5).map((id, i) => (
                            <div key={i} className="h-8 w-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-300" title={`User ID: ${id}`}>
                              {id.toString().charAt(0)}
                            </div>
                        )) : <span className="text-sm text-slate-500">{t("post_actions.be_first")}</span>}
                      </div>

                      {!isHost && (
                          <Button
                              className={`px-6 rounded-full font-semibold transition-all ${joinButtonClasses}`}
                              onClick={() => onJoin(post.id)}
                          >
                            {isJoined ? t("post_actions.leave") : t("post_actions.join")}
                            {!isJoined && <ChevronRight className="w-4 h-4 ml-1" />}
                          </Button>
                      )}
                    </div>
                  </div>
              )}
            </div>

            <div className="p-6 bg-slate-950/30 border-t border-slate-800 flex items-center gap-4 rounded-b-xl">
              <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200">
                <Heart className="w-4 h-4 mr-2 text-pink-500" /> Like (0)
              </Button>
              <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200">
                <MessageCircle className="w-4 h-4 mr-2 text-blue-500" /> Comment (0)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default PostDetailsModal;