import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import AuthModal from "./AuthModal";
import { BACKEND_URL, onSignin, onSignup } from "@/api";
import { Clapperboard, Github, Menu, Moon, Sun, X } from "lucide-react";
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoding] = useState(false);
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuth");

  async function handleSubmit(mode: any, { username, email, password }: any) {
    if (mode === "signup") {
      try {
        setLoading(true);
        console.log("Signup payload:", { username, email, password });
        const res = await onSignup({ username, email, password });
        console.log("Signup success:", res);
        localStorage.setItem("isAuth", "true");
        setErrors([]);
        navigate("/clipVideos");
      } catch (err: any) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response?.data?.message) {
          setErrors([err.response.data.message]);
        } else {
          setErrors(["Something went wrong. Please try again."]);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        console.log("Signup payload:", { email, password });
        const res = await onSignin({ email, password });
        console.log("SignIn success:", res);
        localStorage.setItem("isAuth", "true");
        setErrors([]);
        navigate("/clipVideos");
      } catch (err: any) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response?.data?.message) {
          setErrors([err.response.data.message]);
        } else {
          setErrors(["Something went wrong. Please try again."]);
        }
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleGoogle() {
    try {
      setGoogleLoding(true);
      window.location.href =
        `${BACKEND_URL}/api/v1/users/google`;
      localStorage.setItem("isAuth", "true");
    } catch (error) {
      console.error("Google Login Error : ", error);
    } finally {
      setGoogleLoding(false);
    }
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
  const navLinkClasses =
    "text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-white transition-colors duration-300";

  return (
    <>
      <nav className="fixed font-semibold z-10 w-full bg-white/30 dark:bg-black/80 backdrop-blur-lg  dark:border-gray-800">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-14">
              <HashLink smooth to="#top" className="flex items-center gap-2">
                <Clapperboard className="h-8 w-8 text-orange-500" />
                <span className="text-2xl text-slate-800 dark:text-white font-bold">
                  Smart<span className="text-orange-500">Clip</span>
                </span>
              </HashLink>
              <div className="hidden md:flex items-center gap-8">
                <HashLink smooth to="#features" className={navLinkClasses}>
                  Features
                </HashLink>
                <HashLink smooth to="#about" className={navLinkClasses}>
                  About
                </HashLink>
                <HashLink smooth to="#value" className={navLinkClasses}>
                  Value
                </HashLink>
                <HashLink smooth to="#contact" className={navLinkClasses}>
                  Contact
                </HashLink>
                
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/Rohan11203/SmartClip.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2  cursor-pointer"
                >
                  <Github
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </a>
                <button  onClick={toggleDarkMode} className="p-2   cursor-pointer">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {isAuth === "true" ? (
                  <button
                    onClick={() => navigate("/clipVideos")}
                    className="hidden md:block bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 cursor-pointer"
                  >
                    Try Now
                  </button>
                ) : (
                  <button
                    onClick={() => setOpen(true)}
                    className="hidden md:block bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 cursor-pointer transition-colors duration-300"
                  >
                    Login
                  </button>
                )}
              </div>
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2  cursor-pointer"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <HashLink
                smooth
                to="#contact"
                className="block text-center py-2"
                onClick={toggleMobileMenu}
              >
                Contact
              </HashLink>
              <HashLink
                smooth
                to="#about"
                className="block text-center py-2"
                onClick={toggleMobileMenu}
              >
                About
              </HashLink>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-center py-2"
              >
                <Github size={20} /> GitHub
              </a>
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                {isAuth === "true" ? (
                  <button
                    onClick={() => {
                      navigate("/clipVideos");
                      toggleMobileMenu();
                    }}
                    className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg"
                  >
                    Try Now
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(true);
                      toggleMobileMenu();
                    }}
                    className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <AuthModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onGoogle={handleGoogle}
        onSubmit={handleSubmit}
        error={errors}
        loading={loading}
        googleLoading={googleLoading}
      />

      <Outlet />
    </>
  );
};

export default Navbar;
