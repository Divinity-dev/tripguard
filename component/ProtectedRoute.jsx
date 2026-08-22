"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

import { getCurrentUser } from "../redux/actions/authActions";

const ProtectedRoute = ({ children, allowedRole }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [checkingAuth, setCheckingAuth] = useState(
    !isAuthenticated || !user
  );

  useEffect(() => {
    let mounted = true;

    const checkAuthentication = async () => {
      // Redux already has the authenticated user.
      if (isAuthenticated && user) {
        if (mounted) {
          setCheckingAuth(false);
        }

        return;
      }

      // Redux is empty, so restore authentication
      // from the HTTP-only cookie.
      const result = await dispatch(getCurrentUser());

      if (!mounted) return;

      if (!result?.user) {
        router.replace(
          `/login?redirect=${encodeURIComponent(pathname)}`
        );

        return;
      }

      setCheckingAuth(false);
    };

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, [
    dispatch,
    isAuthenticated,
    user,
    pathname,
    router,
  ]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9f8]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#16a765]" />

          <p className="mt-3 text-sm text-gray-500">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") {
      router.replace("/admin");
    } else if (user.role === "owner") {
      router.replace("/owner");
    } else {
      router.replace("/traveller");
    }

    return null;
  }

  return children;
};

export default ProtectedRoute;