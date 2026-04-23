import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll position on every route change. Mount once inside
 * SharedLayout — without this, React Router preserves scroll Y between
 * navigations and the user lands mid-page on the new route.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
