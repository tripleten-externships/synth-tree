import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />

      <BottomTabBar />
    </div>
  );
}
