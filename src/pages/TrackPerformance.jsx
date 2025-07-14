import React, { useState } from 'react'
import FilterBar from '../components/common/FilterBar'
import Table from '../components/common/Table'

const TrackPerformance = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('heats')
  // Filter states
  const [yearFilter, setYearFilter] = useState('2023')
  const [heatFilter, setHeatFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [ageGroupFilter, setAgeGroupFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  // Sample data
  const heatsData = [
    {
      heat: 'Heat 1',
      id: 'BIB001',
      name: 'Saman Perera',
      ageGroup: 'Under 18',
      school: 'Royal College',
      event: '100m Sprint',
      performance: '10.7s',
      qualified: true,
    },
    {
      heat: 'Heat 1',
      id: 'BIB004',
      name: 'Nimal Bandara',
      ageGroup: 'Under 18',
      school: 'Nalanda College',
      event: '100m Sprint',
      performance: '10.8s',
      qualified: true,
    },
    {
      heat: 'Heat 1',
      id: 'BIB009',
      name: 'Ajith Fernando',
      ageGroup: 'Under 18',
      school: "St. Joseph's College",
      event: '100m Sprint',
      performance: '11.2s',
      qualified: false,
    },
    {
      heat: 'Heat 2',
      id: 'BIB012',
      name: 'Ruwan Silva',
      ageGroup: 'Under 18',
      school: 'Trinity College',
      event: '100m Sprint',
      performance: '10.9s',
      qualified: true,
    },
    {
      heat: 'Heat 2',
      id: 'BIB015',
      name: 'Dinesh Perera',
      ageGroup: 'Under 18',
      school: 'D.S. Senanayake College',
      event: '100m Sprint',
      performance: '11.1s',
      qualified: true,
    },
  ]
  const semiFinalsData = [
    {
      heat: 'Semi 1',
      id: 'BIB001',
      name: 'Saman Perera',
      ageGroup: 'Under 18',
      school: 'Royal College',
      event: '100m Sprint',
      performance: '10.6s',
      qualified: true,
    },
    {
      heat: 'Semi 1',
      id: 'BIB004',
      name: 'Nimal Bandara',
      ageGroup: 'Under 18',
      school: 'Nalanda College',
      event: '100m Sprint',
      performance: '10.7s',
      qualified: true,
    },
    {
      heat: 'Semi 2',
      id: 'BIB012',
      name: 'Ruwan Silva',
      ageGroup: 'Under 18',
      school: 'Trinity College',
      event: '100m Sprint',
      performance: '10.8s',
      qualified: true,
    },
    {
      heat: 'Semi 2',
      id: 'BIB015',
      name: 'Dinesh Perera',
      ageGroup: 'Under 18',
      school: 'D.S. Senanayake College',
      event: '100m Sprint',
      performance: '10.9s',
      qualified: false,
    },
  ]
  const finalsData = [
    {
      heat: 'Final',
      id: 'BIB001',
      name: 'Saman Perera',
      ageGroup: 'Under 18',
      school: 'Royal College',
      event: '100m Sprint',
      performance: '10.5s',
      qualified: true,
    },
    {
      heat: 'Final',
      id: 'BIB004',
      name: 'Nimal Bandara',
      ageGroup: 'Under 18',
      school: 'Nalanda College',
      event: '100m Sprint',
      performance: '10.6s',
      qualified: true,
    },
    {
      heat: 'Final',
      id: 'BIB012',
      name: 'Ruwan Silva',
      ageGroup: 'Under 18',
      school: 'Trinity College',
      event: '100m Sprint',
      performance: '10.7s',
      qualified: true,
    },
  ]
  const getActiveData = () => {
    switch (activeTab) {
      case 'heats':
        return heatsData
      case 'semifinals':
        return semiFinalsData
      case 'finals':
        return finalsData
      default:
        return []
    }
  }
  const columns = [
    {
      header: 'Heat No',
      accessor: 'heat',
    },
    {
      header: 'BIB No',
      accessor: 'id',
    },
    {
      header: 'Athlete Name',
      accessor: 'name',
    },
    {
      header: 'Age Group',
      accessor: 'ageGroup',
    },
    {
      header: 'School',
      accessor: 'school',
    },
    {
      header: 'Event',
      accessor: 'event',
    },
    {
      header: 'Performance',
      accessor: 'performance',
    },
    {
      header: 'Qualified',
      accessor: 'qualified',
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
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
        {
          value: 'all',
          label: 'All Years',
        },
        {
          value: '2023',
          label: '2023',
        },
        {
          value: '2022',
          label: '2022',
        },
        {
          value: '2021',
          label: '2021',
        },
      ],
      value: yearFilter,
      onChange: setYearFilter,
    },
    {
      label: 'Gender',
      options: [
        {
          value: 'all',
          label: 'All',
        },
        {
          value: 'male',
          label: 'Male',
        },
        {
          value: 'female',
          label: 'Female',
        },
      ],
      value: genderFilter,
      onChange: setGenderFilter,
    },
    {
      label: 'Heat No',
      options: [
        {
          value: 'all',
          label: 'All Heats',
        },
        {
          value: 'heat1',
          label: 'Heat 1',
        },
        {
          value: 'heat2',
          label: 'Heat 2',
        },
        {
          value: 'heat3',
          label: 'Heat 3',
        },
      ],
      value: heatFilter,
      onChange: setHeatFilter,
    },
    {
      label: 'Age Group',
      options: [
        {
          value: 'all',
          label: 'All',
        },
        {
          value: 'under12',
          label: 'Under 12',
        },
        {
          value: 'under14',
          label: 'Under 14',
        },
        {
          value: 'under16',
          label: 'Under 16',
        },
        {
          value: 'under18',
          label: 'Under 18',
        },
        {
          value: 'under21',
          label: 'Under 21',
        },
      ],
      value: ageGroupFilter,
      onChange: setAgeGroupFilter,
    },
    {
      label: 'Event',
      options: [
        {
          value: 'all',
          label: 'All Events',
        },
        {
          value: '100m',
          label: '100m Sprint',
        },
        {
          value: '200m',
          label: '200m Sprint',
        },
        {
          value: '400m',
          label: '400m Sprint',
        },
        {
          value: '800m',
          label: '800m',
        },
      ],
      value: eventFilter,
      onChange: setEventFilter,
    },
  ]
  const handleSearch = (term) => {
    console.log('Searching for:', term)
    // Implement search functionality
  }
  const handleClearFilters = () => {
    setYearFilter('all')
    setHeatFilter('all')
    setGenderFilter('all')
    setAgeGroupFilter('all')
    setEventFilter('all')
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">
        Track Event Performance Tracking
      </h1>
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'heats' ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : 'text-gray-500 hover:text-[#FF5722]'}`}
          onClick={() => setActiveTab('heats')}
        >
          Heats
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'semifinals' ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : 'text-gray-500 hover:text-[#FF5722]'}`}
          onClick={() => setActiveTab('semifinals')}
        >
          Semi Finals
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'finals' ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : 'text-gray-500 hover:text-[#FF5722]'}`}
          onClick={() => setActiveTab('finals')}
        >
          Finals
        </button>
      </div>
      {/* Filter Section */}
      <FilterBar
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />
      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">
              {activeTab === 'heats'
                ? 'Heats Performance'
                : activeTab === 'semifinals'
                  ? 'Semi Finals Performance'
                  : 'Finals Performance'}
            </h2>
            <button className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]">
              Add Result
            </button>
          </div>
          <Table columns={columns} data={getActiveData()} />
        </div>
      </div>
    </div>
  )
}
export default TrackPerformance
