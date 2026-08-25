import React, { useState, useEffect, useRef } from 'react';
import Table from '../components/common/Table';
import FilterBar from '../components/common/FilterBar';
import { 
  getSemifinals, 
  bulkUpdateSemifinalResults,
  getTrackEventAthletes,
  createSemifinals,
  updateSemifinalResults
} from '../api/trackevent';

const TrackSemifinalPerformance = () => {
  const [yearFilter, setYearFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [semifinals, setSemifinals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingSemifinals, setCreatingSemifinals] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [semifinalsCreated, setSemifinalsCreated] = useState(new Set());

  const timeValuesRef = useRef({});

  const [yearOptions, setYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  const TRACK_EVENTS = ['60M', '100M', '200M', '400M', '800M', '1500M', '5000M', '100MH', '400MH'];

  const fetchFilterOptions = async () => {
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
    fetchFilterOptions();
  }, []);

  const fetchQualifiedAthletes = async () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      return [];
    }

    try {
      const filters = {
        year: yearFilter,
        gender: genderFilter,
        age_group: ageGroupFilter,
        event: eventFilter.toLowerCase()
      };
      
      const response = await getTrackEventAthletes(filters);
      const allAthletes = response.data.data || [];
      
      const qualifiedAthletes = allAthletes.filter(athlete => {
        return true;
      });
      
      return qualifiedAthletes;
    } catch (error) {
      console.error('Error fetching qualified athletes:', error);
      return [];
    }
  };

  const fetchSemifinalsData = async () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      setSemifinals([]);
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
      
      const response = await getSemifinals(filters);
      console.log('Fetched semifinals data:', response.data.data);
      setSemifinals(response.data.data || []);
      
      const key = `${yearFilter}-${eventFilter}-${genderFilter}-${ageGroupFilter}`;
      if (response.data.data && response.data.data.length > 0) {
        setSemifinalsCreated(prev => new Set([...prev, key]));
      }
    } catch (error) {
      console.error('Error fetching semifinals:', error);
      alert('Failed to fetch semifinal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemifinalsData();
  }, [yearFilter, genderFilter, ageGroupFilter, eventFilter]);

  const handleCreateSemifinals = async () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      alert('Please select all filters (Year, Gender, Age Group, Event)');
      return;
    }

    const key = `${yearFilter}-${eventFilter}-${genderFilter}-${ageGroupFilter}`;
    if (semifinalsCreated.has(key)) {
      alert('Semifinals already created for these filters');
      return;
    }

    const qualifiedAthletes = await fetchQualifiedAthletes();
    if (qualifiedAthletes.length === 0) {
      alert('No qualified athletes found for these filters. Please ensure heats have been completed and qualification has been updated.');
      return;
    }

    setCreatingSemifinals(true);
    try {
      const semifinalData = {
        event: eventFilter.toLowerCase(),
        age_group: ageGroupFilter,
        gender: genderFilter,
        year: parseInt(yearFilter)
      };

      await createSemifinals(semifinalData);
      setSemifinalsCreated(prev => new Set([...prev, key]));
      await fetchSemifinalsData();
      alert('Semifinals created successfully!');
    } catch (error) {
      console.error('Error creating semifinals:', error);
      alert('Failed to create semifinals: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreatingSemifinals(false);
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
    setSemifinals([]);
  };

  const handleEdit = (heatNo) => {
    setEditingRows(prev => ({
      ...prev,
      [heatNo]: true
    }));
    
    const heatAthletes = semifinals.filter(semifinal => parseInt(semifinal.heat_no) === parseInt(heatNo));
    console.log('Editing semifinal heat', heatNo, 'athletes:', heatAthletes);
    heatAthletes.forEach(athlete => {
      timeValuesRef.current[athlete.semifinal_id] = athlete.timing || '';
    });
    console.log('Initialized timeValuesRef:', timeValuesRef.current);
  };

  const handleTimeChange = (semifinalId, value) => {
    timeValuesRef.current[semifinalId] = value;
    console.log('Updated timeValuesRef for semifinal', semifinalId, ':', value);
  };

  const handleSave = async (heatNo) => {
  try {
    const heatNumber = parseInt(heatNo);
    const heatAthletes = semifinals.filter(semifinal => parseInt(semifinal.heat_no) === heatNumber);
    
    console.log('=== SAVING SEMIFINAL HEAT ===');
    console.log('Heat number:', heatNumber);
    console.log('Athletes in this heat:', heatAthletes);

    if (heatAthletes.length === 0) {
      alert('No athletes found for this heat. Please refresh the page and try again.');
      return;
    }
    
    const results = heatAthletes.map(athlete => {
      const timingValue = timeValuesRef.current[athlete.semifinal_id];
      console.log(`Athlete ${athlete.athlete_name}:`, {
        currentTime: athlete.timing,
        newTime: timingValue,
        semifinal_id: athlete.semifinal_id
      });
      
      return {
        semifinal_id: athlete.semifinal_id, 
        timing: timingValue && timingValue.toString().trim() !== '' 
          ? parseFloat(timingValue) 
          : null
      };
    });

    console.log('Data to send to backend:', results);

    const hasValidTiming = results.some(result => {
      const isValid = result.timing !== null && !isNaN(result.timing);
      console.log(`Result valid:`, isValid, 'timing:', result.timing);
      return isValid;
    });
    
    if (!hasValidTiming) {
      alert('Please enter at least one timing before saving.');
      return;
    }

    console.log('Sending to backend...');
    
    const response = await bulkUpdateSemifinalResults({ results });
    console.log('Backend response:', response.data);

    setEditingRows(prev => ({ ...prev, [heatNo]: false }));
    
    heatAthletes.forEach(athlete => {
      delete timeValuesRef.current[athlete.semifinal_id];
    });
    
    console.log('Refreshing data...');
    await fetchSemifinalsData();
    
    alert('Semifinal results saved successfully!');
  } catch (error) {
    console.error('Error saving semifinal results:', error);
    console.error('Error details:', error.response?.data);
    alert('Failed to save results: ' + (error.response?.data?.message || error.message));
  }
};

  const handleCancel = (heatNo) => {
    setEditingRows(prev => ({
      ...prev,
      [heatNo]: false
    }));
    
    const heatNumber = parseInt(heatNo);
    const heatAthletes = semifinals.filter(semifinal => parseInt(semifinal.heat_no) === heatNumber);
    heatAthletes.forEach(athlete => {
      delete timeValuesRef.current[athlete.semifinal_id];
    });
  };

  const handleSubmitAll = async () => {
    if (semifinals.length === 0) {
      alert('No semifinals to submit');
      return;
    }

    setSubmitting(true);
    try {
      const semifinalData = {
        event: eventFilter.toLowerCase(),
        age_group: ageGroupFilter,
        gender: genderFilter,
        year: parseInt(yearFilter)
      };

      await updateSemifinalResults(semifinalData);
      await fetchSemifinalsData();
      alert('Semifinal results submitted successfully! Finals have been created.');
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to submit semifinal results: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const groupedSemifinals = semifinals.reduce((acc, semifinal) => {
    const heatNo = semifinal.heat_no.toString();
    if (!acc[heatNo]) {
      acc[heatNo] = [];
    }
    acc[heatNo].push(semifinal);
    return acc;
  }, {});

  console.log('Grouped semifinals:', groupedSemifinals);

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
          onChange={(e) => handleTimeChange(row.semifinal_id, e.target.value)}
          onBlur={(e) => handleTimeChange(row.semifinal_id, e.target.value)}
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

  const isCreateSemifinalsDisabled = () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      return true;
    }
    const key = `${yearFilter}-${eventFilter}-${genderFilter}-${ageGroupFilter}`;
    return semifinalsCreated.has(key);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">
        Track Event Semifinals Performance
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
          onClick={handleCreateSemifinals}
          disabled={isCreateSemifinalsDisabled() || creatingSemifinals}
          className={`px-6 py-2 rounded ${
            isCreateSemifinalsDisabled() || creatingSemifinals
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#FF5722] hover:bg-[#B33F18]'
          } text-white font-medium`}
        >
          {creatingSemifinals ? 'Creating Semifinals...' : 'Create Semifinals'}
        </button>
        
        {semifinals.length > 0 && (
          <button
            onClick={handleSubmitAll}
            disabled={submitting}
            className={`px-6 py-2 rounded ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white font-medium`}
          >
            {submitting ? 'Submitting...' : 'Submit Results & Create Finals'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">
            {eventFilter} - {genderFilter} - {ageGroupFilter} - {yearFilter} - Semifinals
          </h2>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div>
              {Object.keys(groupedSemifinals).map(heatNo => {
                const heatData = groupedSemifinals[heatNo];
                const isEditing = editingRows[heatNo];
                
                return (
                  <div key={heatNo} className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-semibold">
                        Semifinal Heat {heatNo} - {genderFilter} {ageGroupFilter} ({heatData.length} athletes)
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
              
              {semifinals.length === 0 && (
                <div className="text-center py-8">
                  {yearFilter !== 'all' && genderFilter !== 'all' && ageGroupFilter !== 'all' && eventFilter !== 'all' 
                    ? 'No semifinals found. Click "Create Semifinals" to generate semifinal heats from qualified athletes.'
                    : 'Please select all filters to view or create semifinals.'
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

export default TrackSemifinalPerformance;