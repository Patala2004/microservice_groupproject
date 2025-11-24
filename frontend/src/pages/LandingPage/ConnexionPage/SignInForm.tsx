import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import InputTextField from "@/components/own/InputTextField.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const SignInForm = () => {
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
      <Card variant="form-theme">
        <div className="w-full flex flex-col items-center mb-4">
          <span className="text-4xl font-bold tracking-tight bg-gradient-to-r 
                          from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
            Connexion
          </span>
          <p className="mt-2 text-lg text-neutral-200 text-center">
            Connect to your account to access the <strong>platform</strong>.
          </p>
        </div>

        <div className="w-full space-y-4 mt-2 mb-4">
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

        <Button
          variant="gradient-fire" size="full-width"
          onClick={handleConnexion}
        >
          Sign In 
        </Button>
        
        <div className="w-full flex justify-end mt-5 mb-1">
          <span
            className="
                    text-xs sm:text-base 
                    text-sky-400 hover:text-sky-300 
                    hover:underline cursor-pointer 
                    transition-colors"
            onClick={() => navigate("/signup")}
          >
            No account ? <strong>Sign up here.</strong>
          </span>
        </div>

      </Card>
    </div>
  );
};

export default SignInForm;
