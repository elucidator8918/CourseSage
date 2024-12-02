import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      // Decode the token to get its expiration date
      const decodedToken = jwtDecode(token);

      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        // Token is valid and has not expired
        setLogged(true);
      } else {
        // Token is either invalid or expired, perform logout
        handleLogOut();
      }
    } else {
      setLogged(false);
    }
  }, []);

  const handleLogOut = () => {
    // Remove JWT token from local storage on logout
    localStorage.removeItem("jwt");
    localStorage.removeItem("userLists");
    setLogged(false);
    navigate("/");
  };

  return (
    <div className="flex flex-row static">
      <header className="absolute inset-x-0 top-0 z-50 bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-600">
        <nav
          className="flex items-center justify-between p-2 mb-1 lg:px-8 h-16"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a className="p-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg">
              <a
                className="text-md md:text-xl font-bold flex justify-center items-left tracking-tight bg-gradient-to-r from-blue-400 to-purple-700 bg-clip-text text-transparent "
                onClick={() => navigate("/")}
              >
                CurateSage
              </a>
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a
              className="text-md font-semibold leading-6 text-gray-200 hover:font-extrabold hover:shadow-xl transition-all ease-in duration-100 p-2 rounded-lg"
              onClick={() => navigate("/")}
            >
              Home
            </a>
            <a
              className="text-md font-semibold leading-6 text-gray-200 hover:font-extrabold hover:shadow-xl transition-all ease-in duration-100 p-2 rounded-lg"
              onClick={() => navigate("/Dashboard")}
            >
              Dashboard
            </a>
          </div>
          <div className="flex flex-1 justify-end">
            {logged ? (
              <>
                <a
                  className="text-sm font-semibold leading-6 text-gray-200 mr-2 p-2 hover:bg-gray-200 hover:text-indigo-900 rounded-md transition-all duration-500 ease-in-out border-2 border-white"
                  onClick={() => navigate("/preferences")}
                >
                  PREFERENCES
                </a>
                <a
                  className="text-sm font-semibold leading-6 text-gray-200 mr-2 p-2 hover:bg-gray-200 hover:text-indigo-900 rounded-md transition-all duration-500 ease-in-out border-2 border-white"
                  onClick={handleLogOut}
                >
                  Log Out <span aria-hidden="true">&rarr;</span>
                </a>
              </>
            ) : (
              <>
                <a
                  className="text-sm font-semibold leading-6 text-gray-200 mr-2 p-2 hover:bg-gray-200 hover:text-indigo-900 rounded-md transition-all duration-500 ease-in-out border-2 border-white"
                  onClick={() => navigate("/Signup")}
                >
                  Sign Up
                </a>
                <a
                  className="text-sm font-semibold leading-6 text-gray-200 p-2 hover:bg-gray-200 hover:text-indigo-900 rounded-md transition-all duration-500 ease-in-out border-2 border-white"
                  onClick={() => navigate("/Login")}
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
              </>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
