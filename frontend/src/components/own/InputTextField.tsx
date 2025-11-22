import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface InputTextFieldProps {
    label: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    valueToDisplay?: string;
    displayAsterisk?: boolean;
    password?: boolean;
    showPassword?: boolean;
    toggleShowPassword?: () => void;
}

const InputTextField = ({
                            label,
                            setter,
                            disabled,
                            valueToDisplay,
                            displayAsterisk = true,
                            password = false,
                            showPassword,
                            toggleShowPassword
                        }: InputTextFieldProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    const returnAsterisk = () => {
        if (!displayAsterisk) return "";
        return <span className="text-red-500">*</span>;
    };

    return (
        <div className="grid grid-cols-1 gap-2 mb-4 relative">
            <span className="text-base font-semibold">
                {label} {returnAsterisk()}
            </span>
            <div className="relative">
                <Input
                    id={label}
                    type={password && !showPassword ? "password" : "text"}
                    placeholder={valueToDisplay || `Entrer ${label}`}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md text-sm pr-10"
                    disabled={disabled}
                />
                {password && toggleShowPassword && (
                    <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputTextField;