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
  displayAsterisk = false,
  password = false,
  showPassword,
  toggleShowPassword,
}: InputTextFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label
        htmlFor={inputId}
        className="flex items-center justify-between text-base font-medium tracking-wide text-white dark:text-neutral-100"
      >
        <span>{label}</span>
        {displayAsterisk && (
          <span className="ml-1 text-red-500 text-[10px] align-top">*</span>
        )}
      </label>

      {/* Input + icon */}
      <div className="relative">
        <Input
          id={inputId}
          type={password && !showPassword ? "password" : "text"}
          placeholder={valueToDisplay || `Enter ${label}`}
          onChange={handleChange}
          disabled={disabled}
          className="
            w-full h-10
            rounded-xl
            border border-neutral-300/80 dark:border-neutral-700
            bg-white/80 dark:bg-neutral-900/70
            text-sm text-neutral-900 dark:text-neutral-100
            placeholder:text-neutral-600 dark:placeholder:text-neutral-500
            pr-10
            shadow-sm
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#8B0000]
            focus-visible:border-[#8B0000]
            focus-visible:shadow-md
            disabled:cursor-not-allowed disabled:opacity-60
          "
        />

        {password && toggleShowPassword && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="
              absolute inset-y-0 right-0
              flex items-center pr-3
              text-neutral-400 hover:text-neutral-600
              dark:text-neutral-500 dark:hover:text-neutral-300
              transition-colors
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-offset-2
              focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500
              rounded-full
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputTextField;
