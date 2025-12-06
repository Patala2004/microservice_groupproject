import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

interface ModernInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
    type?: string;
    placeholder?: string;
}

const ModernInput = ({
                         label,
                         value,
                         onChange,
                         icon,
                         type = "text",
                         placeholder,
                     }: ModernInputProps) => (
    <div className="space-y-2 group">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-500 transition-colors ml-1">
            {label}
        </Label>
        <div className="relative">
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-black/20 border-slate-800 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 text-slate-100 pl-11 py-6 rounded-xl transition-all duration-300 placeholder:text-slate-600"
            />
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors duration-300">
                    {icon}
                </div>
            )}
        </div>
    </div>
);

export default ModernInput;