"use client";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
type FilterDropDownProps = {
  filterCategory: string | null;
  handleFilterChange: (event: SelectChangeEvent<string>) => void;
  uniqueCategories: string[];
};

const FilterDropDown: React.FC<FilterDropDownProps> = ({
  filterCategory,
  handleFilterChange,
  uniqueCategories,
}) => {
  return (
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
  );
};

export default FilterDropDown;
