import React, { useState } from 'react'
import Table from '../components/common/Table'
import FilterBar from '../components/common/FilterBar'

const SchoolRanking = () => {
  const [yearFilter, setYearFilter] = useState('2023')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const rankings = [
    { school: 'ABC', firstPlaces: 1, secondPlaces: 1, thirdPlaces: 1, totalPoints: 9 },
    { school: 'B', firstPlaces: 1, secondPlaces: 1, thirdPlaces: 0, totalPoints: 8 },
    { school: "C", firstPlaces: 5, secondPlaces: 0, thirdPlaces: 0, totalPoints: 5 },
    { school: 'D', firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0, totalPoints: 0 },
    { school: 'E', firstPlaces: 0, secondPlaces: 0, thirdPlaces: 1, totalPoints: 1 },
   
  ]

 const filteredRankings = rankings.filter(item => {
    // Search filter - search in school name
    const matchesSearch = searchTerm === '' || 
      item.school.toLowerCase().includes(searchTerm.toLowerCase())
    
    // School filter
    const matchesSchool = schoolFilter === 'all' || 
      item.school.toLowerCase().includes(schoolFilter.toLowerCase())

    return matchesSearch && matchesSchool
  })

  const columns = [
    { header: 'School/Club Name', accessor: 'school' },
    { header: '1st Places', accessor: 'firstPlaces' },
    { header: '2nd Places', accessor: 'secondPlaces' },
    { header: '3rd Places', accessor: 'thirdPlaces' },
    { header: 'Total Points', accessor: 'totalPoints' },
  ]

  const filters = [
    {
      label: 'Year',
      options: [
        { value: 'all', label: 'All Years' },
        { value: '2025', label: '2025' },
        
      ],
      value: yearFilter,
      onChange: setYearFilter,
    },
    {
      label: 'School/Club',
      options: [
        { value: 'all', label: 'All Schools' },
        { value: 'royal', label: 'ABC' },
        { value: 'ananda', label: 'B' },
        { value: 'stjoseph', label: "C" },
        { value: 'stjoseph', label: "D" },
        { value: 'stjoseph', label: "E" },
      ],
      value: schoolFilter,
      onChange: setSchoolFilter,
    },
  ]

  const handleSearch = (term) => {
    console.log('Search term received:', term)
    setSearchTerm(term)
  }

  const handleClearFilters = () => {
    setYearFilter('all')
    setSchoolFilter('all')
    setSearchTerm('')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">School/Club Ranking</h1>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />

      {/* Table with Actions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">Rankings
              {searchTerm && ` - Searching for "${searchTerm}"`}
              {filteredRankings.length !== rankings.length && ` (${filteredRankings.length} of ${rankings.length} results)`}
            </h2>
            <div className="flex space-x-2">
              {/* <button className="bg-[#1A73E8] text-white px-4 py-2 rounded hover:bg-blue-700">
                Export PDF
              </button> */}
              {/* <button className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]">
                Print Report
              </button> */}
            </div>
          </div>
           {filteredRankings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No schools found matching your search criteria.
            </div>
          ) : (
            <Table columns={columns} data={filteredRankings} />
          )}
        </div>
      </div>
    </div>
  )
}

export default SchoolRanking
