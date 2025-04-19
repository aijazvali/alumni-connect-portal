"use client"
import React, { useState } from 'react';
import { authhook } from "@/authcontext/Authcontext";
import Navbar from '@/components/Navbar';

function Page() {
    const auth=authhook();
    const alumni=auth.alumni;
  const [filter, setFilter] = useState({
    college: '',
    batch: '',
    branch: ''
  });
  const [loading,setLoading]=useState(false);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const filterhandler=()=>{
    auth.setInputval(filter)
  }

  return (
    <div className="text-white ">
        
        <div className="flex flex-col sm:flex-row flex-wrap sm:justify-center items-center gap-3 w-full sm:w-11/12 p-3">
  <input
    className="bg-blue-500 p-2 rounded w-full sm:w-auto"
    type="text"
    id="college"
    placeholder="College"
    value={filter.college}
    onChange={handleChange}
  />

  <input
    className="bg-blue-500 p-2 rounded w-full sm:w-auto"
    type="text"
    id="batch"
    placeholder="Batch"
    value={filter.batch}
    onChange={handleChange}
  />

  <input
    className="bg-blue-500 p-2 rounded w-full sm:w-auto"
    type="text"
    id="branch"
    placeholder="Branch"
    value={filter.branch}
    onChange={handleChange}
  />

  <button
    className="bg-blue-500 p-2 rounded w-full sm:w-auto"
    onClick={filterhandler}
  >
    Find Alumni
  </button>
</div>


    <div className='flex justify-center mt-9'>
        {loading ? (
        <p>Loading...</p>
      ) : alumni.length === 0 ? (
        <p>No alumni found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white  w-3/4">
          {auth.alumni.map((alum,indx) => (
            <div key={indx} className="border p-4 rounded shadow flex text-blue-400 gap-4">
                <div className='w-1/2 h-full'><img src="https://static.vecteezy.com/system/resources/previews/009/368/313/non_2x/scholarship-pixel-perfect-rgb-color-icon-for-dark-theme-financial-support-for-student-state-offered-grant-simple-filled-line-drawing-on-night-mode-background-editable-stroke-vector.jpg"
                            className='w-'/></div>
              <div className='flex flex-col justify-around'>
                    <h2 className="text-xl font-semibold">{alum.name}</h2>
                    <p>{alum.email}</p>
                    <p>{alum.branch}, Batch {alum.batch}</p>
                    <p className="text-sm text-gray-500">{alum.college}</p>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
      

    </div>
  )
}

export default Page;
