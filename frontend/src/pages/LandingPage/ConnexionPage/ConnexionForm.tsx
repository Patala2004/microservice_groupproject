import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {toast} from "sonner";
import InputTextField from "@/components/own/InputTextField.tsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ConnexionForm = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const handleConnexion = async () => {

        if (!username || !password) {
            toast.error("All fields are required to login");
            return;
        }

        try {
            const {data} = await axios.post('user/api/users/login', {
                    username,
                    password
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            console.log(data);
            
            if(data.success){
                // Store the access_token in local storage
                localStorage.setItem('access_token', data.access_token);
                toast.success(`Welcome back ${data.user.name}`);
                
                // Redirect to the dashboard
                
            } else {
                toast.error(data.message || "An error occurred during login");
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
            toast.error("An error occurred during login, please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-4 w-1/3 p-4
                        border-2 border-black rounded-lg">
            <span className={"text-3xl font-bold mb-4"}>Connexion</span>
            <Separator orientation="horizontal"/>
            <div className="w-full my-4">
                <InputTextField label={"Username"}
                                setter={setUsername}
                                valueToDisplay={"Your username"}
                />
                <InputTextField
                    label="Password"
                    setter={setPassword}
                    password={true}
                    showPassword={visiblePassword}
                    valueToDisplay={"Your password"}
                    toggleShowPassword={() => setVisiblePassword(!visiblePassword)}
                />
            </div>

            <div className="flex flex-row items-center justify-between w-2/3">
                <span className="mb-2 text-sm text-blue-700 hover:underline cursor-pointer"
                      onClick={() => navigate("/signup")}
                >
                    No account? Sign up here.
                </span>
            </div>
            <Button className="w-full bg-[#8B0000] hover:bg-[#ab3f3e]" onClick={handleConnexion}>Connexion</Button>
        </div>
    );
}

export default ConnexionForm;