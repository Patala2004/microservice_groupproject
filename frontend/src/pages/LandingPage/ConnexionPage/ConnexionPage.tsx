import ConnexionForm from "@/pages/LandingPage/ConnexionPage/ConnexionForm.tsx";

const ConnexionTab = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#c7c6c1] to-orange-400" />
      <div className="w-full flex justify-center items-center">
        <ConnexionForm />
      </div>
    </div>
  );
};

export default ConnexionTab;
