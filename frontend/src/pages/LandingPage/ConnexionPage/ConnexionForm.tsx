import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { toast } from "sonner";
import InputTextField from "@/components/own/InputTextField.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConnexionForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleConnexion = async () => {
    if (!username || !password) {
      toast.error("All fields are required to login");
      return;
    }

    try {
      const { data } = await axios.post(
        "user/api/users/login",
        { username, password },
        {
          headers: {
            "Content-Type":"application/json",
          },
        }
      );

      console.log(data);

      if (data.success) {
        localStorage.setItem("access_token", data.access_token);
        toast.success(`Welcome back ${data.user.name}`);
        navigate("/dashboard");
      } else {
        toast.error(data.message || "An error occurred during login");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      toast.error("An error occurred during login, please try again.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="
                    w-full max-w-xl
                    bg-gradient-to-br from-neutral-600 via-neutral-950 to-black 
                    border border-neutral-800 
                    rounded-2xl 
                    shadow-xl shadow-black/40 
                    px-8 py-7
                    flex flex-col items-center
                    backdrop-blur
                "
      >
        <div className="w-full flex flex-col items-center mb-4">
          <span className="text-4xl font-bold tracking-tight bg-gradient-to-r 
                          from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
            Connexion
          </span>
          <p className="mt-2 text-lg text-neutral-200 text-center">
            Connect to your account to access the platform.
          </p>
        </div>

        <Separator className="my-3 bg-neutral-400" />

        <div className="w-full space-y-4 my-4">
          <InputTextField
            label="Username"
            setter={setUsername}
            valueToDisplay="Your username"
          />
          <InputTextField
            label="Password"
            setter={setPassword}
            password={true}
            showPassword={visiblePassword}
            valueToDisplay="Your password"
            toggleShowPassword={() => setVisiblePassword((prev) => !prev)}
          />
        </div>

        <div className="w-full flex justify-center mb-4">
          <span
            className="
                            text-xs sm:text-sm 
                            text-sky-400 hover:text-sky-300 
                            hover:underline cursor-pointer 
                            transition-colors
                        "
            onClick={() => navigate("/signup")}
          >
            No account ? <strong>Sign up here.</strong>
          </span>
        </div>

        <Button
          className="
                        w-3/4
                        h-11 
                        rounded-xl 
                        text-base font-bold
                        bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 
                        hover:from-rose-500 hover:via-red-500 hover:to-orange-400
                        text-white
                        duration-150 
                        shadow-lg shadow-red-900/40 
                        hover:-translate-y-[1px] hover:shadow-red-900/60"
          onClick={handleConnexion}
        >
          Connexion
        </Button>
      </div>
    </div>
  );
};

export default ConnexionForm;
