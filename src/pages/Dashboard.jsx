import React from 'react'
import Card from '../components/common/Card'
import Table from '../components/common/Table'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { Users, Medal, Award, TrendingUp } from 'lucide-react'


const Dashboard = () => {
  const summaryData = [
    {
      title: 'Total Athletes',
      value: 1245,
      icon: <Users size={24} />,
      color: 'blue',
      change: '5%',
      isPositive: true,
    },
    {
      title: 'Registered Events',
      value: 32,
      icon: <Medal size={24} />,
      color: 'orange',
      change: '12%',
      isPositive: true,
    },
    {
      title: 'Schools/Clubs',
      value: 78,
      icon: <Award size={24} />,
      color: 'green',
      change: '3%',
      isPositive: true,
    },
    {
      title: 'Completed Events',
      value: 24,
      icon: <TrendingUp size={24} />,
      color: 'purple',
      change: '75%',
      isPositive: true,
    },
  ]

  const genderData = [
    { name: 'Male', value: 745 },
    { name: 'Female', value: 500 },
  ]
  const COLORS = ['#1A73E8', '#FF5722']

  const ageGroupData = [
    { name: 'Under 12', male: 120, female: 105 },
    { name: 'Under 14', male: 150, female: 130 },
    { name: 'Under 16', male: 180, female: 145 },
    { name: 'Under 18', male: 195, female: 120 },
    { name: 'Under 21', male: 100, female: 0 },
  ]

  const eventRegistrationData = [
    { name: 'Jan', registrations: 65 },
    { name: 'Feb', registrations: 85 },
    { name: 'Mar', registrations: 120 },
    { name: 'Apr', registrations: 75 },
    { name: 'May', registrations: 100 },
    { name: 'Jun', registrations: 145 },
  ]

  const recentRegistrations = [
    {
      id: 'BIB001',
      name: 'Saman Perera',
      school: 'Royal College',
      event: '100m Sprint',
      ageGroup: 'Under 18',
      gender: 'Male',
      status: 'Approved',
    },
    {
      id: 'BIB002',
      name: 'Amali Silva',
      school: 'Visakha College',
      event: 'Long Jump',
      ageGroup: 'Under 16',
      gender: 'Female',
      status: 'Pending',
    },
    {
      id: 'BIB003',
      name: 'Kamal Jayawardena',
      school: 'Ananda College',
      event: 'Shot Put',
      ageGroup: 'Under 21',
      gender: 'Male',
      status: 'Approved',
    },
    {
      id: 'BIB004',
      name: 'Nimal Bandara',
      school: 'Nalanda College',
      event: '200m Sprint',
      ageGroup: 'Under 18',
      gender: 'Male',
      status: 'Approved',
    },
    {
      id: 'BIB005',
      name: 'Chamari Atapattu',
      school: 'Devi Balika',
      event: 'Javelin Throw',
      ageGroup: 'Under 18',
      gender: 'Female',
      status: 'Pending',
    },
  ]

  const columns = [
    { header: 'BIB', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'School/Club', accessor: 'school' },
    { header: 'Event', accessor: 'event' },
    { header: 'Age Group', accessor: 'ageGroup' },
    { header: 'Gender', accessor: 'gender' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'Approved'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            change={item.change}
            isPositive={item.isPositive}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">
            Athletes by Gender
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {genderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Group Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">
            Athletes by Age Group
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" name="Male" fill="#1A73E8" />
              <Bar dataKey="female" name="Female" fill="#FF5722" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-[#05041D] mb-4">
          Event Registration Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={eventRegistrationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="registrations"
              stroke="#1A73E8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-[#05041D] mb-4">
          Recent Registrations
        </h2>
        <Table columns={columns} data={recentRegistrations} />
      </div>
    </div>
  )
}

export default Dashboard
