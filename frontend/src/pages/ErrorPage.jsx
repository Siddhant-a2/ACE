import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl">
        <div className="card-body items-center text-center space-y-4">
          
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-error" />
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-extrabold text-error">404</h1>

          {/* Message */}
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-base-content/70">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>

          {/* Action */}
          <div className="pt-4">
            <Link to="/" className="btn btn-primary gap-2">
              <Home className="w-4 h-4" />
              Go Back Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Error;
