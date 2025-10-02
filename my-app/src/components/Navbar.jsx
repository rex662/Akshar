import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import profilepic from '../assets/profilepic.jpg';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Playbook 1', href: '/test', current: true },
  { name: 'Playbook 2', href: '/handwriting', current: true },
  { name: 'Enhancer', href: '/sol', current: true },
  { name: 'QuirkQuest', href: '/quiz', current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
                      item.current
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-200 hover:bg-blue-700 hover:text-white',
                      'px-3 py-2 rounded-md text-md font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Dark/Light mode toggle */}
                

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
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={classNames(
                            active ? 'bg-blue-700' : '',
                            'block px-4 py-2 text-sm text-white'
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active ? 'bg-blue-700' : '',
                            'block w-full text-left px-4 py-2 text-sm text-white'
                          )}
                        >
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>

                {/* Mobile menu button */}
                <div className="sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" />
                    )}
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
                  className={classNames(
                    item.current
                      ? 'bg-blue-900 text-white'
                      : 'text-gray-200 hover:bg-blue-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
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
