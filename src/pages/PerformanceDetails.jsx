import React, { useState } from 'react'
import Table from '../components/common/Table'
import FilterBar from '../components/common/FilterBar'

const PerformanceDetails = () => {
  const [yearFilter, setYearFilter] = useState('2023')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [ageGroupFilter, setAgeGroupFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')

  const performances = [
    {
      id: 'BIB001',
      name: 'Saman Perera',
      school: 'Royal College',
      event: '100m Sprint',
      performance: '10.5s',
      points: 950,
    },
    {
      id: 'BIB002',
      name: 'Amali Silva',
      school: 'Visakha College',
      event: 'Long Jump',
      performance: '5.75m',
      points: 920,
    },
    {
      id: 'BIB003',
      name: 'Kamal Jayawardena',
      school: 'Ananda College',
      event: 'Shot Put',
      performance: '14.2m',
      points: 875,
    },
    {
      id: 'BIB004',
      name: 'Nimal Bandara',
      school: 'Nalanda College',
      event: '200m Sprint',
      performance: '22.3s',
      points: 910,
    },
    {
      id: 'BIB005',
      name: 'Chamari Atapattu',
      school: 'Devi Balika',
      event: 'Javelin Throw',
      performance: '45.6m',
      points: 930,
    },
    {
      id: 'BIB006',
      name: 'Lasith Malinga',
      school: "St. John's College",
      event: 'Cricket Ball Throw',
      performance: '85.2m',
      points: 960,
    },
    {
      id: 'BIB007',
      name: 'Dilani Perera',
      school: 'Musaeus College',
      event: '100m Hurdles',
      performance: '14.7s',
      points: 880,
    },
    {
      id: 'BIB008',
      name: 'Roshan Fernando',
      school: "St. Thomas' College",
      event: 'High Jump',
      performance: '1.95m',
      points: 905,
    },
  ]

  const columns = [
    { header: 'BIB No', accessor: 'id' },
    { header: 'Athlete Name', accessor: 'name' },
    { header: 'School/Club', accessor: 'school' },
    { header: 'Event', accessor: 'event' },
    { header: 'Performance', accessor: 'performance' },
    { header: 'IAAF Points', accessor: 'points' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">View</button>
          <button className="text-[#FF5722] hover:text-[#B33F18]">Edit</button>
        </div>
      ),
    },
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
        { value: 'visakha', label: 'Visakha College' },
        { value: 'ananda', label: 'Ananda College' },
      ],
      value: schoolFilter,
      onChange: setSchoolFilter,
    },
    {
      label: 'Gender',
      options: [
        { value: 'all', label: 'All' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
      value: genderFilter,
      onChange: setGenderFilter,
    },
    {
      label: 'Age Group',
      options: [
        { value: 'all', label: 'All' },
        { value: 'under12', label: 'Under 12' },
        { value: 'under14', label: 'Under 14' },
        { value: 'under16', label: 'Under 16' },
        { value: 'under18', label: 'Under 18' },
        { value: 'under21', label: 'Under 21' },
      ],
      value: ageGroupFilter,
      onChange: setAgeGroupFilter,
    },
    {
      label: 'Event',
      options: [
        { value: 'all', label: 'All Events' },
        { value: '100m', label: '100m Sprint' },
        { value: '200m', label: '200m Sprint' },
        { value: 'longjump', label: 'Long Jump' },
        { value: 'shotput', label: 'Shot Put' },
      ],
      value: eventFilter,
      onChange: setEventFilter,
    },
  ]

  const handleSearch = (term) => {
    console.log('Searching for:', term)
    // Add logic if needed
  }

  const handleClearFilters = () => {
    setYearFilter('all')
    setSchoolFilter('all')
    setGenderFilter('all')
    setAgeGroupFilter('all')
    setEventFilter('all')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">
        Registered Athlete Final Performance Details
      </h1>

      <FilterBar
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">
              Performance Results
            </h2>
            <div className="flex space-x-2">
              <button className="bg-[#1A73E8] text-white px-4 py-2 rounded hover:bg-blue-700">
                Export CSV
              </button>
              <button className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]">
                Add Result
              </button>
            </div>
          </div>
          <Table columns={columns} data={performances} />
        </div>
      </div>
    </div>
  )
}

export default PerformanceDetails

