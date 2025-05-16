import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import AuthModal from "./AuthModal";
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open,setOpen] = useState(false)

  function handleSubmit(mode:any, { email, password }: any) {
    if (mode === 'signup') {
      // call your signup API
      console.log('sign up', { email, password });
    } else {
      // call your signin API
      console.log('sign in', { email, password });
    }
    setOpen(false);
  }

  function handleGoogle(mode:any) {
    // Google OAuth for signup vs signin
    console.log('Google', mode);
  }


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
      <nav className="fixed  top-2 left-0 right-0 z-50  max-w-5xl mx-auto px-4">
        <div className="bg-white dark:bg-[#121212] spectral-bold flex items-center justify-between p-2 py-3 m-4 rounded-4xl px-6 shadow-lg">
          <HashLink smooth to="#top" className="text-xl font-semibold dark:text-white">
            Smart<span className="text-orange-500">Clip</span>
          </HashLink>
          <div className="hidden md:flex gap-6 dark:text-white">
            <HashLink smooth to="#about" className="cursor-pointer hover:text-amber-500 transition duration-300">About</HashLink>
            <HashLink smooth to="#value" className="cursor-pointer hover:text-amber-500 transition duration-300">Value</HashLink>
            <HashLink smooth to="#about" className="cursor-pointer hover:text-amber-500 transition duration-300">Projects</HashLink>
            <HashLink smooth to="#contact" className="cursor-pointer hover:text-amber-500 transition duration-300">Contact</HashLink>
          </div>
          <div
          
          className="flex items-center">
            <button 
            onClick={() => setOpen(true)}
            className="sm:block hidden bg-orange-500 cursor-pointer hover:bg-orange-400 transition duration-300 text-white  px-4 py-2 rounded-4xl font-semibold">
              Join Beta
            </button>
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
              <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {/* Hamburger / Close icon */}
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
           {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 bg-white dark:bg-[#121212] rounded-2xl shadow-lg p-4 space-y-4 max-w-5xl mx-auto">
            <a href="#about" className="block text-gray-700 dark:text-gray-200 hover:underline">About</a>
            <a href="#value" className="block text-gray-700 dark:text-gray-200 hover:underline">Value</a>
            <a href="#projects" className="block text-gray-700 dark:text-gray-200 hover:underline">Projects</a>
            <a href="#contact" className="block text-gray-700 dark:text-gray-200 hover:underline">Contact</a>
            <div className="mt-4">
              <button 
              onClick={() => setOpen(true)}
              className="block text-center bg-orange-500 text-white px-4 py-2 w-full rounded-4xl font-semibold">
                Join Beta
              </button>
            </div>
          </div>
        )}
      </nav>
       <AuthModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onGoogle={handleGoogle}
        onSubmit={handleSubmit}
      />

      <Outlet />
    </>
  );
};

export default Navbar;
