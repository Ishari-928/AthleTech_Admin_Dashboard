import React from 'react'

const Card = ({ title, value, icon, color, change, isPositive }) => {
  const bgColor = `bg-${color}-100`
  const textColor = `text-${color}-500`

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <p
              className={`text-xs mt-2 ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {isPositive ? '+' : '-'}
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <div className={textColor}>{icon}</div>
        </div>
      </div>
    </div>
  )
}

export default Card
