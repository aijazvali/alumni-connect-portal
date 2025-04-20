import { useEffect, useState } from "react";
import axios from "axios";

interface Alumni {
  _id: string;
  name: string;
  email: string;
  role: string;
  batch: string;
}

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("All");

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBatch(e.target.value);
  };

  useEffect(() => {
    axios
      .get("https://alumni-connect-portal.onrender.com/api/users")
      .then((res) => {
        const allAlumni = res.data.filter((user: Alumni) => user.role === "alumni");
        setAlumniList(allAlumni);
      })
      .catch((err) => console.error("Failed to fetch alumni:", err));
  }, []);

  const filteredAlumni = selectedBatch === "All"
    ? alumniList
    : alumniList.filter((alum) => alum.batch === selectedBatch);

  const uniqueBatches = Array.from(new Set(alumniList.map((a) => a.batch)));

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎓 Alumni Directory</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label className="text-sm sm:text-base">
          Filter by Batch:
          <select
            value={selectedBatch}
            onChange={handleBatchChange}
            className="ml-2 p-2 rounded bg-gray-700 text-white border border-gray-500"
          >
            <option value="All">All</option>
            {uniqueBatches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm sm:text-base">
          Total Alumni: <span className="font-semibold">{filteredAlumni.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlumni.map((alum) => (
          <div key={alum._id} className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-bold">{alum.name}</h2>
            <p className="text-sm text-gray-300">{alum.email}</p>
            <p className="text-sm text-gray-400">Batch: {alum.batch}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
