import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const ProfileForm = () => {
  const [countryCode, setCountryCode] = useState("");

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <TextField
        label="First Name"
        fullWidth
        variant="outlined"
        defaultValue="Trung"
        sx={{
          mb: 2,
          "& .MuiInputBase-input": { color: "#000" },
          "& .MuiOutlinedInput-root fieldset": { borderColor: "#505050" },
        }}
        InputLabelProps={{ shrink: true, sx: { color: "#505050" } }}
      />
      <TextField
        label="Last Name"
        fullWidth
        variant="outlined"
        defaultValue="Phạm"
        sx={{
          mb: 2,
          "& .MuiInputBase-input": { color: "#000" },
          "& .MuiOutlinedInput-root fieldset": { borderColor: "#505050" },
        }}
        InputLabelProps={{ shrink: true, sx: { color: "#505050" } }}
      />
      <TextField
        label="Region/Country"
        fullWidth
        variant="outlined"
        defaultValue="Vietnam"
        sx={{
          mb: 2,
          "& .MuiInputBase-input": { color: "#000" },
          "& .MuiOutlinedInput-root fieldset": { borderColor: "#505050" },
        }}
        InputLabelProps={{ shrink: true, sx: { color: "#505050" } }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        variant="outlined"
        defaultValue="••••••••"
        sx={{
          mb: 2,
          "& .MuiInputBase-input": { color: "#000" },
          "& .MuiOutlinedInput-root fieldset": { borderColor: "#505050" },
        }}
        InputLabelProps={{ shrink: true, sx: { color: "#505050" } }}
      />
      <TextField
        label="Email"
        fullWidth
        variant="outlined"
        defaultValue="lcdangchet@gmail.com"
        sx={{
          mb: 2,
          "& .MuiInputBase-input": { color: "#000" },
          "& .MuiOutlinedInput-root fieldset": { borderColor: "#505050" },
        }}
        InputLabelProps={{ shrink: true, sx: { color: "#505050" } }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ color: "#000" }}>Country Code</InputLabel>
        <Select
          value={countryCode}
          label="Country Code"
          onChange={(e) => setCountryCode(e.target.value)}
          sx={{
            "& .MuiInputBase-input": { color: "#000" },
            "& .MuiOutlinedInput-root fieldset": { borderColor: "#505050" },
          }}
        >
          <MenuItem value={1}>+1</MenuItem>
          <MenuItem value={84}>+84</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Telephone Number"
        fullWidth
        variant="outlined"
        sx={{
          mb: 2,
          "& .MuiInputBase-input": { color: "#000" },
          "& .MuiOutlinedInput-root fieldset": { borderColor: "#505050" },
        }}
        InputLabelProps={{ shrink: true, sx: { color: "#505050" } }}
      />
      <Button
        sx={{
          backgroundColor: "#0672cb",
          color: "#fff",
          "&:hover": { backgroundColor: "#005a9c" },
        }}
      >
        Lưu
      </Button>
    </Box>
  );
};

export default ProfileForm;
