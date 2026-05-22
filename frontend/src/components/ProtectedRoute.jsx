import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  console.log("usuario:");
  console.log(user);

  if (loading) return null; // Espera a que termine de verificar el token

  if (!user) return <Navigate to="/signin" replace />;

  return children;
}