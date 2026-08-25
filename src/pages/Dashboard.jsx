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
      title: 'Registerd Athletes 2024',
      value: 1245,
      icon: <Users size={24} />,
      color: 'blue',
      // change: '5%',
      isPositive: true,
    },
    {
      title: 'Registered Events 2024',
      value: 32,
      icon: <Medal size={24} />,
      color: 'orange',
      // change: '12%',
      isPositive: true,
    },
    {
      title: 'Schools/Clubs 2024',
      value: 78,
      icon: <Award size={24} />,
      color: 'green',
      // change: '3%',
      isPositive: true,
    },
    {
      title: 'Completed Events 2024',
      value: 24,
      icon: <TrendingUp size={24} />,
      color: 'purple',
      // change: '75%',
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">Summary - 2024</h1>

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
    </div>
  )
}

export default Dashboard;