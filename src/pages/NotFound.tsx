
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">The page you're looking for doesn't exist</p>
        <p className="text-gray-500 mb-8">
          The link you followed may be broken, or the page may have been removed.
        </p>
        <Link to="/">
          <Button className="bg-black text-white hover:bg-gray-800">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
