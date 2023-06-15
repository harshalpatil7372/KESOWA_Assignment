import React from 'react';

const Sidebar = ({ onSearch, searchLocation }) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="p-5 m-2">
      <div className="p-5">
        <input
          type="search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search locations"
          value={searchLocation}
          onChange={handleSearchChange}
          required
        />
      </div>

      <div className="p-2">
        <button className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Draw Shape
        </button>
        <button className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save Shape
        </button>
        <button className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Calculate Area
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
