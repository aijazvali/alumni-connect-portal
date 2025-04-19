"use client";
import React, { useState } from 'react';
import { authhook } from "@/authcontext/Authcontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';


function Page() {
  const auth = authhook();
  const alumni = auth.alumni;

  const [filter, setFilter] = useState({
    batch: '',
    branch: '',
    jobtitle: '',
    location: ''
  });

  const [selectedField, setSelectedField] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const filterhandler = () => {
    auth.setInputval(filter);
  };

  const handleSortByBatch = (order: 'asc' | 'desc') => {
    const sorted = [...auth.alumni];
    sorted.sort((a, b) => {
      const diff = Number(a.batch || 0) - Number(b.batch || 0);
      return order === 'asc' ? diff : -diff;
    });
    auth.setAlumni(sorted);
  };

  const handleSortByJobtitle = (order: 'asc' | 'desc') => {
    const sorted = [...auth.alumni];
    sorted.sort((a, b) => {
      const jobA = a.jobtitle || '';
      const jobB = b.jobtitle || '';
      return order === 'asc'
        ? jobA.localeCompare(jobB)
        : jobB.localeCompare(jobA);
    });
    auth.setAlumni(sorted);
  };

  return (
    <div className="text-white flex flex-col items-center min-h-screen p-4 bg-black">
      {/* Filter + Button Section (First Line) */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center items-center gap-3 w-full">
          <select
            className="bg-blue-600 text-white p-2 rounded w-[9rem]"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option value="">Search By</option>
            <option value="batch">Batch</option>
            <option value="branch">Branch</option>
            <option value="jobtitle">Job Title</option>
            <option value="location">Location</option>
          </select>

          <input
            className="bg-blue-500 p-1.5 rounded w-[13rem]"
            type="text"
            placeholder={
              selectedField
                ? selectedField.charAt(0).toUpperCase() + selectedField.slice(1)
                : "Enter Value"
            }
            value={filter[selectedField as keyof typeof filter] || ""}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                [selectedField]: e.target.value,
              }))
            }
            disabled={!selectedField}
          />

          <button
            className="bg-blue-500 p-1.5 rounded w-[8rem]"
            onClick={filterhandler}
            disabled={!selectedField}
          >
            Find Alumni
          </button>
        </div>

        {/* Sorting Section (Second Line) */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-1 w-full">
          <select
            onChange={(e) => handleSortByBatch(e.target.value as 'asc' | 'desc')}
            className="bg-blue-600 text-white p-2 rounded w-[12rem] "
          >
            <option value="">Sort by Batch</option>
            <option value="desc">Newest to Oldest</option>
            <option value="asc">Oldest to Newest</option>
          </select>

          <select
            onChange={(e) => handleSortByJobtitle(e.target.value as 'asc' | 'desc')}
            className="bg-blue-600 text-white p-2 rounded w-[12rem]"
          >
            <option value="">Sort by Job Title</option>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
      </div>

      {/* Alumni Display Section */}
      <div className="w-full max-w-5xl mt-9 flex justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : alumni.length === 0 ? (
          <p>No alumni found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {alumni.map((alum, indx) => (
              <div key={indx} className="border p-4 rounded shadow flex text-blue-400 gap-4">
                <div className="max-w-[50%]">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/009/368/313/non_2x/scholarship-pixel-perfect-rgb-color-icon-for-dark-theme-financial-support-for-student-state-offered-grant-simple-filled-line-drawing-on-night-mode-background-editable-stroke-vector.jpg"
                    className="w-full h-auto object-contain"
                    alt="Alumni avatar"
                  />
                </div>
                <div className="flex flex-col justify-around gap-2">
                  <h2 className="text-xl text-blue-600 font-semibold">{alum.name}</h2>
                  <p>{alum.email}</p>
                  <p>{alum.branch}</p>
                  <p>Batch: {alum.batch}</p>
                  <p>{alum.jobtitle}</p>
                  <p>{alum.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
