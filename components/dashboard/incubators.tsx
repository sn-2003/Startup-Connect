import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Incubator {
  id: string;
  name: string;
  logo?: string;
  description: string;
  location: string;
  focusAreas: string[];
  website?: string;
  applyLink?: string;
  createdAt: string;
}


const getUnique = (arr: string[]) => Array.from(new Set(arr)).sort();

const Incubators: React.FC = () => {
  const [incubators, setIncubators] = useState<Incubator[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [focusFilter, setFocusFilter] = useState('');
  const [sort, setSort] = useState<'name'|'location'|'createdAt'>('name');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const loadIncubators = async () => {
      try {
        const response = await fetch('/api/incubators');
        const data = await response.json();
        setIncubators(data.incubators || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    loadIncubators();
    const interval = setInterval(() => {
      loadIncubators();
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const allLocations = getUnique(incubators.map(i => i.location));
  const allFocusAreas = getUnique(incubators.flatMap(i => i.focusAreas));

  let filtered = incubators.filter((incubator) => {
    const matchesSearch =
      incubator.name.toLowerCase().includes(search.toLowerCase()) ||
      incubator.location.toLowerCase().includes(search.toLowerCase()) ||
      incubator.focusAreas.some(area => area.toLowerCase().includes(search.toLowerCase()));
    const matchesLocation = locationFilter ? incubator.location === locationFilter : true;
    const matchesFocus = focusFilter ? incubator.focusAreas.includes(focusFilter) : true;
    return matchesSearch && matchesLocation && matchesFocus;
  });

  // Sorting
  filtered = filtered.sort((a, b) => {
    let valA: string | number = '';
    let valB: string | number = '';
    if (sort === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sort === 'location') {
      valA = a.location.toLowerCase();
      valB = b.location.toLowerCase();
    } else if (sort === 'createdAt') {
      valA = new Date(a.createdAt).getTime();
      valB = new Date(b.createdAt).getTime();
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1); // Reset to first page on filter/sort/search change
  }, [search, locationFilter, focusFilter, sort, sortDir]);

  if (loading) {
    return <div className="py-10 text-center">Loading incubators...</div>;
  }

  return (
    <div className="py-8 px-2">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Incubators
        <span className="text-xs text-gray-500 font-normal">({filtered.length} found)</span>
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name, location, or focus area..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-72"
        />
        <select
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-48"
        >
          <option value="">All Locations</option>
          {allLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select
          value={focusFilter}
          onChange={e => setFocusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-48"
        >
          <option value="">All Focus Areas</option>
          {allFocusAreas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as 'name'|'location'|'createdAt')}
          className="border rounded px-3 py-2 w-full md:w-40"
        >
          <option value="name">Sort by Name</option>
          <option value="location">Sort by Location</option>
          <option value="createdAt">Sort by Newest</option>
        </select>
        <button
          className="border rounded px-2 py-2 text-xs ml-1"
          onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDir === 'asc' ? '↑' : '↓'}
        </button>
        {(locationFilter || focusFilter || search) && (
          <button
            className="text-xs text-gray-500 underline ml-2"
            onClick={() => { setLocationFilter(''); setFocusFilter(''); setSearch(''); }}
          >
            Clear Filters
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No incubators found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((incubator) => (
              <div key={incubator.id} className="bg-white rounded-lg shadow p-6 flex flex-col transition hover:shadow-lg">
                {incubator.logo && (
                  <Image src={incubator.logo} alt={incubator.name} width={64} height={64} className="h-16 w-16 object-cover rounded mb-4 self-center" />
                )}
                <h3 className="text-lg font-semibold mb-2 text-center">{incubator.name}</h3>
                <div className="text-sm text-gray-600 mb-2 text-center">{incubator.location}</div>
                <div className="flex flex-wrap gap-2 mb-2 justify-center">
                  {incubator.focusAreas.map((area) => (
                    <span key={area} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{area}</span>
                  ))}
                </div>
                <div className="text-gray-700 text-sm mb-2">
                  {expanded === incubator.id ? incubator.description : (
                    incubator.description.length > 120 ? (
                      <>
                        {incubator.description.slice(0, 120)}...{' '}
                        <button className="text-blue-600 underline text-xs" onClick={() => setExpanded(incubator.id)}>Read More</button>
                      </>
                    ) : incubator.description
                  )}
                  {expanded === incubator.id && incubator.description.length > 120 && (
                    <button className="text-blue-600 underline text-xs ml-2" onClick={() => setExpanded(null)}>Show Less</button>
                  )}
                </div>
                <div className="mt-auto flex gap-3 justify-center">
  {incubator.website && (
    <a href={incubator.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Website</a>
  )}
</div>

              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Incubators;
