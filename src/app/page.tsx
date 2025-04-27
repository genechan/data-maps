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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Fade,
  Divider,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filter-category-label" shrink={true}>
            Filter by Data Category
          </InputLabel>
          <Select
            labelId="filter-category-label"
            value={filterCategory || ""}
            label="Filter by Data Category"
            onChange={handleFilterChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {uniqueCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="group-by-label">Group By</InputLabel>
          <Select
            labelId="group-by-label"
            value={groupBy}
            label="Group By"
            onChange={handleGroupByChange}
          >
            <MenuItem value="system_type">System Type</MenuItem>
            {uniqueDataUses.map((dataUse, index) => (
              <MenuItem key={index} value={`data_use.${dataUse}`}>
                Data use: {dataUse}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                    <Fade
                      in={true}
                      key={`${system.fides_key}-${index}`}
                      timeout={500}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          mb: 2,
                          bgcolor: "grey.50",
                          "&:last-child": { mb: 0 },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            component="h3"
                            fontWeight="bold"
                          >
                            {system.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {system.description}
                          </Typography>

                          <Accordion
                            sx={{
                              mt: 2,
                              boxShadow: "none",
                              "&:before": { display: "none" },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                p: 0,
                                color: "primary.main",
                                "& .MuiAccordionSummary-content": { m: 0 },
                              }}
                            >
                              <Typography>Privacy Declarations</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0, pt: 1 }}>
                              <List disablePadding>
                                {system.privacy_declarations.map(
                                  (declaration, index) => (
                                    <React.Fragment key={index}>
                                      {index > 0 && <Divider component="li" />}
                                      <ListItem disablePadding sx={{ py: 0.5 }}>
                                        <ListItemText
                                          primary={
                                            <Typography variant="body2">
                                              <strong>
                                                {declaration.name}:
                                              </strong>{" "}
                                              {declaration.data_categories
                                                .map((category) =>
                                                  category.split(".").pop()
                                                )
                                                .join(", ")}
                                            </Typography>
                                          }
                                        />
                                      </ListItem>
                                    </React.Fragment>
                                  )
                                )}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </Fade>
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
