import React, { useState } from 'react'
import Table from '../components/common/Table'
import FilterBar from '../components/common/FilterBar'

const FieldPerformance = () => {
  const [yearFilter, setYearFilter] = useState('2023')
  const [genderFilter, setGenderFilter] = useState('all')
  const [ageGroupFilter, setAgeGroupFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [roundFilter, setRoundFilter] = useState('all')

  const fieldEvents = [
    {
      round: 'Qualification',
      id: 'BIB002',
      name: 'Amali Silva',
      ageGroup: 'Under 16',
      school: 'Visakha College',
      event: 'Long Jump',
      performance: '5.75m',
      qualified: true,
    },
    {
      round: 'Qualification',
      id: 'BIB003',
      name: 'Kamal Jayawardena',
      ageGroup: 'Under 21',
      school: 'Ananda College',
      event: 'Shot Put',
      performance: '14.2m',
      qualified: true,
    },
    {
      round: 'Qualification',
      id: 'BIB005',
      name: 'Chamari Atapattu',
      ageGroup: 'Under 18',
      school: 'Devi Balika',
      event: 'Javelin Throw',
      performance: '45.6m',
      qualified: true,
    },
    {
      round: 'Final',
      id: 'BIB002',
      name: 'Amali Silva',
      ageGroup: 'Under 16',
      school: 'Visakha College',
      event: 'Long Jump',
      performance: '5.85m',
      qualified: true,
    },
    {
      round: 'Final',
      id: 'BIB003',
      name: 'Kamal Jayawardena',
      ageGroup: 'Under 21',
      school: 'Ananda College',
      event: 'Shot Put',
      performance: '14.5m',
      qualified: true,
    },
    {
      round: 'Final',
      id: 'BIB005',
      name: 'Chamari Atapattu',
      ageGroup: 'Under 18',
      school: 'Devi Balika',
      event: 'Javelin Throw',
      performance: '46.2m',
      qualified: true,
    },
  ]

  const columns = [
    { header: 'Round', accessor: 'round' },
    { header: 'BIB No', accessor: 'id' },
    { header: 'Athlete Name', accessor: 'name' },
    { header: 'Age Group', accessor: 'ageGroup' },
    { header: 'School', accessor: 'school' },
    { header: 'Event', accessor: 'event' },
    { header: 'Performance', accessor: 'performance' },
    {
      header: 'Qualified',
      accessor: 'qualified',
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">Edit</button>
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
      label: 'Round',
      options: [
        { value: 'all', label: 'All Rounds' },
        { value: 'qualification', label: 'Qualification' },
        { value: 'final', label: 'Final' },
      ],
      value: roundFilter,
      onChange: setRoundFilter,
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
        { value: 'longjump', label: 'Long Jump' },
        { value: 'highjump', label: 'High Jump' },
        { value: 'shotput', label: 'Shot Put' },
        { value: 'javelin', label: 'Javelin Throw' },
        { value: 'discus', label: 'Discus Throw' },
      ],
      value: eventFilter,
      onChange: setEventFilter,
    },
  ]

  const handleSearch = (term) => {
    console.log('Searching for:', term)
    // Implement real search logic here
  }

  const handleClearFilters = () => {
    setYearFilter('all')
    setGenderFilter('all')
    setAgeGroupFilter('all')
    setEventFilter('all')
    setRoundFilter('all')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">
        Field Event Performance Tracking
      </h1>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">
              Field Events Performance
            </h2>
            <button className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]">
              Add Result
            </button>
          </div>
          <Table columns={columns} data={fieldEvents} />
        </div>
      </div>
    </div>
  )
}

export default FieldPerformance
