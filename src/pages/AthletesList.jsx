import React, { useState, useEffect } from 'react';
import Table from '../components/common/Table';
import FilterBar from '../components/common/FilterBar';
import api from '../api/api';

const AthletesList = () => {
  const [yearFilter, setYearFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [yearOptions, setYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  const fetchAthletes = async () => {
    try {
      const res = await api.get("/api/v1/athletes");

      const athletesData = res.data.data;
      setAthletes(athletesData);
      setFilteredAthletes(athletesData);
      extractFilterOptions(athletesData); 

    } catch (err) {
      console.error("Error fetching athletes:", err);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (athletesData) => {

    const uniqueYears = [...new Set(athletesData.map(athlete => athlete.year))];
    setYearOptions(uniqueYears);
    const schools = [...new Set(athletesData.map(athlete => athlete.school))];
    setSchoolOptions(schools);
    
    const genders = [...new Set(athletesData.map(athlete => athlete.gender))];
    setGenderOptions(genders);
    
    const ageGroups = [...new Set(athletesData.map(athlete => athlete.age_group))];
    setAgeGroupOptions(ageGroups);
    
    const allEvents = athletesData.flatMap(athlete => 
      Array.isArray(athlete.selected_events) 
        ? athlete.selected_events 
        : [athlete.selected_events]
    );
    const uniqueEvents = [...new Set(allEvents.filter(event => event))];
    setEventOptions(uniqueEvents);
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

   useEffect(() => {
    applyFilters();
  }, [ yearFilter, schoolFilter, genderFilter, ageGroupFilter, eventFilter, statusFilter, searchTerm, athletes]);

  const applyFilters = () => {
    let filtered = [...athletes];

    if(yearFilter !== 'all') {
      filtered = filtered.filter(athlete => athlete.year === yearFilter);
    }
    
    if (schoolFilter !== 'all') {
      filtered = filtered.filter(athlete => athlete.school === schoolFilter);
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter(athlete => athlete.gender === genderFilter);
    }

    if (ageGroupFilter !== 'all') {
      filtered = filtered.filter(athlete => athlete.age_group === ageGroupFilter);
    }

    if (eventFilter !== 'all') {
      filtered = filtered.filter(athlete => 
        Array.isArray(athlete.selected_events)
          ? athlete.selected_events.includes(eventFilter)
          : athlete.selected_events === eventFilter
      );
    }

    if (statusFilter !== 'all') {
      const statusBool = statusFilter === 'approved';
      filtered = filtered.filter(athlete => athlete.approved === statusBool);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(athlete => 
        athlete.name.toLowerCase().includes(term) ||
        athlete.bib_no.toString().includes(term) ||
        athlete.email.toLowerCase().includes(term) ||
        athlete.contact_no.includes(term)
      );
    }

    setFilteredAthletes(filtered);
  };

  
  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await api.patch(`/api/v1/athletes/${id}/approve`);
      setAthletes((prev) =>
        prev.map((ath) =>
          ath.athlete_id === id ? { ...ath, approved: true } : ath
        )
      );
      alert('Athlete approved successfully!');
    } catch (err) {
      console.error("Error approving athlete:", err);
      alert('Error approving athlete: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this athlete?')) {
      return;
    }
    
    setDeletingId(id);
    try {
      await api.delete(`/api/v1/athletes/${id}`);
      setAthletes((prev) => prev.filter((ath) => ath.athlete_id !== id));
      alert('Athlete deleted successfully!');
    } catch (err) {
      console.error("Error deleting athlete:", err);
      alert('Error deleting athlete: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };



  const columns = [
    { header: 'BIB', accessor: 'bib_no' },
    { header: 'Name', accessor: 'name' },
    { header: 'School/Club', accessor: 'school' },
    { header: 'Contact No', accessor: 'contact_no' },
    {
      header: 'Events',
      accessor: 'selected_events',
      cell: (value) => Array.isArray(value) ? value.join(", ") : value
    },
    { header: 'Age Group', accessor: 'age_group' },
    { header: 'Gender', accessor: 'gender' },
    {
      header: 'Approved',
      accessor: 'approved',
      cell: (value, row) => (
         <button
          onClick={() => !value && handleApprove(row.athlete_id)}
          disabled={value || processingId === row.athlete_id}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            value 
              ? "bg-green-600 text-white cursor-default" 
              : processingId === row.athlete_id
                ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {processingId === row.athlete_id ? "Processing..." : value ? "Approved" : "Approve"}
        </button>

      ),
    },
    {
      header: 'Actions',
      accessor: 'athlete_id',
      cell: (value, row) => (
        <button 
          onClick={() => handleDelete(value)}
          disabled={deletingId === value}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            deletingId === value
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {deletingId === value ? "Deleting..." : "Delete"}
        </button>
      ),
    },
  ];

if (loading) return <p>Loading athletes...</p>;

  const filters = [
    {
      label: 'Select Year',
      options: [
        { value: 'all', label: 'Select Year' },
        ...yearOptions.map(year => ({
          value: year,
          label: year
        }))
      ],
      value: schoolFilter,
      onChange: setYearFilter,
    },
    {
      label: 'School/Club',
      options: [
        { value: 'all', label: 'All Schools' },
        ...schoolOptions.map(school => ({
          value: school,
          label: school
        }))
      ],
      value: schoolFilter,
      onChange: setSchoolFilter,
    },
    {
      label: 'Gender',
      options: [
        { value: 'all', label: 'All' },
        ...genderOptions.map(gender => ({
          value: gender,
          label: gender.charAt(0).toUpperCase() + gender.slice(1)
        }))
      ],
      value: genderFilter,
      onChange: setGenderFilter,
    },
    {
      label: 'Age Group',
      options: [
        { value: 'all', label: 'All' },
        ...ageGroupOptions.map(age_group => ({
          value: age_group,
          label: age_group
        }))
      ],
      value: ageGroupFilter,
      onChange: setAgeGroupFilter,
    },
    {
      label: 'Event',
      options: [
        { value: 'all', label: 'All Events' },
        ...eventOptions.map(selected_events => ({
          value: selected_events,
          label: selected_events
        }))
      ],
      value: eventFilter,
      onChange: setEventFilter,
    },
    {
      label: 'Status',
      options: [
        { value: 'all', label: 'All' },
        { value: 'approved', label: 'Approved' },
        { value: 'pending', label: 'Pending' }
      ],
      value: statusFilter,
      onChange: setStatusFilter,
    }
  ]

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearFilters = () => {
    setSchoolFilter('all');
    setGenderFilter('all');
    setAgeGroupFilter('all');
    setEventFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
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
        searchTerm={searchTerm}
        searchValue={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">
              Athletes List
              {searchTerm && ` - Searching for "${searchTerm}"`}
              {filteredAthletes.length !== athletes.length && ` (${filteredAthletes.length} of ${athletes.length} results)`}

            </h2>
            <button
                onClick={() => window.open("http://localhost:3002/registration", "_blank")}
                className="text-white font-bold px-4 py-2 rounded bg-gradient-to-r from-[#05041D] to-[#FF5722] hover:from-[#FF5722] hover:to-[#B33F18] transition duration-300"
              >      
              + Add New Athlete
            </button>

          </div>
          <Table columns={columns} data={filteredAthletes} />
        </div>
      </div>
    </div>
  )
}

export default AthletesList
