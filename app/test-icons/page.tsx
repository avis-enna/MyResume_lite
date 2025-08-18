'use client';

import { MonochromeIcon } from '../components/icons';

export default function TestIcons() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Monochrome Icon Test</h1>
      
      <div className="grid grid-cols-6 gap-4">
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="user" size={32} />
          <span className="text-sm mt-2">user</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="phone" size={32} />
          <span className="text-sm mt-2">phone</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="lightbulb" size={32} />
          <span className="text-sm mt-2">lightbulb</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="briefcase" size={32} />
          <span className="text-sm mt-2">briefcase</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="folder" size={32} />
          <span className="text-sm mt-2">folder</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="edit" size={32} />
          <span className="text-sm mt-2">edit</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="plus" size={32} />
          <span className="text-sm mt-2">plus</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="trash" size={32} />
          <span className="text-sm mt-2">trash</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="eye" size={32} />
          <span className="text-sm mt-2">eye</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="logout" size={32} />
          <span className="text-sm mt-2">logout</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="menu" size={32} />
          <span className="text-sm mt-2">menu</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
          <MonochromeIcon name="message" size={32} />
          <span className="text-sm mt-2">message</span>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-black text-white rounded-lg">
        <h2 className="text-lg font-bold mb-4">Dark Theme Test</h2>
        <div className="flex space-x-4">
          <MonochromeIcon name="user" size={24} className="text-yellow-400" />
          <MonochromeIcon name="phone" size={24} className="text-green-400" />
          <MonochromeIcon name="lightbulb" size={24} className="text-blue-400" />
          <MonochromeIcon name="briefcase" size={24} className="text-red-400" />
        </div>
      </div>
    </div>
  );
}
