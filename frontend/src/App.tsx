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

        {/* Shell global */}
        <div className="min-h-screen w-full bg-background text-foreground no-scrollbar">
          <div className="flex flex-col min-h-screen no-scrollbar">
            <Header />

            <main className="flex-grow flex">
              {/* Container centré pour les pages */}
              <div className="w-full flex flex-col no-scrollbar">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/connexion" element={<ConnexionPage />} />
                  {/* Tu pourras ajouter d'autres routes ici (signup, dashboard, etc.) */}
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
