import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { toast } from "sonner";
import {useNavigate} from "react-router-dom";
import {LanguageEnum} from "@/Context/UserContext.tsx";
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
                    weixinId: weXinId ,
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
        <div className="flex flex-col items-center justify-center px-4 w-1/3 border-2 border-black rounded-lg p-2">
            <span className="text-3xl font-bold mb-4">Inscription</span>
            <Separator orientation="horizontal"/>
            <div className="w-full my-4">
                <InputTextField label="Name" setter={setName} valueToDisplay="Your name"/>
                <InputTextField label="Email" setter={setEmail} valueToDisplay="Your email"/>
                <InputTextField
                    label="Password"
                    setter={setPassword}
                    password={true}
                    showPassword={!visiblePassword}
                    toggleShowPassword={() => setVisiblePassword(!visiblePassword)}
                    valueToDisplay="Your password"
                />
                <InputTextField
                    label="Confirmation of Password"
                    setter={setConfirmPassword}
                    password={true}
                    showPassword={visibleConfirmPassword}
                    toggleShowPassword={() => setVisibleConfirmPassword(!visibleConfirmPassword)}
                    valueToDisplay="Confirmation of your password"
                />
                <InputTextField label="Phone number" setter={setPhone} valueToDisplay="Your phone number"/>
                <InputTextField
                    label="WeChat-WeXin ID"
                    setter={setWeXinId}
                    valueToDisplay="Your WeChat-WeXin ID"
                />
            </div>

            <span className="mb-2 text-sm text-blue-700 hover:underline cursor-pointer"
                  onClick={() => navigate("/connexion")}
            >
                Already registered? Log in here
            </span>

            <Button className="w-full bg-[#8B0000] hover:bg-[#ab3f3e]" onClick={handleSignup}>
                Sign Up
            </Button>
        </div>
    );
};

export default SignupForm;
