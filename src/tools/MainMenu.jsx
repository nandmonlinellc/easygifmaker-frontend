import React from 'react';
import { Link } from 'react-router-dom';

export default function MainMenu() {
  return (
    <nav className="w-full bg-white border-b mb-6 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold text-purple-700">EasyGIFMaker</Link>
        <div className="flex gap-6">
          <Link to="/about" className="hover:underline text-gray-700">About</Link>
        </div>
      </div>
    </nav>
  );
}
