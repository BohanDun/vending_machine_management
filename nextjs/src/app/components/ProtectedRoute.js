"use client"

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    if (loading) {
        return null;
    }

    return user ? children : null;
};

export default ProtectedRoute;
