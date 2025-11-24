import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner.tsx";
import { UserProvider } from "./Context/UserContext";
import Header from "./pages/Header/Header";
import LandingPage from "@/pages/LandingPage/LandingPage.tsx";
import SignupPage from "@/pages/LandingPage/SignUpPage/SignUpPage.tsx";
import ProtectedLayout from "./pages/Utils/ProtectedLayout";
import SigninPage from "@/pages/LandingPage/ConnexionPage/SignInPage.tsx";
import Home from "@/pages/Home/Home.tsx";

function App() {
  return (
    <UserProvider>
      <Router>
        <Toaster
          richColors
          closeButton={true}
          duration={9000}
          position="top-center"
        />

        <div className="min-h-screen w-full bg-background text-foreground no-scrollbar">
          <div className="flex flex-col min-h-screen no-scrollbar">
            <Header />
            <main className="flex-grow flex">
              <div className="w-full flex flex-col no-scrollbar">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signin" element={<SigninPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/home" element={<Home />} />

                  <Route element={<ProtectedLayout />}>
                    <Route path="/test-protected" element={<div> salut</div>} />
                  </Route>
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
