import React, { useState } from 'react'
import Table from '../components/common/Table'

const NewsUpdates = () => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    topic: '',
    description: '',
    image: null,
  })

  const news = [
    {
      date: '2023-07-15',
      topic: 'National Athletic Meet Announced',
      description:
        'The National Athletic Meet 2023 will be held at Sugathadasa Stadium from August 10-12.',
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
    {
      date: '2023-07-10',
      topic: 'New National Record in Long Jump',
      description:
        "Amali Silva sets new national record in women's long jump with a leap of 6.45m.",
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
    {
      date: '2023-07-05',
      topic: 'Registration Open for Junior Championships',
      description:
        'Registration for the Junior National Championships is now open. Deadline is July 25.',
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
    {
      date: '2023-06-30',
      topic: 'Training Camp for National Squad',
      description:
        'A two-week training camp for the national athletics squad will be held from July 15-30.',
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
  ]

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'News Topic', accessor: 'topic' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Image',
      accessor: 'image',
      cell: (value) => (
        <img
          src={value}
          alt="News"
          className="h-12 w-20 object-cover rounded"
        />
      ),
    },
    {
      header: 'Actions',
      accessor: 'topic',
      cell: () => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">Edit</button>
          <button className="text-red-600 hover:text-red-800">Delete</button>
        </div>
      ),
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setShowForm(false)
    setFormData({
      date: '',
      topic: '',
      description: '',
      image: null,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">News Updates</h1>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">Add News</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">News Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                accept="image/*"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF5722] text-white rounded hover:bg-[#B33F18]"
              >
                Add News
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">News List</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]"
            >
              Add News
            </button>
          </div>
          <Table columns={columns} data={news} />
        </div>
      </div>
    </div>
  )
}

export default NewsUpdates
