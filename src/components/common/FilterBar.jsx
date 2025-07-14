import React, { useState } from 'react'

const FilterBar = ({ filters, onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    if (onSearch) onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
    if (onClear) onClear()
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filters.map((filter, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onSearch && (
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
              />
              <button
                onClick={handleSearch}
                className="bg-[#FF5722] text-white px-4 py-2 hover:bg-[#B33F18] rounded-r"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {onClear && (
          <div className="flex items-end">
            <button
              onClick={handleClear}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterBar
