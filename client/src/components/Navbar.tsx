import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check for system preference on component mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // If no saved preference, check system preference
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed top-5 left-0 right-0 z-50  max-w-5xl mx-auto px-4 ">
        <div className="bg-white dark:bg-[#121212] spectral-bold flex items-center justify-between p-2 py-3 m-4 rounded-4xl px-6 shadow-lg">
          <div className="text-xl font-semibold dark:text-white">
            Smart<span className="text-orange-500">Clip</span>
          </div>
          <div className="flex gap-6 dark:text-white">
            <div>About</div>
            <div>Value</div>
            <div>Projects</div>
            <div>Contact</div>
          </div>
          <div className="flex items-center">
            <div className=" bg-orange-500 text-white  px-4 py-2 rounded-4xl font-semibold">
              Join Beta
            </div>
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
