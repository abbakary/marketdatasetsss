import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/public/datasets", { replace: true });
  }, [navigate]);

  return null;
}
