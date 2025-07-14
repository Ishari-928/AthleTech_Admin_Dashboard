import React, { useState } from 'react'
import Table from '../components/common/Table'

const CoachDetails = () => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    whatsapp: '',
    mobile: '',
    facebook: '',
    instagram: '',
    image: null,
  })

  const coaches = [
    {
      name: 'Susanthika Jayasinghe',
      description:
        'Former Olympic medalist specialized in sprint events. Over 15 years of coaching experience.',
      whatsapp: '+94-71-1234567',
      mobile: '+94-71-1234567',
      facebook: 'susanthika.official',
      instagram: '@susanthika_j',
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
    {
      name: 'Sugath Thilakarathne',
      description:
        'National coach for middle distance events with expertise in 800m and 1500m training.',
      whatsapp: '+94-72-7654321',
      mobile: '+94-72-7654321',
      facebook: 'sugath.coach',
      instagram: '@sugath_coach',
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
    {
      name: 'Damayanthi Dharsha',
      description:
        "Specialized in women's sprinting events. Former national record holder in 200m.",
      whatsapp: '+94-77-9876543',
      mobile: '+94-77-9876543',
      facebook: 'damayanthi.d',
      instagram: '@damayanthi_coach',
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
    {
      name: 'Pradeep Nishantha',
      description:
        'Field events specialist focusing on javelin throw and shot put techniques.',
      whatsapp: '+94-76-1122334',
      mobile: '+94-76-1122334',
      facebook: 'pradeep.coach',
      instagram: '@pradeep_field',
      image:
        'https://uploadthingy.s3.us-west-1.amazonaws.com/kR44zyz1YVNzjiP3fgUKr9/image.png',
    },
  ]

  const columns = [
    {
      header: 'Profile',
      accessor: 'image',
      cell: (value) => (
        <img
          src={value}
          alt="Coach"
          className="h-12 w-12 object-cover rounded-full"
        />
      ),
    },
    { header: 'Coach Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'WhatsApp', accessor: 'whatsapp' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Facebook', accessor: 'facebook' },
    { header: 'Instagram', accessor: 'instagram' },
    {
      header: 'Actions',
      accessor: 'name',
      cell: (value) => (
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
      name: '',
      description: '',
      whatsapp: '',
      mobile: '',
      facebook: '',
      instagram: '',
      image: null,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">Coaches Details</h1>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">Add Coach</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coach Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
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
                Add Coach
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">Coaches List</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]"
            >
              Add Coach
            </button>
          </div>
          <Table columns={columns} data={coaches} />
        </div>
      </div>
    </div>
  )
}

export default CoachDetails
