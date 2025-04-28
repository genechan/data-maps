"use client";
import {
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Fade,
  Divider,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { System } from "@/types";

type SystemCardProp = {
  system: System;
  index: number;
};
const SystemCard: React.FC<SystemCardProp> = ({ system, index }) => {
  return (
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
          <Typography variant="h6" component="h3" fontWeight="bold">
            {system.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
                {system.privacy_declarations.map((declaration, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem disablePadding sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>{declaration.name}:</strong>{" "}
                            {declaration.data_categories
                              .map((category) => category.split(".").pop())
                              .join(", ")}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default SystemCard;
