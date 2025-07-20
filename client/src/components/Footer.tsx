
import { FaTwitter, FaGoogle, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer
    id="contact"
    className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="flex items-center text-white text-xl font-semibold">
            <span className="mr-2 text-2xl">🎥</span>
            SmartClip
          </h3>
          <p className="text-sm">
            A web application that allows users to upload or link a video, clip a specific section
            <br />
            get a GPT-generated explanation of that section, and download the clipped video.
          </p>
          <a
            href="/clipVideos"
            className="inline-block bg-orange-600 hover:bg-amber-500  text-white font-medium py-2 px-4 rounded-lg transition  duration-300"
          >
            Explore Now
          </a>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-white font-semibold mb-4">FEATURES</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#ai" className="hover:text-white">AI Assistant</a></li>
            <li><a href="#analytics" className="hover:text-white">Analytics</a></li>
            <li><a href="#monetization" className="hover:text-white">Monetization</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white font-semibold mb-4">RESOURCES</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#docs" className="hover:text-white">Documentation</a></li>
            <li><a href="#help" className="hover:text-white">Help Center</a></li>
            <li><a href="#blog" className="hover:text-white">Blog</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">COMPANY</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white">About Us</a></li>
            <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8"></div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-6">
        <div className="flex space-x-4">
          <a href="https://twitter.com" className="hover:text-white">
            <FaTwitter size={20} />
          </a>
          <a href="https://google.com" className="hover:text-white">
            <FaGoogle size={20} />
          </a>
          <a href="https://youtube.com" className="hover:text-white">
            <FaYoutube size={20} />
          </a>
        </div>
        <p className="text-sm mt-4 md:mt-0">
          © {new Date().getFullYear()} SmartClip. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
