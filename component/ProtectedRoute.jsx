"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

const ProtectedRoute = ({ children, allowedRole }) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`
      );
      return;
    }

    if (allowedRole && user.role !== allowedRole) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "owner") {
        router.replace("/owner");
      } else {
        router.replace("/traveller");
      }
    }
  }, [
    isAuthenticated,
    user,
    allowedRole,
    pathname,
    router,
  ]);

  /*
   * Don't render protected content until
   * authentication has been checked.
   */
  if (!isAuthenticated || !user) {
    return null;
  }

  /*
   * Don't render a page while redirecting
   * a user with the wrong role.
   */
  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    return null;
  }

  return children;
};

export default ProtectedRoute;