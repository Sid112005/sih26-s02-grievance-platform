import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getComplaints } from "../api/complaintsApi";
import type { Complaint } from "../types/complaint";

interface Hotspot {
  area: string;
  complaints: number;
  critical: number;
  duplicates: number;
  issue: string;
  severity: string;
  lat: number;
  lng: number;
}

export default function Hotspots() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getComplaints();
        setComplaints(data.complaints);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the grievance backend.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /*
   * GROUP COMPLAINTS BY ADDRESS
   *
   * Later this can be replaced with proper
   * geographical clustering using latitude/longitude.
   */

  const hotspots = useMemo<Hotspot[]>(() => {
    const groups: Record<string, Hotspot> = {};

    complaints.forEach((complaint) => {
      const area =
        complaint.location.address_context ||
        "Unknown Area";

      if (!groups[area]) {
        groups[area] = {
          area,
          complaints: 0,
          critical: 0,
          duplicates: 0,
          issue:
            complaint.classification.category ||
            "General",
          severity:
            complaint.classification.urgency ||
            "LOW",
          lat: complaint.location.lat,
          lng: complaint.location.lng,
        };
      }

      groups[area].complaints++;

      if (
        complaint.classification.urgency === "CRITICAL"
      ) {
        groups[area].critical++;
      }

      if (
        complaint.duplicate_info.is_duplicate
      ) {
        groups[area].duplicates++;
      }

      /*
       * Use the most severe urgency found
       * in the area.
       */

      const severityRank: Record<string, number> = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
        CRITICAL: 4,
      };

      if (
        severityRank[
          complaint.classification.urgency
        ] >
        severityRank[groups[area].severity]
      ) {
        groups[area].severity =
          complaint.classification.urgency;
      }
    });

    return Object.values(groups)
      .sort(
        (a, b) =>
          b.complaints - a.complaints
      )
      .slice(0, 10);
  }, [complaints]);

  const criticalAreas = hotspots.filter(
    (h) => h.severity === "CRITICAL"
  ).length;

  const hotspotComplaints = hotspots.reduce(
    (sum, hotspot) =>
      sum + hotspot.complaints,
    0
  );

  const duplicateComplaints = hotspots.reduce(
    (sum, hotspot) =>
      sum + hotspot.duplicates,
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#303a55] border-t-[#6573ff]" />

          <p className="mt-4 text-sm text-[#929db6]">
            Loading hotspot data...
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Grievance Hotspots
        </h1>

        <div className="rounded-[6px] border border-[#e57979]/30 bg-[#e57979]/10 p-6">

          <p className="font-semibold text-[#e57979]">
            Backend connection failed
          </p>

          <p className="mt-2 text-sm text-[#929db6]">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Grievance Hotspots
        </h1>

        <p className="mt-2 text-sm text-[#929db6]">
          Identify geographical areas with high concentrations of citizen complaints.
        </p>

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Active Hotspots
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            {hotspots.length}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            High complaint density
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Critical Areas
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            {criticalAreas}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Require immediate attention
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Complaints in Hotspots
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#f1f3f8]">
            {hotspotComplaints}
          </h2>

          <p className="mt-1 text-xs text-[#6fcdb5]">
            Based on backend location data
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Duplicate Complaints
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6573ff]">
            {duplicateComplaints}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Grouped by AI
          </p>

        </div>

      </div>


      {/* LOCATION VIEW */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              Geographical Complaint View
            </h2>

            <p className="mt-1 text-xs text-[#929db6]">
              Locations received from the grievance backend
            </p>

          </div>

          <span className="rounded-[4px] bg-[#6573ff]/10 px-3 py-2 text-xs text-[#6573ff]">
            GIS DATA
          </span>

        </div>


        {/* COORDINATE VISUALIZATION */}

        <div className="relative mt-5 min-h-[400px] overflow-hidden rounded-[4px] border border-[#303a55] bg-[#151c30]">

          <div className="absolute inset-0 opacity-20">

            <div className="grid h-full w-full grid-cols-8 grid-rows-6">

              {Array.from({
                length: 48,
              }).map((_, index) => (

                <div
                  key={index}
                  className="border border-[#6573ff]/20"
                />

              ))}

            </div>

          </div>


          {hotspots.map((hotspot, index) => {

            const left =
              10 + (index % 5) * 18;

            const top =
              18 +
              Math.floor(index / 5) * 35;

            const size =
              Math.min(
                64,
                30 +
                  hotspot.complaints * 2
              );

            const severityClass =
              hotspot.severity ===
              "CRITICAL"
                ? "bg-[#e57979]"
                : hotspot.severity ===
                  "HIGH"
                ? "bg-[#e5b45e]"
                : hotspot.severity ===
                  "MEDIUM"
                ? "bg-[#6573ff]"
                : "bg-[#6fcdb5]";

            return (

              <div
                key={hotspot.area}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                title={`${hotspot.area}: ${hotspot.complaints} complaints`}
              >

                <div
                  className="flex items-center justify-center rounded-full bg-[#6573ff]/10"
                  style={{
                    width: `${size + 20}px`,
                    height: `${size + 20}px`,
                  }}
                >

                  <div
                    className={`flex items-center justify-center rounded-full ${severityClass} text-[9px] font-bold text-white`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                    }}
                  >
                    {hotspot.complaints}
                  </div>

                </div>

                <span className="mt-1 max-w-[100px] text-center text-[10px] font-semibold text-[#f1f3f8]">
                  {hotspot.area}
                </span>

                <span className="text-[8px] text-[#66718a]">
                  {hotspot.lat.toFixed(4)},{" "}
                  {hotspot.lng.toFixed(4)}
                </span>

              </div>

            );
          })}


          {/* LEGEND */}

          <div className="absolute bottom-4 left-4 rounded-[4px] border border-[#303a55] bg-[#1b233a]/95 p-3">

            <p className="mb-2 text-[10px] font-semibold text-[#f1f3f8]">
              Complaint Severity
            </p>

            <div className="flex flex-wrap gap-4 text-[9px]">

              <span className="text-[#e57979]">
                ● Critical
              </span>

              <span className="text-[#e5b45e]">
                ● High
              </span>

              <span className="text-[#6573ff]">
                ● Medium
              </span>

              <span className="text-[#6fcdb5]">
                ● Low
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* CHART */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Complaints by Area
        </h2>

        <p className="mt-1 text-xs text-[#929db6]">
          Areas ranked by number of citizen complaints
        </p>

        <div className="mt-6 h-[300px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={hotspots}
              layout="vertical"
            >

              <CartesianGrid
                stroke="#303a55"
                horizontal={false}
              />

              <XAxis
                type="number"
                stroke="#929db6"
              />

              <YAxis
                type="category"
                dataKey="area"
                width={120}
                stroke="#929db6"
                tick={{
                  fill: "#c4cada",
                  fontSize: 10,
                }}
              />

              <Tooltip />

              <Bar
                dataKey="complaints"
                fill="#6573ff"
                radius={[
                  0,
                  3,
                  3,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* DETAILS */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Hotspot Details
        </h2>

        <p className="mt-1 text-xs text-[#929db6]">
          Location-based grievance concentration
        </p>

        <div className="mt-5 overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="bg-[#1b233a]">

              <tr>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Area
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Main Issue
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Complaints
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Critical
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Duplicates
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Coordinates
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Severity
                </th>

              </tr>

            </thead>

            <tbody>

              {hotspots.map((hotspot) => (

                <tr
                  key={hotspot.area}
                  className="border-t border-[#303a55] hover:bg-[#29334f]"
                >

                  <td className="px-4 py-4 text-sm font-semibold text-[#f1f3f8]">
                    📍 {hotspot.area}
                  </td>

                  <td className="px-4 py-4 text-xs text-[#c4cada]">
                    {hotspot.issue}
                  </td>

                  <td className="px-4 py-4 text-sm font-bold text-[#f1f3f8]">
                    {hotspot.complaints}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#e57979]">
                    {hotspot.critical}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#6573ff]">
                    {hotspot.duplicates}
                  </td>

                  <td className="px-4 py-4 font-mono text-[10px] text-[#929db6]">
                    {hotspot.lat.toFixed(4)},
                    {" "}
                    {hotspot.lng.toFixed(4)}
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`rounded-[4px] px-2 py-1 text-[10px] font-bold ${
                        hotspot.severity ===
                        "CRITICAL"
                          ? "bg-[#e57979]/10 text-[#e57979]"
                          : hotspot.severity ===
                            "HIGH"
                          ? "bg-[#e5b45e]/10 text-[#e5b45e]"
                          : hotspot.severity ===
                            "MEDIUM"
                          ? "bg-[#6573ff]/10 text-[#6573ff]"
                          : "bg-[#6fcdb5]/10 text-[#6fcdb5]"
                      }`}
                    >
                      {hotspot.severity}
                    </span>

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