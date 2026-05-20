import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ye function har baar page change hone par scroll top par le jayega
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}