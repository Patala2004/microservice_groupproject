import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NoAccess = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#c7c6c1] to-orange-400" />
            <div className="w-full max-w-3xl flex flex-col items-center text-center gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl sm:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Access{" "}
                        <span className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
                          Denied
                        </span>
                    </h1>

                    <p className="text-xl text-neutral-800 dark:text-neutral-300">
                        You need to be authenticated to access this page. <strong>Please log in first.</strong> <br />
                        This platform requires user authentication to ensure secure access to your personal content.
                    </p>
                </div>

                <div
                    className="
            w-full max-w-md
            bg-gradient-to-br from-neutral-600 via-neutral-950 to-black 
            border border-neutral-200/70 dark:border-neutral-800
            rounded-2xl
            shadow-lg shadow-black/10
            px-8 py-7
            flex flex-col items-center
            backdrop-blur-xl
          "
                >
                    <div className="flex flex-col gap-4 w-full">
                        <Button
                            onClick={() => navigate("/signin")}
                            className="
                w-full
                h-12
                rounded-xl
                text-white
                bg-gradient-to-r from-rose-600 via-red-600 to-orange-500
                hover:from-rose-500 hover:via-red-500 hover:to-orange-400
                text-xl font-bold
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
                bg-white
                h-12
                rounded-xl
                border-red-600/40
                text-xl font-semibold
                text-red-700 dark:text-red-400
                hover:bg-gray-300
                hover:-translate-y-[2px]
                hover:text-red-800 
                transition-all
              "
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoAccess;