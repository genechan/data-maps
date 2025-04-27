"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { systemsData } from "@/data/systemData";
import { System } from "@/types";
import {
  getUniqueCategories,
  getUniqueDataUses,
  filterSystemsByCategory,
  groupBySystemType,
  groupByDataUse,
} from "@/utils";

const Home: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<
    "system_type" | (typeof uniqueDataUses)[number]
  >("system_type");

  // Extract unique data categories and system types
  const uniqueCategories = getUniqueCategories(systemsData);
  // Extract unique data uses from the systems data
  const uniqueDataUses = getUniqueDataUses(systemsData);

  // Filter systems based on the selected category
  const filteredSystems = filterCategory
    ? filterSystemsByCategory(systemsData, filterCategory)
    : systemsData;

  // Group systems by the selected grouping criteria
  const groupedSystems = filteredSystems.reduce((acc, system) => {
    if (groupBy === "system_type") {
      return groupBySystemType(system, acc);
    }
    if (groupBy.startsWith("data_use")) {
      const dataUseKey = groupBy.split(".")[1];
      return groupByDataUse(system, acc, dataUseKey);
    }
    return acc;
  }, {} as Record<string, System[]>);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Interactive Data Map</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Filter</span>
          <select
            className="border p-2 rounded"
            onChange={(e) => setFilterCategory(e.target.value || null)}
          >
            <option value="">Filter by Data Category</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Group By</span>
          <select
            className="border p-2 rounded"
            onChange={(e) => {
              const value = e.target.value as
                | "system_type"
                | (typeof uniqueDataUses)[number];
              setGroupBy(value);
            }}
          >
            <option value="system_type">Group by System Type</option>
            {uniqueDataUses.map((dataUse, index) => (
              <option key={index} value={`data_use.${dataUse}`}>
                Group by Data use, {dataUse}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Render Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(groupedSystems).map(([group, systems]) => (
          <div key={group} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{group}</h2>
            {systems.map((system, index) => (
              <motion.div
                key={`${system.fides_key}-${index}`}
                className="border p-4 rounded mb-4 bg-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-bold">{system.name}</h3>
                <p className="text-sm text-gray-600">{system.description}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-500">
                    Privacy Declarations
                  </summary>
                  <ul className="list-disc ml-4">
                    {system.privacy_declarations.map((declaration, index) => (
                      <li key={index}>
                        <strong>{declaration.name}:</strong>{" "}
                        {declaration.data_categories
                          .map((category) => category.split(".").pop())
                          .join(", ")}
                      </li>
                    ))}
                  </ul>
                </details>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
