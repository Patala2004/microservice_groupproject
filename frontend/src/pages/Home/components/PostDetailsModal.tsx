import {
  MapPin,
  Users,
  Calendar,
  Tag,
  ShoppingBag,
  Dumbbell,
  RotateCw,
  UserRoundPlus,
  UserRoundMinus,
  CornerDownRight
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { getTypeLabel } from "./homeUtils";
import type { Post } from "@/Context/PostContext.tsx";
import { PostType } from "@/Context/PostType";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/Context/UserContext";
import {toast} from "sonner";
import ContactInfoModal from "@/components/own/ContactInfoModal.tsx";

interface PostDetailsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  onJoin: (postId: number, isJoining: boolean) => void;
  posterName: string;
  posterAvatarUrl?: string;
}

interface DisplayUser {
  id: string;
  name: string;
  avatarUrl?: string;
  weixinId?: string;
  email?: string;
  phone_number?: string;
}

const PostDetailsModal = ({ post, isOpen, onClose, currentUser, onJoin, posterName, posterAvatarUrl }: PostDetailsModalProps) => {
  const { t } = useTranslation();
  const { user, getUserById } = useUser();

  const [localJoinedUsersIds, setLocalJoinedUsersIds] = useState<number[]>(post?.joinedUsers || []);
  const [joinerDetails, setJoinerDetails] = useState<DisplayUser[]>([]);
  const [posterContactDetails, setPosterContactDetails] = useState<DisplayUser | null>(null);
  const [loadingJoiners, setLoadingJoiners] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setLocalJoinedUsersIds(post.joinedUsers);
    }
  }, [post]);


  if (!post) return null;

  const currentUserIdNum = user?.id ?? undefined;

  const isHost = post.poster.toString() === currentUser;
  const isJoined = localJoinedUsersIds.some(id => id.toString() === currentUser);
  const initials = posterName.charAt(0).toUpperCase() || post.poster.toString().charAt(0);
  const locationTitle = post.location?.title || t('post_actions.no_location');


  const fetchJoinerDetails = useCallback(async () => {
    setLoadingJoiners(true);

    let idsToFetch = localJoinedUsersIds.map(id => id.toString());

    if (isJoined && currentUser) {
      idsToFetch = [currentUser, ...idsToFetch.filter(id => id !== currentUser)];
    }

    if (!idsToFetch.includes(post.poster.toString())) {
      idsToFetch.unshift(post.poster.toString());
    }

    const joinerIdsToFetch = idsToFetch.slice(0, 5);

    const fetchedUsers = await Promise.all(
        joinerIdsToFetch.map(id => getUserById(id))
    );

    const validUsers = fetchedUsers.filter(u => u !== null).map(u => ({
      id: u!.id.toString(),
      name: u!.name || `User ID: ${u!.id}`,
      avatarUrl: u!.avatarUrl,
      weixinId: u!.weixinId || '',
      email: u!.email || '',
      phone_number: u!.phone_number || ''
    } as DisplayUser));

    const posterDetail = validUsers.find(u => u.id === post.poster.toString());
    if (posterDetail) {
      setPosterContactDetails(posterDetail);
    } else if (post.poster.toString() === currentUser && user) {
      setPosterContactDetails({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        weixinId: user.weixinId || '',
        email: user.email || '',
        phone_number: user.phone_number || ''
      });
    }

    setJoinerDetails(validUsers.filter(u => u.id !== post.poster.toString()));

    setLoadingJoiners(false);
  }, [localJoinedUsersIds, getUserById, isJoined, currentUser, post.poster, user]);

  useEffect(() => {
    if (isOpen) {
      fetchJoinerDetails();
    }
  }, [isOpen, localJoinedUsersIds.length, fetchJoinerDetails]);

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

  const handleJoinLeave = () => {
    if (!user || !currentUserIdNum) return;

    const willJoin = !isJoined;

    if (willJoin) {
      setLocalJoinedUsersIds(prev => [...prev, currentUserIdNum]);
    } else {
      setLocalJoinedUsersIds(prev => prev.filter(id => id !== currentUserIdNum));
    }

    onJoin(post.id, willJoin);
  }

  const handleShowContact = () => {
    if (posterContactDetails && (posterContactDetails.email || posterContactDetails.phone_number || posterContactDetails.weixinId)) {
      setIsContactModalOpen(true);
    } else {
      toast.info(t('post_actions.no_contact_available'));
    }
  };


  const maxAvatars = 5;
  const avatarsToShow = joinerDetails.slice(0, maxAvatars);
  const remainingCount = localJoinedUsersIds.length - avatarsToShow.length;

  const joinButtonClasses = isJoined ?
      'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' :
      'bg-orange-600 hover:bg-orange-500 text-white';


  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-900 border-slate-800 shadow-2xl text-slate-200 rounded-xl">
          <div className="relative">
            <div className={`h-32 w-full relative overflow-hidden flex items-end p-6 ${getHeaderGradient()} rounded-t-xl`}>
              <div className="absolute top-0 right-0 p-4 opacity-20">
                {getHeaderIcon()}
              </div>

              <div className="relative z-10 flex w-full justify-between items-end">
                <div className="flex flex-row items-center justify-center
                              bg-black/40 text-white border-none backdrop-blur-md px-4 py-1.5 text-sm rounded-full">
                  {getTypeLabel(post.type, t)}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-14 w-14 border-4 border-slate-900 -mt-12 shadow-md">
                  {posterAvatarUrl && <AvatarImage src={posterAvatarUrl} />}
                  <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="-mt-2">
                  <h4 className="text-lg font-bold text-white">{posterName}</h4>
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

              <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    {t("home.guest_list_label")}
                    <span className="text-slate-500 text-sm font-normal">
                      ({localJoinedUsersIds.length} attending)
                    </span>
                  </h4>

                  {!(isHost || post.type === PostType.SELL || post.type === PostType.BUY) && (
                      <Button
                          className={`px-4 h-8 rounded-full font-semibold transition-all ${joinButtonClasses}`}
                          onClick={handleJoinLeave}
                      >
                        {isJoined ?
                            <><UserRoundMinus className="w-4 h-4 mr-1" /> {t("post_actions.leave")}</>
                            :
                            <><UserRoundPlus className="w-4 h-4 mr-1" /> {t("post_actions.join")}</>
                        }
                      </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-4">
                      {loadingJoiners ? (
                          <RotateCw className="size-5 animate-spin text-slate-500" />
                      ) : avatarsToShow.length > 0 ? avatarsToShow.map((joiner) => (
                          <Avatar key={joiner.id} className="h-8 w-8 rounded-full border-2 border-slate-900 shadow-md">
                            {joiner.avatarUrl && <AvatarImage src={joiner.avatarUrl} />}
                            <AvatarFallback className="bg-slate-700 text-white text-xs font-bold" title={joiner.name}>
                              {joiner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                      )) : (
                          <span className="text-sm text-slate-500">{t("post_actions.be_first")}</span>
                      )}
                    </div>
                    {remainingCount > 0 && (
                        <div className="text-xs text-slate-500 ml-1 bg-slate-800/50 px-2 py-1 rounded-full border 
                        border-slate-700">
                          + {remainingCount} {t('post_actions.more_users')}
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-slate-800 flex items-center justify-end rounded-b-xl">
                <Button
                    onClick={handleShowContact}
                    variant="ghost"
                    className="h-8 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 px-3"
                    disabled={loadingJoiners || !posterContactDetails}
                >
                  {loadingJoiners ? (
                      <RotateCw className="size-3 animate-spin mr-1" />
                  ) : (
                      <CornerDownRight className="w-3 h-3 mr-1" />
                  )}
                  {t('post_actions.show_contact')}
                </Button>
              </div>
            </div>
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