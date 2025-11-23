import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LanguageEnum } from "@/Context/UserContext.tsx";
import axios from "axios";
import InputTextField from "@/components/own/InputTextField.tsx";

const SignupForm = () => {
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const [weXinId, setWeXinId] = useState<string>('');
    const [campus, setCampus] = useState<number>(0);
    const [preferedLanguage, setPreferedLanguage] = useState<LanguageEnum>(LanguageEnum.EN);

    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/; // chinese phone number format
    const passwordRegex = /^(?=.*[0-9]).{8,}$/; // Min 8 characters + 1 digit

    const handleSignup = async () => {
        // Check if required fields are filled
        if (!username || !name || !email || !password || !confirmPassword || !phone || !weXinId) {
            toast.error("All fields are required.");
            return;
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format.");
            return;
        }

        // Validate phone number format
        if (!phoneRegex.test(phone)) {
            toast.error("Phone number must be 11 digits.");
            return;
        }

        // Validate password strength
        if (!passwordRegex.test(password)) {
            toast.error("Password must be at least 8 characters long and contain at least one digit.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const {data} = await axios.post('user/api/users', {
                    username,
                    password,
                    name,
                    email,
                    phone_number: phone,
                    weixinId: weXinId,
                    campus,
                    preferedLanguage
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            console.log(data);

            if(data.success){
                toast.success("Signup successful! You can now log in.");
                // Redirect to the login page
                navigate("/connexion");
                cleanStates();
            }else{
                toast.error(data.message || "An error occurred during signup, please try again.");
            }
        } catch (error) {
            console.error("An error occurred during signup:", error);
            toast.error("An error occurred during signup, please try again.");
        }
    };

    const cleanStates = () => {
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setWeXinId('');
        setCampus(0);
        setPreferedLanguage(LanguageEnum.EN);
    }

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
                        Inscription
                    </span>
                    <p className="mt-2 text-lg text-neutral-200 text-center">
                        Create your account to access the platform.
                    </p>
                </div>

                <Separator className="my-3 bg-neutral-400" />

                <div className="w-full space-y-4 my-4">
                    <InputTextField
                        label="Name"
                        setter={setName}
                        valueToDisplay="Your name"
                    />
                    <InputTextField
                        label="Username"
                        setter={setUsername}
                        valueToDisplay="Your username"
                    />
                    <InputTextField
                        label="Email"
                        setter={setEmail}
                        valueToDisplay="Your email"
                    />
                    <InputTextField
                        label="Password"
                        setter={setPassword}
                        password={true}
                        showPassword={visiblePassword}
                        valueToDisplay="Your password"
                        toggleShowPassword={() => setVisiblePassword((prev) => !prev)}
                    />
                    <InputTextField
                        label="Confirm Password"
                        setter={setConfirmPassword}
                        password={true}
                        showPassword={visibleConfirmPassword}
                        valueToDisplay="Confirm your password"
                        toggleShowPassword={() => setVisibleConfirmPassword((prev) => !prev)}
                    />
                    <InputTextField
                        label="Phone number"
                        setter={setPhone}
                        valueToDisplay="Your phone number"
                    />
                    <InputTextField
                        label="WeChat ID"
                        setter={setWeXinId}
                        valueToDisplay="Your WeChat ID"
                    />
                </div>

                <div className="w-full flex justify-center mb-4">
                    <span
                        className="
                            text-xs sm:text-base 
                            text-sky-400 hover:text-sky-300 
                            hover:underline cursor-pointer 
                            transition-colors
                        "
                        onClick={() => navigate("/connexion")}
                    >
                        Already have an account ? <strong>Log in here.</strong>
                    </span>
                </div>

                {/* Bouton */}
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
                    onClick={handleSignup}
                >
                    Sign Up
                </Button>
            </div>
        </div>
    );
};

export default SignupForm;