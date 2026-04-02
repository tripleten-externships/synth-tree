import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";


export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top navigation */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
