import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LanguageEnum } from "@/Context/userTypes.tsx";
import InputTextField from "@/components/own/InputTextField.tsx";
import api from "@/lib/api/axios.ts";
import { Card } from "@/components/ui/card";

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
            console.log(phone.length);
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
            const {data} = await api.post('user/api/users', {
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
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log(data);

            if(data.success){
                toast.success("Signup successful! You can now log in.");
                navigate("/signin");
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
            <Card variant="form-theme">
                <div className="w-full flex flex-col items-center mb-4">
                    <span className="text-4xl font-bold tracking-tight bg-gradient-to-r 
                          from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
                        Inscription
                    </span>
                    <p className="mt-2 text-lg text-neutral-200 text-center">
                        Create your account to access the <strong>platform</strong>.
                    </p>
                </div>
                
                <div className="w-full space-y-4 mt-2 mb-4">
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

                <Button
                    variant="gradient-fire" 
                    size="full-width"
                    onClick={handleSignup}
                >
                    Create the account
                </Button>

                <div className="w-full flex justify-end mt-5 mb-1">
                    <span
                        className="
                            text-xs sm:text-base 
                            text-sky-400 hover:text-sky-300 
                            hover:underline cursor-pointer 
                            transition-colors
                        "
                        onClick={() => navigate("/signin")}
                    >
                        Already have an account ? <strong>Log in here.</strong>
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default SignupForm;