import React, { useState } from 'react'
import Table from '../components/common/Table'
import FilterBar from '../components/common/FilterBar'

const AthletesList = () => {
  const [yearFilter, setYearFilter] = useState('2023')
  const [schoolFilter, setSchoolFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [ageGroupFilter, setAgeGroupFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')

  const athletes = [
    {
      id: 'BIB001',
      name: 'Saman Perera',
      school: 'Royal College',
      contact: '071-1234567',
      address: '123 Main St, Colombo',
      events: '100m Sprint, 200m Sprint',
      payment: 'Paid',
      ageGroup: 'Under 18',
      approved: true,
      fees: 'Rs. 2500',
    },
    {
      id: 'BIB002',
      name: 'Amali Silva',
      school: 'Visakha College',
      contact: '072-7654321',
      address: '456 Park Ave, Kandy',
      events: 'Long Jump',
      payment: 'Pending',
      ageGroup: 'Under 16',
      approved: false,
      fees: 'Rs. 1500',
    },
    {
      id: 'BIB003',
      name: 'Kamal Jayawardena',
      school: 'Ananda College',
      contact: '077-9876543',
      address: '789 Hill St, Galle',
      events: 'Shot Put, Discus Throw',
      payment: 'Paid',
      ageGroup: 'Under 21',
      approved: true,
      fees: 'Rs. 3000',
    },
    {
      id: 'BIB004',
      name: 'Nimal Bandara',
      school: 'Nalanda College',
      contact: '076-1122334',
      address: '101 Lake Rd, Colombo',
      events: '200m Sprint, 400m Sprint',
      payment: 'Paid',
      ageGroup: 'Under 18',
      approved: true,
      fees: 'Rs. 2500',
    },
    {
      id: 'BIB005',
      name: 'Chamari Atapattu',
      school: 'Devi Balika',
      contact: '070-5566778',
      address: '202 Beach Rd, Negombo',
      events: 'Javelin Throw',
      payment: 'Pending',
      ageGroup: 'Under 18',
      approved: false,
      fees: 'Rs. 1500',
    },
  ]

  const columns = [
    { header: 'BIB', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'School/Club', accessor: 'school' },
    { header: 'Contact No', accessor: 'contact' },
    { header: 'Address', accessor: 'address' },
    { header: 'Events', accessor: 'events' },
    {
      header: 'Payment Status',
      accessor: 'payment',
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'Paid'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: 'Age Group', accessor: 'ageGroup' },
    {
      header: 'Approved',
      accessor: 'approved',
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
    { header: 'Fees', accessor: 'fees' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">Edit</button>
          <button className="text-[#FF5722] hover:text-[#B33F18]">Delete</button>
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
        All Registered Athletes
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
              Athletes List
            </h2>
            <button className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]">
              Add New Athlete
            </button>
          </div>
          <Table columns={columns} data={athletes} />
        </div>
      </div>
    </div>
  )
}

export default AthletesList
