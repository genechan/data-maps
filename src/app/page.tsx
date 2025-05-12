"use client";

import React, { useState } from "react";
import { systemsData } from "@/data/systemData";
import { System } from "@/types";
import {
  getUniqueCategories,
  getUniqueDataUses,
  filterSystemsByCategory,
  groupBySystemType,
  groupByDataUse,
} from "@/utils";

// Material UI imports
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  SelectChangeEvent,
  Grid,
} from "@mui/material";

import { FilterDropDown, GroupByDropDown, SystemCard } from "@/app/components";

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

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value || null);
  };

  const handleGroupByChange = (event: SelectChangeEvent) => {
    const value = event.target.value as
      | "system_type"
      | (typeof uniqueDataUses)[number];
    setGroupBy(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Interactive Data Map
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <FilterDropDown
          filterCategory={filterCategory}
          handleFilterChange={handleFilterChange}
          uniqueCategories={uniqueCategories}
        />
        <GroupByDropDown
          groupBy={groupBy}
          handleGroupByChange={handleGroupByChange}
          uniqueDataUses={uniqueDataUses}
        />
      </Box>

      {/* Render Systems */}
      <Grid container spacing={3}>
        {Object.entries(groupedSystems).map(([group, systems]) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={group}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  fontWeight="medium"
                >
                  {group}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {systems.map((system, index) => (
                    <SystemCard
                      system={system}
                      index={index}
                      key={`${system.fides_key}-${index}`}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
