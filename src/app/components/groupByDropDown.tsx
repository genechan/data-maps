"use client";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

type GroupByDropDownProps = {
  groupBy: string;
  handleGroupByChange: (event: SelectChangeEvent<string>) => void;
  uniqueDataUses: string[];
};

const GroupByDropDown: React.FC<GroupByDropDownProps> = ({
  groupBy,
  handleGroupByChange,
  uniqueDataUses,
}) => {
  return (
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
  );
};

export default GroupByDropDown;
