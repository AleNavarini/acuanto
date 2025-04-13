import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full py-6 border-t-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        &copy; {new Date().getFullYear()} A Quanto?. Todos los derechos reservados.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link
                            href="mailto:alejandronavarini@gmail.com"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Contacto
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Sobre nosotros
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}