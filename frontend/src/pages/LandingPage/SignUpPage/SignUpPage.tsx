import SignupForm from "@/pages/LandingPage/SignUpPage/SignUpForm.tsx";

const SignupPage = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center px-4 ">
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#c7c6c1] to-orange-400" />
            <div className="w-full flex justify-center items-center pb-8 pt-12">
                <SignupForm />
            </div>
        </div>
    )
}

export default SignupPage