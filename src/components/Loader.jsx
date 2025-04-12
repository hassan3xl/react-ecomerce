// Loader.js
import React from 'react';

const Loader = () => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
      <div className="flex space-x-2">
        <div 
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0s' }}
        ></div>
        <div 
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div 
          className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
    </>
    // <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
    //   <div className="flex space-x-2">
    //     <div 
    //       className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
    //       style={{ animationDelay: '0s' }}
    //     ></div>
    //     <div 
    //       className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
    //       style={{ animationDelay: '0.2s' }}
    //     ></div>
    //     <div 
    //       className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
    //       style={{ animationDelay: '0.4s' }}
    //     ></div>
    //   </div>
    // </div>
  );
};

export default Loader;