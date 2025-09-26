import React, { useState, useEffect, useRef } from 'react';
import Table from '../components/common/Table';
import FilterBar from '../components/common/FilterBar';
import { 
  getTrackEventAthletes, 
  createTrackHeats, 
  getHeats, 
  bulkUpdateHeatResults,
  autoUpdateQualification 
} from '../api/trackevent';

const TrackHeatPerformance = () => {
  const [yearFilter, setYearFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [heats, setHeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingHeats, setCreatingHeats] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [heatsCreated, setHeatsCreated] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  const timeValuesRef = useRef({});

  const [yearOptions, setYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  const TRACK_EVENTS = ['60M', '100M', '200M', '400M', '800M', '1500M', '5000M', '100MH', '400MH'];

  const fetchAthletes = async () => {
    try {
      const res = await getTrackEventAthletes({});
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
  }, []);

  const fetchHeatsData = async () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      setHeats([]);
      return;
    }

    setLoading(true);
    try {
      const filters = {
        year: yearFilter,
        gender: genderFilter,
        age_group: ageGroupFilter,
        event: eventFilter.toLowerCase()
      };
      
      const response = await getHeats(filters);
      console.log('Fetched heats data:', response.data.data); 
      setHeats(response.data.data || []);
      
      // Check if heats already exist for current filters
      const key = `${yearFilter}-${eventFilter}-${genderFilter}-${ageGroupFilter}`;
      if (response.data.data && response.data.data.length > 0) {
        setHeatsCreated(prev => new Set([...prev, key]));
      }
    } catch (error) {
      console.error('Error fetching heats:', error);
      alert('Failed to fetch heat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatsData();
  }, [yearFilter, genderFilter, ageGroupFilter, eventFilter]);

  const handleCreateHeats = async () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      alert('Please select all filters (Year, Gender, Age Group, Event)');
      return;
    }

    const key = `${yearFilter}-${eventFilter}-${genderFilter}-${ageGroupFilter}`;
    if (heatsCreated.has(key)) {
      alert('Heats already created for these filters');
      return;
    }

    setCreatingHeats(true);
    try {
      const heatData = {
        event: eventFilter.toLowerCase(),
        age_group: ageGroupFilter,
        gender: genderFilter,
        year: parseInt(yearFilter)
      };

      await createTrackHeats(heatData);
      setHeatsCreated(prev => new Set([...prev, key]));
      await fetchHeatsData();
      alert('Heats created successfully!');
    } catch (error) {
      console.error('Error creating heats:', error);
      alert('Failed to create heats: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreatingHeats(false);
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
    setEventFilter('all');
    setSearchTerm('');
    setHeats([]);
  };

  const handleEdit = (heatNo) => {
    setEditingRows(prev => ({
      ...prev,
      [heatNo]: true
    }));
    
    const heatAthletes = heats.filter(heat => parseInt(heat.heat_no) === parseInt(heatNo));
    console.log('Editing heat', heatNo, 'athletes:', heatAthletes); 
    heatAthletes.forEach(athlete => {
      timeValuesRef.current[athlete.heat_id] = athlete.timing || '';
    });
    console.log('Initialized timeValuesRef:', timeValuesRef.current); 
  };

  const handleTimeChange = (heatId, value) => {
    timeValuesRef.current[heatId] = value;
    console.log('Updated timeValuesRef for heat', heatId, ':', value); 
  };

  const handleSave = async (heatNo) => {
    try {
      const heatNumber = parseInt(heatNo);
      const heatAthletes = heats.filter(heat => parseInt(heat.heat_no) === heatNumber);
      
      console.log('Saving heat:', heatNumber);
      console.log('Current timeValuesRef:', timeValuesRef.current);
      console.log('Heat athletes to save:', heatAthletes);
      
      if (heatAthletes.length === 0) {
        alert('No athletes found for this heat. Please refresh the page and try again.');
        return;
      }
      
      const results = heatAthletes.map(athlete => {
        const timingValue = timeValuesRef.current[athlete.heat_id];
        console.log(`Processing athlete ${athlete.heat_id}:`, {
          name: athlete.athlete_name,
          currentTiming: athlete.timing,
          newTiming: timingValue
        });
        
        return {
          heat_id: athlete.heat_id,
          timing: timingValue && timingValue.toString().trim() !== '' 
            ? parseFloat(timingValue) 
            : null
        };
      });

      console.log('Final results to send:', results);

      const hasValidTiming = results.some(result => {
        const isValid = result.timing !== null && !isNaN(result.timing);
        console.log(`Result ${result.heat_id} valid:`, isValid, 'timing:', result.timing);
        return isValid;
      });
      
      if (!hasValidTiming) {
        alert('Please enter at least one timing before saving.');
        return;
      }

      console.log('Sending bulk update request...');
      await bulkUpdateHeatResults({ results });

      setEditingRows(prev => ({ ...prev, [heatNo]: false }));
      
      heatAthletes.forEach(athlete => {
        delete timeValuesRef.current[athlete.heat_id];
      });
      
      console.log('Refreshing heats data...');
      await fetchHeatsData();
      alert('Results saved successfully! Places updated automatically.');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = (heatNo) => {
    setEditingRows(prev => ({
      ...prev,
      [heatNo]: false
    }));
    
    const heatNumber = parseInt(heatNo);
    const heatAthletes = heats.filter(heat => parseInt(heat.heat_no) === heatNumber);
    heatAthletes.forEach(athlete => {
      delete timeValuesRef.current[athlete.heat_id];
    });
  };

  const handleSubmitAll = async () => {
    if (heats.length === 0) {
      alert('No heats to submit');
      return;
    }

    setSubmitting(true);
    try {
      const qualificationData = {
        event: eventFilter.toLowerCase(),
        age_group: ageGroupFilter,
        gender: genderFilter,
        year: parseInt(yearFilter)
      };

      await autoUpdateQualification(qualificationData);
      await fetchHeatsData();
      alert('Qualification status updated successfully!');
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to update qualification status: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Group heats by heat number
  const groupedHeats = heats.reduce((acc, heat) => {
    const heatNo = heat.heat_no.toString();
    if (!acc[heatNo]) {
      acc[heatNo] = [];
    }
    acc[heatNo].push(heat);
    return acc;
  }, {});

  console.log('Grouped heats:', groupedHeats); 

  const columns = [
    { header: 'BIB No', accessor: 'bib_no' },
    { header: 'Athlete Name', accessor: 'athlete_name' },
    { header: 'School', accessor: 'school' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Age Group', accessor: 'age_group' },
    {
      header: 'Timing',
      accessor: 'timing',
      cell: (value, row) => editingRows[row.heat_no] ? (
        <input
          type="number"
          step="0.01"
          defaultValue={value || ''}
          onChange={(e) => handleTimeChange(row.heat_id, e.target.value)}
          onBlur={(e) => handleTimeChange(row.heat_id, e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00"
          min="0"
        />
      ) : value ? `${value}s` : '-'
    },
    {
      header: 'Place',
      accessor: 'place',
      cell: (value, row) => {
        return row.timing ? (value || '-') : '-';
      }
    },
    {
      header: 'Qualification',
      accessor: 'qualification_status',
      cell: (value) => {
        if (!value) return '-';
        return value === 'Q' ? 'Q (Qualified)' : 'q (Next Fastest)';
      }
    }
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
        { value: 'all', label: 'All Events' },
        ...eventOptions.map(event => ({ value: event, label: event }))
      ],
      value: eventFilter,
      onChange: setEventFilter,
    },
  ];

  const isCreateHeatsDisabled = () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      return true;
    }
    const key = `${yearFilter}-${eventFilter}-${genderFilter}-${ageGroupFilter}`;
    return heatsCreated.has(key);
  };

  const isDirectFinalEvent = () => {
    const directFinalEvents = ['800M', '1500M', '5000M'];
    return directFinalEvents.includes(eventFilter.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">
        Track Event {isDirectFinalEvent() ? 'Finals' : 'Heats'} Performance
      </h1>

      <FilterBar
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleCreateHeats}
          disabled={isCreateHeatsDisabled() || creatingHeats}
          className={`px-6 py-2 rounded ${
            isCreateHeatsDisabled() || creatingHeats
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#FF5722] hover:bg-[#B33F18]'
          } text-white font-medium`}
        >
          {creatingHeats ? 'Creating Heats...' : isDirectFinalEvent() ? 'Create Final' : 'Create Heats'}
        </button>
        
        {heats.length > 0 && !isDirectFinalEvent() && (
          <button
            onClick={handleSubmitAll}
            disabled={submitting}
            className={`px-6 py-2 rounded ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white font-medium`}
          >
            {submitting ? 'Submitting...' : 'Update Qualification'}
          </button>
        )}
      </div>

      {isDirectFinalEvent() && heats.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <p className="text-blue-800">
            <strong>Note:</strong> This is a direct final event. After entering timings and saving, 
            the results will be automatically available in the Finals page.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">
            {eventFilter} - {genderFilter} - {ageGroupFilter} - {yearFilter}
            {isDirectFinalEvent() && ' (Direct Final)'}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div>
              {Object.keys(groupedHeats).map(heatNo => {
                const heatData = groupedHeats[heatNo];
                const isEditing = editingRows[heatNo];
                
                return (
                  <div key={heatNo} className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-semibold">
                        {isDirectFinalEvent() ? 'Final' : `Heat ${heatNo}`} - {genderFilter} {ageGroupFilter} ({heatData.length} athletes)
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => handleEdit(heatNo)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit Timing
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(heatNo)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleCancel(heatNo)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <Table 
                      columns={columns} 
                      data={heatData} 
                    />
                  </div>
                );
              })}
              
              {heats.length === 0 && (
                <div className="text-center py-8">
                  {yearFilter !== 'all' && genderFilter !== 'all' && ageGroupFilter !== 'all' && eventFilter !== 'all' 
                    ? `No ${isDirectFinalEvent() ? 'final' : 'heats'} found. Click "${isDirectFinalEvent() ? 'Create Final' : 'Create Heats'}" to generate.`
                    : 'Please select all filters to view or create heats.'
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackHeatPerformance;