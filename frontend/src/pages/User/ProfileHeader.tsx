import {useTranslation} from "react-i18next";


const ProfileHeader= () => {
    const {t} = useTranslation();
    return (
        <div className="mb-12 text-center sm:text-left space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 drop-shadow-sm">
              {t("profile.title")}
            </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
                {t("profile.subtitle")}
            </p>
        </div>
    )
}

export default ProfileHeader;