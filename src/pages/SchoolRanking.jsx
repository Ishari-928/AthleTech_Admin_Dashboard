import React, { useState } from 'react'
import Table from '../components/common/Table'
import FilterBar from '../components/common/FilterBar'

const SchoolRanking = () => {
  const [yearFilter, setYearFilter] = useState('2023')
  const [schoolFilter, setSchoolFilter] = useState('all')

  const rankings = [
    { school: 'A', firstPlaces: 1, secondPlaces: 1, thirdPlaces: 1, totalPoints: 9 },
    { school: 'B', firstPlaces: 1, secondPlaces: 1, thirdPlaces: 0, totalPoints: 8 },
    { school: "C", firstPlaces: 5, secondPlaces: 0, thirdPlaces: 0, totalPoints: 5 },
    { school: 'D', firstPlaces: 0, secondPlaces: 0, thirdPlaces: 0, totalPoints: 0 },
    { school: 'E', firstPlaces: 0, secondPlaces: 0, thirdPlaces: 1, totalPoints: 1 },
   
  ]

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
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
      ],
      value: yearFilter,
      onChange: setYearFilter,
    },
    {
      label: 'School/Club',
      options: [
        { value: 'all', label: 'All Schools' },
        { value: 'royal', label: 'Royal College' },
        { value: 'ananda', label: 'Ananda College' },
        { value: 'stjoseph', label: "St. Joseph's College" },
      ],
      value: schoolFilter,
      onChange: setSchoolFilter,
    },
  ]

  const handleSearch = (term) => {
    console.log('Searching for:', term)
    // Add search logic here
  }

  const handleClearFilters = () => {
    setYearFilter('all')
    setSchoolFilter('all')
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
            <h2 className="text-lg font-medium text-[#05041D]">Rankings</h2>
            <div className="flex space-x-2">
              <button className="bg-[#1A73E8] text-white px-4 py-2 rounded hover:bg-blue-700">
                Export PDF
              </button>
              <button className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]">
                Print Report
              </button>
            </div>
          </div>
          <Table columns={columns} data={rankings} />
        </div>
      </div>
    </div>
  )
}

export default SchoolRanking
