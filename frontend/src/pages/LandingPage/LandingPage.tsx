import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      {/* BACKGROUND GRADIENT PROPRE */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#c7c6c1] to-orange-400" />
      {/* Voile pour adoucir et éviter le côté “brouillon” */}

      <div className="w-full max-w-3xl flex flex-col items-center text-center gap-10">
        <div className="text-xs uppercase tracking-[0.35em] text-neutral-600 dark:text-neutral-400">
          Your App Name
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
              Your Platform
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-base text-neutral-700 dark:text-neutral-300">
            Manage your account, access your dashboard, and enjoy a clean and
            modern experience.
          </p>
        </div>

        {/* CARD CENTRALE */}
        <div
          className="
    w-full max-w-md
    bg-neutral-100/90 dark:bg-neutral-900/80
    border border-neutral-200/70 dark:border-neutral-800
    rounded-2xl
    shadow-lg shadow-black/10
    px-8 py-7
    flex flex-col items-center
    backdrop-blur-xl
  "
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Choose an option to continue
          </p>

          <div className="flex flex-col gap-4 w-full">
            <Button
              onClick={() => navigate("/connexion")}
              className="
                w-full
                h-12
                rounded-xl
                bg-gradient-to-r from-rose-600 via-red-600 to-orange-500
                hover:from-rose-500 hover:via-red-500 hover:to-orange-400
                text-sm font-semibold
                shadow-lg shadow-red-900/40
                hover:shadow-red-900/60
                transition-all
                hover:-translate-y-[2px]
              "
            >
              Login
            </Button>

            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="
                w-full
                h-12
                rounded-xl
                border-2 border-red-600/40
                text-sm font-semibold
                text-red-700 dark:text-red-400
                hover:bg-red-50/60 dark:hover:bg-red-950/50
                transition-all
              "
            >
              Sign Up
            </Button>
          </div>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
