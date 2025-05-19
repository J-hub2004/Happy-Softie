import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-6 rounded-full bg-red-100 p-6 text-red-600">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mb-8 text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Home className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;