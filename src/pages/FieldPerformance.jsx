import React, { useState, useEffect } from 'react';
import Table from '../components/common/Table';
import FilterBar from '../components/common/FilterBar';
import { getFieldEvents, getFieldEventAthletes, updateFieldEventPerformance } from '../api/fieldEvents';
import api from '../api/api';

const FieldPerformance = () => {
  const [yearFilter, setYearFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('Long Jump');
  const [searchTerm, setSearchTerm] = useState('');
  const [performances, setPerformances] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [attemptValues, setAttemptValues] = useState({});

  // Fetch unique values for filters
  const [yearOptions, setYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  // Fetch athletes to extract filter options
  const fetchAthletes = async () => {
    try {
      const res = await api.get("/api/v1/athletes");
      const athletesData = res.data.data;
      extractFilterOptions(athletesData);
    } catch (err) {
      console.error("Error fetching athletes:", err);
    }
  };

  // Extract unique values for filters
  const extractFilterOptions = (athletesData) => {
    // Extract unique years
    const uniqueYears = [...new Set(athletesData.map(athlete => athlete.year))];
    setYearOptions(uniqueYears.sort((a, b) => b - a)); // Sort descending
    
    // Extract unique schools
    const schools = [...new Set(athletesData.map(athlete => athlete.school))];
    setSchoolOptions(schools.sort());
    
    // Extract unique genders
    const genders = [...new Set(athletesData.map(athlete => athlete.gender))];
    setGenderOptions(genders);
    
    // Extract unique age groups
    const ageGroups = [...new Set(athletesData.map(athlete => athlete.age_group))];
    setAgeGroupOptions(ageGroups.sort());
    
    // Extract unique events (flatten arrays)
    const allEvents = athletesData.flatMap(athlete => 
      Array.isArray(athlete.selected_events) 
        ? athlete.selected_events 
        : [athlete.selected_events]
    );
    const uniqueEvents = [...new Set(allEvents.filter(event => event))];
    // Filter for field events only
    const fieldEvents = uniqueEvents.filter(event => 
      ['Long Jump', 'High Jump', 'Shot Put', 'Javelin Throw', 'Discus Throw', 'Triple Jump']
        .includes(event)
    );
    setEventOptions(fieldEvents.sort());
  };

  // Fetch athletes and performances when filters change
  useEffect(() => {
    fetchAthletes();
    fetchData();
  }, [yearFilter, genderFilter, ageGroupFilter, eventFilter, schoolFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const filters = {
        year: yearFilter !== 'all' ? yearFilter : undefined,
        gender: genderFilter !== 'all' ? genderFilter : undefined,
        age_group: ageGroupFilter !== 'all' ? ageGroupFilter : undefined,
        event_name: eventFilter !== 'all' ? eventFilter : undefined,
        school: schoolFilter !== 'all' ? schoolFilter : undefined
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

      // Fetch athletes for this event
      const athletesResponse = await getFieldEventAthletes(filters);
      setAthletes(athletesResponse.data);

      // Fetch existing performances
      const performancesResponse = await getFieldEvents(filters);
      setPerformances(performancesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search filtering logic here
  };

  const handleClearFilters = () => {
    setYearFilter('all');
    setGenderFilter('all');
    setSchoolFilter('all');
    setAgeGroupFilter('all');
    setEventFilter('Long Jump');
    setSearchTerm('');
  };

  const handleEdit = (performance) => {
    setEditingRow(performance.performance_id || `new-${performance.athlete_id}`);
    setAttemptValues({
      attempt_1: performance.attempt_1 || '',
      attempt_2: performance.attempt_2 || '',
      attempt_3: performance.attempt_3 || '',
      attempt_4: performance.attempt_4 || '',
      attempt_5: performance.attempt_5 || '',
      attempt_6: performance.attempt_6 || '',
    });
  };

  const handleAttemptChange = (attempt, value) => {
    setAttemptValues(prev => ({
      ...prev,
      [attempt]: value
    }));
  };

 const handleSave = async (athlete) => {
  try {
    const performanceData = {
      athlete_id: athlete.athlete_id,
      event_name: athlete.event_name || eventFilter, // Use the athlete's event_name if available
      year: yearFilter !== 'all' ? parseInt(yearFilter) : new Date().getFullYear(),
      gender: athlete.gender,
      age_group: athlete.age_group,
      school: athlete.school,
      ...attemptValues
    };

    await updateFieldEventPerformance(performanceData);
    setEditingRow(null);
    setAttemptValues({});
    fetchData(); // Refresh data
    alert('Performance saved successfully!');
  } catch (error) {
    console.error('Error saving performance:', error);
    alert('Failed to save performance');
  }
};

  const handleCancel = () => {
    setEditingRow(null);
    setAttemptValues({});
  };

  const columns = [
    { header: 'BIB No', accessor: 'bib_no' },
    { header: 'Athlete Name', accessor: 'name' },
    { header: 'School', accessor: 'school' },
    { header: 'Age Group', accessor: 'age_group' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Event', accessor: 'event_name' },
    {
      header: '1st Attempt',
      accessor: 'attempt_1',
      cell: (value, row) => editingRow === (row.performance_id || `new-${row.athlete_id}`) ? (
        <input
          type="text"
          value={attemptValues.attempt_1 || ''}
          onChange={(e) => handleAttemptChange('attempt_1', e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00M"
        />
      ) : value || '-'
    },
    {
      header: '2nd Attempt',
      accessor: 'attempt_2',
      cell: (value, row) => editingRow === (row.performance_id || `new-${row.athlete_id}`) ? (
        <input
          type="text"
          value={attemptValues.attempt_2 || ''}
          onChange={(e) => handleAttemptChange('attempt_2', e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00M"
        />
      ) : value || '-'
    },
    {
      header: '3rd Attempt',
      accessor: 'attempt_3',
      cell: (value, row) => editingRow === (row.performance_id || `new-${row.athlete_id}`) ? (
        <input
          type="text"
          value={attemptValues.attempt_3 || ''}
          onChange={(e) => handleAttemptChange('attempt_3', e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00M"
        />
      ) : value || '-'
    },
    {
      header: '4th Attempt',
      accessor: 'attempt_4',
      cell: (value, row) => editingRow === (row.performance_id || `new-${row.athlete_id}`) ? (
        <input
          type="text"
          value={attemptValues.attempt_4 || ''}
          onChange={(e) => handleAttemptChange('attempt_4', e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00M"
        />
      ) : value || '-'
    },
    {
      header: '5th Attempt',
      accessor: 'attempt_5',
      cell: (value, row) => editingRow === (row.performance_id || `new-${row.athlete_id}`) ? (
        <input
          type="text"
          value={attemptValues.attempt_5 || ''}
          onChange={(e) => handleAttemptChange('attempt_5', e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00M"
        />
      ) : value || '-'
    },
    {
      header: '6th Attempt',
      accessor: 'attempt_6',
      cell: (value, row) => editingRow === (row.performance_id || `new-${row.athlete_id}`) ? (
        <input
          type="text"
          value={attemptValues.attempt_6 || ''}
          onChange={(e) => handleAttemptChange('attempt_6', e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00M"
        />
      ) : value || '-'
    },
    { header: 'Best Performance', accessor: 'best_performance', cell: (value) => value || '-' },
    { header: 'Place', accessor: 'place', cell: (value) => value || '-' },
    {
      header: 'Actions',
      accessor: 'performance_id',
      cell: (value, row) => {
        const rowId = value || `new-${row.athlete_id}`;
        if (editingRow === rowId) {
          return (
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSave(row)}
                className="text-green-600 hover:text-green-800"
              >
                Save
              </button>
              <button 
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800"
              >
                Cancel
              </button>
            </div>
          );
        } else {
          return (
            <button 
              onClick={() => handleEdit(row)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          );
        }
      },
    },
  ];

  // Combine athletes and performances data
  const tableData = athletes.map(athlete => {
  // Find performance for this specific athlete AND event
  const performance = performances.find(p => 
    p.athlete_id === athlete.athlete_id && p.event_name === athlete.event_name
  );
  
  console.log('Combining:', athlete.name, athlete.event_name, 'Performance:', performance);
  
  return performance ? { ...athlete, ...performance } : athlete;
});

  const filters = [
    {
      label: 'Year',
      options: [
        { value: 'all', label: 'All Years' },
        ...yearOptions.map(year => ({
          value: year.toString(),
          label: year.toString()
        }))
      ],
      value: yearFilter,
      onChange: setYearFilter,
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
      label: 'School',
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
      label: 'Age Group',
      options: [
        { value: 'all', label: 'All' },
        ...ageGroupOptions.map(ageGroup => ({
          value: ageGroup,
          label: ageGroup
        }))
      ],
      value: ageGroupFilter,
      onChange: setAgeGroupFilter,
    },
    {
      label: 'Event',
      options: [
        ...eventOptions.map(event => ({
          value: event,
          label: event
        }))
      ],
      value: eventFilter,
      onChange: setEventFilter,
    },
  ];

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
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">
              Field Events Performance - {eventFilter}
            </h2>
            <button 
              onClick={fetchData}
              className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]"
            >
              Refresh Data
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table columns={columns} data={tableData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldPerformance;