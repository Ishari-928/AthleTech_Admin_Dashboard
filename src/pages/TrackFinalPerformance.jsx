import React, { useState, useEffect, useRef } from 'react';
import Table from '../components/common/Table';
import FilterBar from '../components/common/FilterBar';
import { 
  getFinals, 
  bulkUpdateFinalResults,
  getTrackEventAthletes
} from '../api/trackevent';

const TrackFinalPerformance = () => {
  const [yearFilter, setYearFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [finals, setFinals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const fetchFinalsData = async () => {
    if (yearFilter === 'all' || genderFilter === 'all' || ageGroupFilter === 'all' || eventFilter === 'all') {
      setFinals([]);
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
      
      const response = await getFinals(filters);
      console.log('Fetched finals data:', response.data.data);
      
      const sortedFinals = (response.data.data || []).sort((a, b) => {
        if (!a.timing && !b.timing) return 0;
        if (!a.timing) return 1;
        if (!b.timing) return -1;
        return parseFloat(a.timing) - parseFloat(b.timing);
      });
      
      setFinals(sortedFinals);
    } catch (error) {
      console.error('Error fetching finals:', error);
      alert('Failed to fetch final results data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinalsData();
  }, [yearFilter, genderFilter, ageGroupFilter, eventFilter]);

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
    setFinals([]);
  };

  const handleEdit = () => {
    setEditing(true);
    
    finals.forEach(final => {
      timeValuesRef.current[final.final_id] = final.timing || '';
    });
    console.log('Initialized timeValuesRef:', timeValuesRef.current);
  };

  const handleTimeChange = (finalId, value) => {
    timeValuesRef.current[finalId] = value;
    console.log('Updated timeValuesRef for final', finalId, ':', value);
  };

  const handleSave = async () => {
    try {
      console.log('=== SAVING FINAL RESULTS ===');
      console.log('Current timeValuesRef:', timeValuesRef.current);

      if (finals.length === 0) {
        alert('No finalists found to save.');
        return;
      }
      
      const results = finals.map(final => {
        const timingValue = timeValuesRef.current[final.final_id];
        console.log(`Finalist ${final.athlete_name}:`, {
          currentTime: final.timing,
          newTime: timingValue,
          final_id: final.final_id
        });
        
        return {
          final_id: final.final_id,
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
      
      const response = await bulkUpdateFinalResults({ results });
      console.log('Backend response:', response.data);

      setEditing(false);
      
      finals.forEach(final => {
        delete timeValuesRef.current[final.final_id];
      });
      
      console.log('Refreshing data...');
      await fetchFinalsData();
      
      alert('Final results saved successfully! Places updated automatically.');
    } catch (error) {
      console.error('Error saving final results:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to save results: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setEditing(false);
    
    finals.forEach(final => {
      delete timeValuesRef.current[final.final_id];
    });
  };

  const filteredFinals = finals.filter(final => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      final.bib_no.toLowerCase().includes(term) ||
      final.athlete_name.toLowerCase().includes(term) ||
      final.school.toLowerCase().includes(term)
    );
  });

  const sortedFilteredFinals = filteredFinals.sort((a, b) => {
    if (!a.timing && !b.timing) return 0;
    if (!a.timing) return 1;
    if (!b.timing) return -1;
    return parseFloat(a.timing) - parseFloat(b.timing);
  });

  const columns = [
    { 
      header: 'Place', 
      accessor: 'place',
      cell: (value, row, index) => {
        if (row.timing) {
          return value || (index + 1);
        }
        return '-';
      }
    },
    { header: 'BIB No', accessor: 'bib_no' },
    { header: 'Athlete Name', accessor: 'athlete_name' },
    { header: 'Age Group', accessor: 'age_group' },
    { header: 'School', accessor: 'school' },
    { header: 'Event', accessor: 'event' },
    {
      header: 'Timing',
      accessor: 'timing',
      cell: (value, row) => editing ? (
        <input
          type="number"
          step="0.01"
          defaultValue={value || ''}
          onChange={(e) => handleTimeChange(row.final_id, e.target.value)}
          onBlur={(e) => handleTimeChange(row.final_id, e.target.value)}
          className="w-20 p-1 border rounded"
          placeholder="0.00"
          min="0"
        />
      ) : value ? `${value}s` : '-'
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">
        Track Event Final Results
      </h1>

      <FilterBar
        filters={filters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <div className="flex space-x-4 mb-6">
        {!editing ? (
          <button
            onClick={handleEdit}
            disabled={finals.length === 0}
            className={`px-6 py-2 rounded ${
              finals.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium`}
          >
            Edit Final Results
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Save Results
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-[#05041D] mb-4">
            {eventFilter} - {genderFilter} - {ageGroupFilter} - {yearFilter} - Final Results
            {editing && <span className="ml-2 text-blue-600 text-sm">(Editing Mode)</span>}
          </h2>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div>
              {sortedFilteredFinals.length > 0 ? (
                <div>
                  
                  
                  <Table 
                    columns={columns} 
                    data={sortedFilteredFinals}
                  />
                  
                  <div className="mt-4 text-sm text-gray-600">
                    Showing {sortedFilteredFinals.length} finalist(s)
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  {yearFilter !== 'all' && genderFilter !== 'all' && ageGroupFilter !== 'all' && eventFilter !== 'all' 
                    ? 'No final results found. Final results will appear here after semifinals are completed or for direct final events.'
                    : 'Please select all filters to view final results.'
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

export default TrackFinalPerformance;