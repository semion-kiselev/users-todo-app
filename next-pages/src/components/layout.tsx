import { Inter } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className={`p-4 ${inter.className}`}>
      <header className="text-lg p-4 border-b-2">
        <div className="flex gap-2">
          <Link
            href="/"
            className={`underline text-blue-500 ${
              pathname === '/' ? 'font-bold' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`underline text-blue-500 ${
              pathname === '/about' ? 'font-bold' : ''
            }`}
          >
            About
          </Link>
          <Link
            href="/todos"
            className={`underline text-blue-500 ${
              pathname === '/todos' ? 'font-bold' : ''
            }`}
          >
            Todos
          </Link>
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};
