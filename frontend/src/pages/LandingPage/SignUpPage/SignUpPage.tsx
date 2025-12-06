import SignupForm from "@/pages/LandingPage/SignUpPage/SignUpForm.tsx";

const SignupPage = () => {
    return (
        <div className="min-h-screen w-full px-4 relative">
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#c7c6c1] to-orange-400" />
            <div className="w-full flex justify-center items-center min-h-screen pb-8 pt-12 relative z-10">
                <SignupForm />
            </div>
        </div>
    )
}

export default SignupPage