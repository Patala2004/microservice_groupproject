import {
  MapPin,
  Users,
  Calendar,
  Tag,
  ShoppingBag,
  RotateCw,
  UserRoundPlus,
  UserRoundMinus,
  CornerDownRight,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  X as XIcon,
  Clock,
  CalendarDays
} from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { getTypeLabel, getBadgeStyle } from "./homeUtils";
import { usePost, type Post } from "@/Context/PostContext.tsx";
import { PostType } from "@/Context/PostType";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/Context/UserContext";
import { toast } from "sonner";
import ContactInfoModal from "@/components/own/ContactInfoModal.tsx";

interface PostDetailsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  onJoin: (postId: number, isJoining: boolean) => void;
  onPostUpdated: (updatedPost: Post) => void;
  posterName: string;
  posterAvatarUrl?: string;
  canEditPost?: boolean;
}

interface DisplayUser {
  id: string;
  name: string;
  avatarUrl?: string;
  weixinId?: string;
  email?: string;
  phone_number?: string;
}

const PostDetailsModal = ({ post, isOpen, onClose, currentUser, onJoin, onPostUpdated,
                            posterName, posterAvatarUrl,  canEditPost = false }: PostDetailsModalProps) => {
  const { t } = useTranslation();
  const { getUserById } = useUser();
  const { updatePost } = usePost();

  const [localJoinedUsersIds, setLocalJoinedUsersIds] = useState<number[]>([]);
  const [joinerDetails, setJoinerDetails] = useState<DisplayUser[]>([]);
  const [fullJoinerList, setFullJoinerList] = useState<DisplayUser[]>([]);
  const [posterContactDetails, setPosterContactDetails] = useState<DisplayUser | null>(null);
  const [loadingJoiners, setLoadingJoiners] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showAllJoiners, setShowAllJoiners] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editEventTime, setEditEventTime] = useState("");
  const [editType, setEditType] = useState<PostType>(PostType.ACTIVITY);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (post && isOpen) {
      setLocalJoinedUsersIds(post.joinedUsers || []);
      setShowAllJoiners(false);
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditLocation(post.location?.title || "");
      setEditEventTime(post.eventTime ? new Date(post.eventTime).toISOString().slice(0, 16) : "");
      setEditType(post.type);
      setIsEditing(false);
    }
  }, [post, isOpen]);

  const fetchJoinerDetails = useCallback(async (ids: number[]) => {
    if (!post || post.type !== PostType.ACTIVITY || ids.length === 0) {
      setJoinerDetails([]);
      return;
    }
    setLoadingJoiners(true);
    try {
      const previewIds = ids.slice(0, 5).map(id => id.toString());
      const fetchedUsers = await Promise.all(previewIds.map(id => getUserById(id)));
      const validUsers = fetchedUsers
          .filter((u): u is any => u !== null)
          .map(u => ({
            id: u.id.toString(),
            name: u.name || `User ID: ${u.id}`,
            avatarUrl: u.avatarUrl,
            weixinId: u.weixinId || '',
            email: u.email || '',
            phone_number: u.phone_number || ''
          }));
      setJoinerDetails(validUsers);
    } catch (error) {
      console.error("Error fetching joiners", error);
    } finally {
      setLoadingJoiners(false);
    }
  }, [getUserById, post?.type]);

  const fetchAllJoiners = async () => {
    if (fullJoinerList.length === localJoinedUsersIds.length) {
      setShowAllJoiners(!showAllJoiners);
      return;
    }
    setLoadingJoiners(true);
    try {
      const fetched = await Promise.all(localJoinedUsersIds.map(id => getUserById(id.toString())));
      setFullJoinerList(fetched.filter((u): u is any => u !== null).map(u => ({
        id: u.id.toString(),
        name: u.name,
        avatarUrl: u.avatarUrl,
        weixinId: u.weixinId,
        email: u.email
      })));
      setShowAllJoiners(true);
    } catch (e) {
      toast.error("Error loading joiners list");
    } finally {
      setLoadingJoiners(false);
    }
  };

  useEffect(() => {
    if (isOpen && post && localJoinedUsersIds.length >= 0) {
      fetchJoinerDetails(localJoinedUsersIds);
    }
  }, [isOpen, localJoinedUsersIds, fetchJoinerDetails]);

  useEffect(() => {
    if (isOpen && post && !posterContactDetails) {
      getUserById(post.poster.toString()).then(u => {
        if (u) setPosterContactDetails({
          id: u.id.toString(),
          name: u.name,
          avatarUrl: u.avatarUrl,
          weixinId: u.weixinId,
          email: u.email,
          phone_number: u.phone_number
        } as DisplayUser);
      });
    }
  }, [isOpen, post?.poster, getUserById]);

  const handleUpdate = async () => {
    if (!post) return;
    setIsUpdating(true);
    const result = await updatePost(post.id, {
      title: editTitle,
      content: editContent,
      type: editType,
      location: { title: editLocation },
      eventTime: editType === PostType.ACTIVITY && editEventTime ? new Date(editEventTime).toISOString() : (editType === PostType.ACTIVITY ? post.eventTime : undefined)
    });
    setIsUpdating(false);
    if (result) {
      toast.success(t("post_actions.update_success"));
      onPostUpdated(result);
      setIsEditing(false);
    } else {
      toast.error(t("post_actions.update_error"));
    }
  };

  if (!post) return null;

  const isHost = post.poster.toString() === currentUser;
  const isJoined = localJoinedUsersIds.includes(parseInt(currentUser));
  const initials = posterName?.charAt(0).toUpperCase() || '?';
  const locationTitle = post.location?.title || t('post_actions.no_location');
  const isActivity = post.type === PostType.ACTIVITY;

  const handleJoinActivity = () => {
    const currentUserIdNum = parseInt(currentUser);
    const becomingJoined = !isJoined;
    setLocalJoinedUsersIds(prev => becomingJoined ? [...prev, currentUserIdNum] : prev.filter(id => id !== currentUserIdNum));
    onJoin(post.id, becomingJoined);
  };

  const handleShowContact = () => {
    if (posterContactDetails && (posterContactDetails.email || posterContactDetails.phone_number || posterContactDetails.weixinId)) {
      setIsContactModalOpen(true);
    } else {
      toast.info(t('post_actions.no_contact_available'));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Shanghai'
    });
  };

  const getHeaderGradient = (typeToUse: PostType) => {
    switch (typeToUse) {
      case PostType.ACTIVITY: return "from-orange-900 to-amber-900";
      case PostType.SELL: return "from-red-900 to-rose-900";
      case PostType.BUY: return "from-indigo-900 to-purple-900";
      default: return "from-slate-800 to-slate-900";
    }
  };

  const getHeaderIcon = (typeToUse: PostType, size: string = "w-4 h-4") => {
    switch (typeToUse) {
      case PostType.ACTIVITY: return <Calendar className={size} />;
      case PostType.SELL: return <Tag className={size} />;
      case PostType.BUY: return <ShoppingBag className={size} />;
      default: return <Tag className={size} />;
    }
  };

  const joinButtonClasses = isJoined ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' : 'bg-orange-600 hover:bg-orange-500 text-white';

  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-900 border-slate-800 shadow-2xl text-slate-200 rounded-xl max-h-[90vh] flex flex-col">
          <VisuallyHidden.Root>
            <DialogHeader><DialogTitle>{post.title}</DialogTitle></DialogHeader>
          </VisuallyHidden.Root>
          <ScrollArea className="flex-1">
            <div className="relative">
              <div className={`h-32 w-full flex relative overflow-hidden items-end p-6 bg-gradient-to-r ${getHeaderGradient(isEditing ? editType : post.type)} rounded-t-xl transition-colors duration-500`}>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  {getHeaderIcon(isEditing ? editType : post.type, "w-32 h-32")}
                </div>
                <div className="relative z-10 flex w-full justify-between items-end">
                  {!isEditing ? (
                      <div className="flex flex-row items-center gap-2 bg-black/40 text-white px-4 py-1.5 text-sm rounded-full backdrop-blur-md">
                        {getTypeLabel(post.type, t)}
                      </div>
                  ) : <div />}
                  {canEditPost && isHost && !isEditing && (
                      <Button size="sm" variant="secondary" className="h-8 rounded-full bg-white/10 hover:bg-white/20 border-none text-white backdrop-blur-sm" onClick={() => setIsEditing(true)}>
                        <Pencil className="w-3.5 h-3.5 mr-1.5" /> {t('post_actions.edit')}
                      </Button>
                  )}
                </div>
              </div>
              <div className="p-8 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-4 border-slate-900 -mt-12 shadow-md">
                      {posterAvatarUrl && <AvatarImage src={posterAvatarUrl} />}
                      <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="-mt-2"><h4 className="text-lg font-bold text-white">{posterName}</h4></div>
                  </div>
                  {!isEditing && post.creationTime && (
                      <div className="text-sm flex items-center text-[10px] text-slate-500 font-medium italic -mt-2">
                        <Clock className="size-3 mr-1 opacity-50" />
                        {formatDate(post.creationTime)}
                      </div>
                  )}
                </div>

                {isEditing ? (
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('create_modal.label_category')}</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {[PostType.ACTIVITY, PostType.SELL, PostType.BUY].map((type) => (
                              <button
                                  key={type}
                                  type="button"
                                  onClick={() => setEditType(type)}
                                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border transition-all
                                ${editType === type
                                      ? `${getBadgeStyle(type)} scale-105 border-white/20`
                                      : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600'}`}
                              >
                                {getTypeLabel(type, t)}
                              </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('create_modal.label_title')}</label>
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-slate-800/50 border-slate-700 focus-visible:ring-orange-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('create_modal.label_location')}</label>
                        <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="bg-slate-800/50 border-slate-700 focus-visible:ring-orange-500" />
                      </div>
                      {editType === PostType.ACTIVITY && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('create_modal.label_event_time')}</label>
                            <Input type="datetime-local" value={editEventTime} onChange={(e) => setEditEventTime(e.target.value)} className="bg-slate-800/50 border-slate-700 focus-visible:ring-orange-500" />
                          </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('create_modal.label_content')}</label>
                        <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="bg-slate-800/50 border-slate-700 min-h-[100px] focus-visible:ring-orange-500" />
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={isUpdating} className="text-slate-400 hover:text-white hover:bg-slate-800">
                          <XIcon className="w-4 h-4 mr-1" /> {t('post_actions.cancel')}
                        </Button>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white" onClick={handleUpdate} disabled={isUpdating}>
                          {isUpdating ? <RotateCw className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />} {t('post_actions.save')}
                        </Button>
                      </div>
                    </div>
                ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{post.title}</h2>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {post.location && (
                            <div className="inline-flex items-center text-sm font-medium text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                              <MapPin className="w-4 h-4 mr-1"/> {locationTitle}
                            </div>
                        )}
                        {post.eventTime && (
                            <div className="inline-flex items-center text-sm font-medium text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                              <CalendarDays className="w-4 h-4 mr-1"/> {formatDate(post.eventTime)}
                            </div>
                        )}
                      </div>
                      <div className="prose prose-invert max-w-none text-slate-300 mb-8"><p>{post.content}</p></div>
                    </>
                )}

                {isActivity && !isEditing && (
                    <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-500" />
                          {t("home.guest_list_label")}
                          <span className="text-slate-500 text-sm font-normal">({localJoinedUsersIds.length} attending)</span>
                        </h4>
                        {!isHost && (
                            <Button className={`px-4 h-8 rounded-full font-semibold transition-all ${joinButtonClasses}`} onClick={handleJoinActivity}>
                              {isJoined ? <><UserRoundMinus className="w-4 h-4 mr-1" /> {t("post_actions.leave")}</> : <><UserRoundPlus className="w-4 h-4 mr-1" /> {t("post_actions.join")}</>}
                            </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex -space-x-2 mr-4">
                            {loadingJoiners ? <RotateCw className="size-5 animate-spin text-slate-500" /> : joinerDetails.length > 0 ? (
                                <TooltipProvider delayDuration={200}>
                                  {joinerDetails.map((joiner) => (
                                      <Tooltip key={joiner.id}>
                                        <TooltipTrigger asChild>
                                          <Avatar className="h-8 w-8 rounded-full border-2 border-slate-900 shadow-md cursor-pointer hover:z-10 hover:scale-110 transition-transform">
                                            {joiner.avatarUrl && <AvatarImage src={joiner.avatarUrl} />}
                                            <AvatarFallback className="bg-slate-700 text-white text-xs font-bold">{joiner.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-800 border-slate-700 text-slate-100 p-3 rounded-lg shadow-xl">
                                          <p className="font-bold text-orange-400 mb-1">{joiner.name}</p>
                                          <div className="flex flex-col gap-1 text-xs text-slate-300">
                                            <span className="flex items-center gap-1.5"><MessageSquare className="size-3 text-slate-500" />@{joiner.weixinId || 'N/A'}</span>
                                            <span className="flex items-center gap-1.5"><Mail className="size-3 text-slate-500" />{joiner.email || 'N/A'}</span>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                  ))}
                                </TooltipProvider>
                            ) : <span className="text-sm text-slate-500">{isHost ? t("post_actions.no_joiners_yet") : t("post_actions.be_first")}</span>}
                          </div>
                          {localJoinedUsersIds.length > 0 && (
                              <Button variant="link" size="sm" onClick={fetchAllJoiners} className="text-orange-500 p-0 h-auto text-xs hover:text-orange-400">
                                {showAllJoiners ? <><ChevronUp className="size-3 mr-1"/>Hide</> : <><ChevronDown className="size-3 mr-1"/>See all ({localJoinedUsersIds.length})</>}
                              </Button>
                          )}
                        </div>
                      </div>
                      {showAllJoiners && (
                          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2">
                            {fullJoinerList.map(j => (
                                <div key={j.id} className="flex flex-col items-start justify-start p-2 rounded-lg bg-slate-900/40">
                                  <div className="flex items-center gap-3"><span className="text-sm font-medium">{j.name}</span></div>
                                  <span className="text-xs text-slate-400">@{j.weixinId || 'N/A'}</span>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                )}
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/50 backdrop-blur-sm rounded-b-xl">
            <Button onClick={handleShowContact} variant="ghost" className="h-8 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 px-3" disabled={!posterContactDetails}>
              <CornerDownRight className="w-3 h-3 mr-1" />{t('post_actions.show_contact')}
            </Button>
          </div>
        </DialogContent>
        {posterContactDetails && (
            <ContactInfoModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                posterDetails={{
                  name: posterContactDetails.name,
                  email: posterContactDetails.email || t('profile.default_email_unavailable'),
                  phone_number: posterContactDetails.phone_number || t('profile.default_phone_unavailable'),
                  weixinId: posterContactDetails.weixinId || t('profile.default_weixin_unavailable')
                }}
            />
        )}
      </Dialog>
  );
};

export default PostDetailsModal;