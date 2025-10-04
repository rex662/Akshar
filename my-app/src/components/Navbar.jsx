import React, { useState, useEffect } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import profilepic from "../assets/profilepic.jpg";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Playbook 1", href: "/test" },
  { name: "Playbook 2", href: "/handwriting" },
  { name: "QuirkQuest", href: "/quiz" },
  { name: "Enhancer", href: "/sol" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSignOut = () => {
    if (!window.confirm("Sign out and remove user data?")) return;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    alert("Signed out successfully!");
    navigate("/login");
  };

  return (
    <Disclosure as="nav" className="bg-blue-800 relative">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <h1 className="text-white font-bold text-xl">Akshar Mitra</h1>
              </div>

              {/* Desktop navigation */}
              <div className="hidden sm:flex sm:space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      "text-gray-200 hover:bg-blue-700 hover:text-white",
                      "px-3 py-2 rounded-md text-md font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right side menu */}
              <div className="flex items-center space-x-4">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={profilepic}
                      alt="Profile"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-gray-800 rounded-md shadow-lg py-1 focus:outline-none z-50">
                    {!user ? (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/login"
                              className={classNames(
                                active ? "bg-blue-700" : "",
                                "block px-4 py-2 text-sm text-white"
                              )}
                            >
                              Login
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/signup"
                              className={classNames(
                                active ? "bg-blue-700" : "",
                                "block px-4 py-2 text-sm text-white"
                              )}
                            >
                              Sign Up
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                // Create guest ID
                                let guestId = localStorage.getItem("guestId");
                                if (!guestId) {
                                  guestId = crypto.randomUUID();
                                  localStorage.setItem("guestId", guestId);
                                }
                                alert("Continuing as guest");
                                navigate("/"); // Go to homepage
                              }}
                              className={classNames(
                                active ? "bg-blue-700" : "",
                                "block w-full text-left px-4 py-2 text-sm text-white"
                              )}
                            >
                              Continue as Guest
                            </button>
                          )}
                        </Menu.Item>
                      </>
                    ) : (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={classNames(
                              active ? "bg-blue-700" : "",
                              "block w-full text-left px-4 py-2 text-sm text-white"
                            )}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Menu>

                {/* Mobile menu button */}
                <div className="sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden bg-blue-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-blue-700 hover:text-white"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
