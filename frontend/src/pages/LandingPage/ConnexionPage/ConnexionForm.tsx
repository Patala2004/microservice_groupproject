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
            // Si ton backend attend du JSON, préfère :
            // "Content-Type": "application/json"
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(data);

      if (data.success) {
        localStorage.setItem("access_token", data.access_token);
        toast.success(`Welcome back ${data.user.name}`);

        // Redirection vers le dashboard (ou autre page)
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
      {/* Card avec effet moderne + gradient */}
      <div
        className="
                    w-full max-w-md 
                    bg-gradient-to-br from-neutral-900 via-neutral-950 to-black 
                    border border-neutral-800 
                    rounded-2xl 
                    shadow-xl shadow-black/40 
                    px-8 py-7
                    flex flex-col items-center
                    backdrop-blur
                "
      >
        {/* Header */}
        <div className="w-full flex flex-col items-center mb-4">
          <span className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-1">
            Welcome back
          </span>
          <span className="text-3xl font-semibold tracking-tight text-white">
            Connexion
          </span>
          <p className="mt-2 text-sm text-neutral-400 text-center">
            Connect to your account to access your dashboard.
          </p>
        </div>

        <Separator className="my-3 bg-neutral-800" />

        {/* Champs */}
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

        {/* Lien inscription */}
        <div className="w-full flex justify-end mb-4">
          <span
            className="
                            text-xs sm:text-sm 
                            text-sky-400 hover:text-sky-300 
                            hover:underline cursor-pointer 
                            transition-colors
                        "
            onClick={() => navigate("/signup")}
          >
            No account? Sign up here.
          </span>
        </div>

        {/* Bouton */}
        <Button
          className="
                        w-full 
                        h-11 
                        rounded-xl 
                        text-sm font-medium 
                        bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 
                        hover:from-rose-500 hover:via-red-500 hover:to-orange-400
                        transition-transform transition-shadow 
                        duration-150 
                        shadow-lg shadow-red-900/40 
                        hover:-translate-y-[1px] hover:shadow-red-900/60
                    "
          onClick={handleConnexion}
        >
          Connexion
        </Button>
      </div>
    </div>
  );
};

export default ConnexionForm;
