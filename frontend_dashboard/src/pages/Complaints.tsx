import { useState } from "react";

const complaintsData = [
  {
    id: "GRV-10245",
    citizen: "Rahul Sharma",
    complaint: "No water supply in Sector 12 for the last 3 days",
    category: "Water Supply",
    department: "Water Department",
    priority: "Critical",
    status: "Pending",
    location: "Sector 12",
    duplicate: "Possible Duplicate",
    date: "01 Sep 2026",
  },
  {
    id: "GRV-10244",
    citizen: "Priya Patel",
    complaint: "Large pothole near Gandhi Nagar main road",
    category: "Roads",
    department: "Roads & Infrastructure",
    priority: "High",
    status: "In Progress",
    location: "Gandhi Nagar",
    duplicate: "Duplicate",
    date: "01 Sep 2026",
  },
  {
    id: "GRV-10243",
    citizen: "Amit Kumar",
    complaint: "Frequent power cuts in residential area",
    category: "Electricity",
    department: "Electricity Department",
    priority: "High",
    status: "In Progress",
    location: "Shivaji Chowk",
    duplicate: "No",
    date: "31 Aug 2026",
  },
  {
    id: "GRV-10242",
    citizen: "Sneha Joshi",
    complaint: "Garbage has not been collected for one week",
    category: "Sanitation",
    department: "Sanitation Department",
    priority: "Medium",
    status: "Pending",
    location: "Civil Lines",
    duplicate: "No",
    date: "31 Aug 2026",
  },
  {
    id: "GRV-10241",
    citizen: "Vikas Singh",
    complaint: "Street lights are not working",
    category: "Street Lighting",
    department: "Public Works",
    priority: "Medium",
    status: "Resolved",
    location: "MG Road",
    duplicate: "No",
    date: "30 Aug 2026",
  },
  {
    id: "GRV-10240",
    citizen: "Neha Verma",
    complaint: "Traffic signal not working at main junction",
    category: "Traffic",
    department: "Transport Department",
    priority: "Critical",
    status: "Escalated",
    location: "Station Road",
    duplicate: "Possible Duplicate",
    date: "30 Aug 2026",
  },
];

export default function Complaints() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredComplaints = complaintsData.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(search.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(search.toLowerCase()) ||
      complaint.complaint.toLowerCase().includes(search.toLowerCase()) ||
      complaint.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Complaints
        </h1>

        <p className="mt-2 text-sm text-[#929db6]">
          Manage, classify, prioritize and track citizen grievances.
        </p>
      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Total Complaints
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#f1f3f8]">
            2,410
          </h2>

          <p className="mt-1 text-xs text-[#6fcdb5]">
            +12.8% this month
          </p>
        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e5b45e]">
            390
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Awaiting action
          </p>
        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Critical
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            120
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Require immediate action
          </p>
        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Duplicates
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6573ff]">
            607
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Detected by AI
          </p>
        </div>

      </div>


      {/* FILTERS */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-4">

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          <input
            type="text"
            placeholder="Search complaint, citizen or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-[4px] border border-[#303a55] bg-[#1b233a] px-4 py-2.5 text-sm text-[#f1f3f8]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-[4px] border border-[#303a55] bg-[#1b233a] px-4 py-2.5 text-sm text-[#f1f3f8]"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Escalated</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-[4px] border border-[#303a55] bg-[#1b233a] px-4 py-2.5 text-sm text-[#f1f3f8]"
          >
            <option>All</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

        </div>

      </div>


      {/* TABLE */}

      <div className="overflow-hidden rounded-[4px] border border-[#303a55] bg-[#222b45]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left">

            <thead className="bg-[#1b233a]">

              <tr>
                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Complaint
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Category
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Department
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Priority
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  AI Duplicate
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Status
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Action
                </th>
              </tr>

            </thead>


            <tbody>

              {filteredComplaints.map((complaint) => (

                <tr
                  key={complaint.id}
                  className="border-t border-[#303a55] hover:bg-[#29334f]"
                >

                  <td className="px-5 py-4">

                    <p className="text-xs font-bold text-[#6573ff]">
                      {complaint.id}
                    </p>

                    <p className="mt-1 max-w-[300px] text-sm font-medium text-[#f1f3f8]">
                      {complaint.complaint}
                    </p>

                    <p className="mt-1 text-[10px] text-[#929db6]">
                      {complaint.citizen} • {complaint.location}
                    </p>

                  </td>


                  <td className="px-5 py-4 text-sm text-[#c4cada]">
                    {complaint.category}
                  </td>


                  <td className="px-5 py-4 text-xs text-[#c4cada]">
                    {complaint.department}
                  </td>


                  <td className="px-5 py-4">

                    <span
                      className={`rounded-[4px] px-2 py-1 text-[10px] font-bold ${
                        complaint.priority === "Critical"
                          ? "bg-[#e57979]/10 text-[#e57979]"
                          : complaint.priority === "High"
                          ? "bg-[#e5b45e]/10 text-[#e5b45e]"
                          : "bg-[#6573ff]/10 text-[#6573ff]"
                      }`}
                    >
                      {complaint.priority}
                    </span>

                  </td>


                  <td className="px-5 py-4">

                    <span
                      className={`text-[10px] font-semibold ${
                        complaint.duplicate === "Duplicate"
                          ? "text-[#e57979]"
                          : complaint.duplicate === "Possible Duplicate"
                          ? "text-[#e5b45e]"
                          : "text-[#6fcdb5]"
                      }`}
                    >
                      {complaint.duplicate}
                    </span>

                  </td>


                  <td className="px-5 py-4">

                    <span className="text-xs text-[#c4cada]">
                      ● {complaint.status}
                    </span>

                  </td>


                  <td className="px-5 py-4">

                    <button className="rounded-[4px] border border-[#303a55] px-3 py-2 text-[10px] font-semibold text-[#6573ff] hover:border-[#6573ff]">
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}