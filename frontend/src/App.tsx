import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner.tsx";
import { UserProvider } from "./Context/UserContext";
import Header from "./pages/Header/Header";
import LandingPage from "@/pages/LandingPage/LandingPage.tsx";
import ConnexionPage from "./pages/LandingPage/ConnexionPage/ConnexionPage";

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
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/connexion" element={<ConnexionPage />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
        </UserProvider>
    );
}

export default App;
