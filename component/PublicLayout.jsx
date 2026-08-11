"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = ({ children }) => {
const pathname = usePathname();

const isAdminRoute =
pathname === "/admin" ||
pathname.startsWith("/admin/");

if (isAdminRoute) {
return children;
}

return ( <div className="flex min-h-screen flex-col"> <Navbar />


  <main className="flex-1">
    {children}
  </main>

  <Footer />
</div>


);
};

export default PublicLayout;
