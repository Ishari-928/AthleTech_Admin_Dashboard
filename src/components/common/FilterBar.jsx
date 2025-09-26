import React, { useState } from 'react'

const FilterBar = ({ filters, onSearch, onClear, searchTerm: externalSearchTerm, onSearchTermChange  }) => {
   const [internalSearchTerm, setInternalSearchTerm] = useState('')
  // const [searchTerm, setSearchTerm] = useState('')
const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm

  const handleSearchChange = (value) => {
    if (onSearchTermChange) {
      onSearchTermChange(value)
    } else {
      setInternalSearchTerm(value)
    }
  }

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim()
    if (trimmedTerm.length < 2 && trimmedTerm.length > 0) {
      alert('Please enter at least 2 characters to search')
      return
    }

    if (trimmedTerm.length > 50) {
      alert('Search term cannot exceed 50 characters')
      return
    }

     // Validate if search contains only special characters
    const specialChars = /[^a-zA-Z0-9\s@.]/
    if (trimmedTerm && !/[a-zA-Z0-9]/.test(trimmedTerm)) {
      alert('Please enter a valid search term with letters or numbers')
      return
    }

    if (onSearch) onSearch(trimmedTerm)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    handleSearchChange('')
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
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                maxLength={50}
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
