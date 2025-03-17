'use client';

import Image from 'next/image';

interface HeaderProps {
  user: {
    username: string;
  };
  logout: () => void;
}

export default function Header({ user, logout }: HeaderProps) {
  return (
    <div className="flex justify-between items-center w-full row-start-1 sticky top-0 z-10 bg-white dark:bg-black py-4">
      <div>
        <Image
          className="dark:invert"
          src="/pokemon_logo.svg"
          alt="Pok&eacute;mon logo"
          width={100}
          height={35}
          priority
        />
      </div>
      <div className="text-sm">
        Welcome, {user.username} |
        <button
          onClick={logout}
          className="ml-2 text-blue-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 