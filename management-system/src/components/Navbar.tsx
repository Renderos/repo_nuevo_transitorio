"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";

function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Marcar como montado en el cliente
  }, []);

  if (!isMounted) return null;

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await signOut({ redirect: false });
      router.push("/login"); // Redirige al login tras cerrar sesión
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the accordion
  };

  const userHasAccess =
    session?.user?.role === "Admin" || session?.user?.role === "ProjectManager";

  return (
    <nav className="bg-white border-blue-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
        </Link>

        <button
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${isOpen ? "block" : "hidden"} md:block w-full md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {session ? (
              <>
                <li>
                  <Link
                    href="/home"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  >
                    Home
                  </Link>
                </li>
                {userHasAccess && (
                  <li>
                    <Link
                      href="/dashboard"
                      className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                      aria-current="page"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block py-2 px-3 text-red-600 rounded md:bg-transparent md:text-red-600 md:p-0 dark:text-white"
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
