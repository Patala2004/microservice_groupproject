const SeparatorWithText = ({ text }: { text: string }) => (
    <div className="flex items-center w-full my-2">
        <div className="flex-grow border-t text-white"></div>
        <span className="flex-shrink mx-4 text-xl font-semibold text-white uppercase">
            {text}
        </span>
        <div className="flex-grow border-t text-white"></div>
    </div>
);

export default SeparatorWithText;