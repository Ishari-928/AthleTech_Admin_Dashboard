import React, { useState, useEffect } from 'react';
import Table from '../components/common/Table';
import FilterBar from '../components/common/FilterBar';
import api from '../api/api';

const TrackPerformance = () => {
  const [yearFilter, setYearFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('100M');
  const [roundFilter, setRoundFilter] = useState('heat');
  const [searchTerm, setSearchTerm] = useState('');
  const [heats, setHeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [timeValues, setTimeValues] = useState({});
  const [placeValues, setPlaceValues] = useState({});

  const [yearOptions, setYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [roundOptions] = useState(['heat', 'semifinal', 'final']);

  const TRACK_EVENTS = ['60M', '100M', '200M', '400M', '800M', '100MH', '400MH'];

  const fetchAthletes = async () => {
    try {
      const res = await api.get("/api/v1/athletes");
      const athletesData = res.data.data;
      extractFilterOptions(athletesData);
    } catch (err) {
      console.error("Error fetching athletes:", err);
    }
  };

  const extractFilterOptions = (athletesData) => {
    const uniqueYears = [...new Set(athletesData.map(athlete => athlete.year))];
    setYearOptions(uniqueYears.sort((a, b) => b - a));

    const schools = [...new Set(athletesData.map(athlete => athlete.school))];
    setSchoolOptions(schools.sort());

    const genders = [...new Set(athletesData.map(athlete => athlete.gender))];
    setGenderOptions(genders);

    const ageGroups = [...new Set(athletesData.map(athlete => athlete.age_group))];
    setAgeGroupOptions(ageGroups.sort());

    const allEvents = athletesData.flatMap(athlete =>
      Array.isArray(athlete.selected_events) ? athlete.selected_events : [athlete.selected_events]
    );
    const uniqueEvents = [...new Set(allEvents.filter(event => event))];
    const trackEvents = uniqueEvents.filter(event => TRACK_EVENTS.includes(event.toUpperCase()));
    setEventOptions(trackEvents.sort());
  };

  useEffect(() => {
    fetchAthletes();
    fetchHeats();
  }, [yearFilter, genderFilter, ageGroupFilter, eventFilter, roundFilter]);

  const fetchHeats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (yearFilter !== 'all') params.append('year', yearFilter);
      if (genderFilter !== 'all') params.append('gender', genderFilter);
      if (ageGroupFilter !== 'all') params.append('age_group', ageGroupFilter);
      if (eventFilter) params.append('event_name', eventFilter);
      if (roundFilter) params.append('round', roundFilter);

      const response = await api.get(`/api/v1/track-events/heats?${params}`);
      setHeats(response.data.data);
    } catch (error) {
      console.error('Error fetching heats:', error);
      alert('Failed to fetch heat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearFilters = () => {
    setYearFilter('all');
    setGenderFilter('all');
    setSchoolFilter('all');
    setAgeGroupFilter('all');
    setEventFilter('100M');
    setRoundFilter('heat');
    setSearchTerm('');
  };

  const handleEdit = (assignment) => {
    setEditingRow(assignment.assignment_id);
    setTimeValues({
      performance_time: assignment.performance_time || ''
    });
    setPlaceValues({
      place_in_heat: assignment.place_in_heat || ''
    });
  };

  const handleTimeChange = (value) => {
    setTimeValues({
      performance_time: value
    });
  };

  const handlePlaceChange = (value) => {
    setPlaceValues({
      place_in_heat: value
    });
  };

  const handleSave = async (assignment, heat) => {
    try {
      const resultData = {
        heat_id: heat.heat_id,
        results: [{
          athlete_id: assignment.Athlete.athlete_id,
          time: parseFloat(timeValues.performance_time),
          place: parseInt(placeValues.place_in_heat)
        }]
      };

      await api.post('/api/v1/track-events/results', resultData);
      setEditingRow(null);
      setTimeValues({});
      setPlaceValues({});
      fetchHeats(); 
      alert('Performance saved successfully!');
    } catch (error) {
      console.error('Error saving performance:', error);
      alert('Failed to save performance');
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setTimeValues({});
    setPlaceValues({});
  };

  const createNextRound = async () => {
    try {
      const nextRound = roundFilter === 'heat' ? 'semifinal' : 'final';
      await api.post('/api/v1/track-events/next-round', {
        event_name: eventFilter,
        year: yearFilter !== 'all' ? yearFilter : new Date().getFullYear(),
        gender: genderFilter !== 'all' ? genderFilter : 'male', 
        age_group: ageGroupFilter !== 'all' ? ageGroupFilter : 'U16', 
        round: nextRound
      });
      
      alert(`${nextRound.charAt(0).toUpperCase() + nextRound.slice(1)} created successfully!`);
      setRoundFilter(nextRound);
    } catch (error) {
      console.error('Error creating next round:', error);
      alert('Failed to create next round');
    }
  };

  const createHeats = async () => {
    try {
      await api.post('/api/v1/track-events/heats', {
        event_name: eventFilter,
        year: yearFilter !== 'all' ? yearFilter : new Date().getFullYear()
      });
      
      alert('Heats created successfully!');
      fetchHeats();
    } catch (error) {
      console.error('Error creating heats:', error);
      alert('Failed to create heats');
    }
  };

  const tableData = heats.flatMap(heat => 
    heat.HeatAssignments.map(assignment => ({
      ...assignment,
      heat_number: heat.heat_number,
      event_name: heat.event_name,
      age_group: heat.age_group,
      gender: heat.gender,
      round: heat.round,
      bib_no: assignment.Athlete.bib_no,
      name: assignment.Athlete.name,
      school: assignment.Athlete.school
    }))
  );

  const columns = [
    { header: 'Heat No', accessor: 'heat_number' },
    { header: 'BIB No', accessor: 'bib_no' },
    { header: 'Athlete Name', accessor: 'name' },
    { header: 'School', accessor: 'school' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Age Group', accessor: 'age_group' },
    { header: 'Event', accessor: 'event_name' },
    {
      header: 'Timing',
      accessor: 'performance_time',
      cell: (value, row) => editingRow === row.assignment_id ? (
        <input
          type="number"
          step="0.01"
          value={timeValues.performance_time || ''}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00"
        />
      ) : value ? `${value}s` : '-'
    },
    {
      header: 'Place',
      accessor: 'place_in_heat',
      cell: (value, row) => editingRow === row.assignment_id ? (
        <input
          type="number"
          value={placeValues.place_in_heat || ''}
          onChange={(e) => handlePlaceChange(e.target.value)}
          className="w-12 p-1 border rounded"
          placeholder="0"
        />
      ) : value || '-'
    },
    {
      header: 'Qualification',
      accessor: 'qualified',
      cell: (value, row) => {
        if (row.round === 'final') {
          return row.place_in_heat || '-';
        }
        return value ? (row.qualification_type === 'Q' ? 'Q' : 'q') : '-';
      }
    },
    {
      header: 'Actions',
      accessor: 'assignment_id',
      cell: (value, row) => {
        if (editingRow === value) {
          return (
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSave(row, heats.find(h => h.heat_id === row.heat_id))}
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

  const filters = [
    {
      label: 'Year',
      options: [
        { value: 'all', label: 'All Years' },
        ...yearOptions.map(year => ({ value: year.toString(), label: year.toString() }))
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
        ...schoolOptions.map(school => ({ value: school, label: school }))
      ],
      value: schoolFilter,
      onChange: setSchoolFilter,
    },
    {
      label: 'Age Group',
      options: [
        { value: 'all', label: 'All' },
        ...ageGroupOptions.map(ageGroup => ({ value: ageGroup, label: ageGroup }))
      ],
      value: ageGroupFilter,
      onChange: setAgeGroupFilter,
    },
    {
      label: 'Event',
      options: [
        ...eventOptions.map(event => ({ value: event, label: event }))
      ],
      value: eventFilter,
      onChange: setEventFilter,
    },
    {
      label: 'Round',
      options: [
        { value: 'heat', label: 'Heats' },
        { value: 'semifinal', label: 'Semifinals' },
        { value: 'final', label: 'Finals' }
      ],
      value: roundFilter,
      onChange: setRoundFilter,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">
        Track Event Performance Tracking
      </h1>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          onClick={createHeats}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Heats
        </button>
        
        {roundFilter !== 'final' && (
          <button 
            onClick={createNextRound}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create {roundFilter === 'heat' ? 'Semifinals' : 'Finals'}
          </button>
        )}
        
        <button 
          onClick={fetchHeats}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">
            {eventFilter} - {roundFilter.charAt(0).toUpperCase() + roundFilter.slice(1)}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div>
              {heats.map(heat => (
                <div key={heat.heat_id} className="mb-8">
                  <h3 className="text-md font-semibold mb-2">
                    Heat {heat.heat_number} - {heat.gender} {heat.age_group}
                  </h3>
                  <Table 
                    columns={columns} 
                    data={tableData.filter(item => item.heat_id === heat.heat_id)} 
                  />
                </div>
              ))}
              
              {heats.length === 0 && (
                <div className="text-center py-8">
                  No heats found. Create heats to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackPerformance;