import { Heart, MessageCircle, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import type { Post } from "../mockData"; // Adjust path if needed
import { getBadgeStyle, getTypeLabel } from "./homeUtils";

interface PostCardProps {
  post: Post;
  currentUser: string;
  onClick: (post: Post) => void;
  onJoin: (postId: number, e: React.MouseEvent) => void;
  index: number;
}

const PostCard = ({ post, currentUser, onClick, onJoin, index }: PostCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      onClick={() => onClick(post)}
      className="group relative border-slate-800 bg-slate-900/60 shadow-lg hover:shadow-orange-900/10 hover:border-slate-700 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-6 pt-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-700">
              <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-xs">
                {post.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-200 leading-none mb-1 group-hover:text-orange-400 transition-colors">
                {post.user}
              </span>
              <span className="text-xs text-slate-500 font-medium">{post.date}</span>
            </div>
          </div>
          <Badge variant="outline" className={`rounded-full px-3 py-1 font-medium border ${getBadgeStyle(post.type)}`}>
            {getTypeLabel(post.type, t)}
          </Badge>
        </div>

        {/* Content */}
        <div className="mb-5">
          <h3 className="text-lg font-bold mb-2 text-slate-100">{post.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">
            {post.content}
          </p>
        </div>

        {/* Metadata Chips */}
        {(post.location || post.price) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.location && (
              <div className="inline-flex items-center text-xs font-medium text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-800">
                <MapPin className="w-3 h-3 mr-1.5 opacity-70" /> {post.location}
              </div>
            )}
            {post.price && (
              <div className="inline-flex items-center text-xs font-medium text-emerald-400 bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-900/50">
                <DollarSign className="w-3 h-3 mr-1" /> {post.price}
              </div>
            )}
          </div>
        )}

        {/* Interactive Join Box (Only for Activity/Transport) */}
        {(post.type === "activity" || post.type === "transport") && (
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 flex items-center justify-between group/box transition-colors hover:bg-slate-950">
            <div className="flex items-center">
              <div className="flex -space-x-2 overflow-hidden">
                {[...Array(Math.min(3, post.attendees.length))].map((_, i) => (
                  <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-600" />
                ))}
              </div>
              <span className="ml-4 text-xs font-semibold text-slate-400 group-hover/box:text-slate-300 transition-colors">
                {t("post_actions.joined_count", { count: post.attendees.length })}
              </span>
            </div>

            {post.user === currentUser ? (
              <Badge variant="secondary" className="bg-orange-950/30 text-orange-400 border border-orange-900/50">
                {t("post_actions.hosting")}
              </Badge>
            ) : (
              <Button
                size="sm"
                variant={post.attendees.includes(currentUser) ? "secondary" : "default"}
                onClick={(e) => onJoin(post.id, e)}
                className={`h-8 rounded-full text-xs font-semibold transition-all ${
                  post.attendees.includes(currentUser)
                    ? "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50"
                    : "bg-slate-100 text-slate-900 hover:bg-white"
                }`}
              >
                {post.attendees.includes(currentUser) ? t("post_actions.joined") : t("post_actions.join")}
              </Button>
            )}
          </div>
        )}
      </CardContent>

      {/* --- ADDED BACK: CARD FOOTER FOR LIKES & COMMENTS --- */}
      <CardFooter className="px-6 py-3 bg-slate-950/30 border-t border-slate-800 flex justify-between items-center">
        <div className="flex gap-4">
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-pink-500 transition-colors group/like">
            <Heart className="w-4 h-4 group-hover/like:fill-pink-500 transition-all" /> 
            {post.likes} {t("post_actions.like")}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-4 h-4" /> 
            {post.comments} {t("post_actions.comment")}
          </button>
        </div>

        {/* Contact Button for Buy/Sell */}
        {(post.type === "buy" || post.type === "sell") && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 px-3 -mr-2"
            onClick={(e) => { e.stopPropagation(); /* Add contact logic here */ }}
          >
            {t("post_actions.contact")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;