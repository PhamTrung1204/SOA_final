import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Paper,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DiscountSection = ({ totalAmount, setDiscountValue }) => {
  const [discountCode, setDiscountCode] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const discountOptions = [
    {
      code: "DAILY100",
      description: "Giảm 100.000đ - Đơn hàng từ 3000K",
      minOrder: 3000000,
      value: 100000,
      hsd: "Thứ 5, 23:59 31/10/2024",
    },
    {
      code: "DAILY50",
      description: "Giảm 50.000đ - Đơn hàng từ 1000K",
      minOrder: 1000000,
      value: 50000,
      hsd: "Thứ 5, 23:59 31/10/2024",
    },
  ];

  const handleApplyDiscount = (code) => {
    const selected = discountOptions.find((option) => option.code === code);
    if (selected && totalAmount >= selected.minOrder) {
      setDiscountValue(selected.value);
      setDiscountCode(code);
      setSelectedDiscount(selected);
    } else {
      setDiscountValue(0);
      alert("Không đủ điều kiện để sử dụng mã giảm giá này!");
    }
  };

  return (
    <Box>
      {/* Dropdown Menu */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Sử dụng mã giảm giá</Typography>
        </AccordionSummary>
        <TextField
          label="Mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          fullWidth
          margin="normal"
          enabled
        />
        <AccordionDetails>
          {discountOptions.map((option) => (
            <Card
              key={option.code}
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <CardContent>
                <Typography variant="body1">{option.description}</Typography>
                <Typography variant="body2">Mã: {option.code}</Typography>
                <Typography variant="body2">HSD: {option.hsd}</Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleApplyDiscount(option.code)}
                sx={{ alignSelf: "center", marginRight: 2 }}
              >
                Áp dụng
              </Button>
            </Card>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DiscountSection;
