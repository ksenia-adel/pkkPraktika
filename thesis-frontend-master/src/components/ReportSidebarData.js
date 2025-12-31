import React from "react";

// Icons
import Procedures from "@mui/icons-material/BiotechOutlined";
import Methods from "@mui/icons-material/AccountTreeOutlined";
import Samples from "@mui/icons-material/ScienceOutlined";
import Measurements from "@mui/icons-material/ScaleOutlined";

export const ReportSidebarData = [
  {
    group: "Raportid",
    objects: [
      {
        title: "Protseduurid",
        icon: <Procedures />,
        link: "/backend/procedures",
      },
      { title: "Meetodid", icon: <Methods />, link: "/backend/methods" },
      { title: "Proovid", icon: <Samples />, link: "/backend/samples" },
      {
        title: "Mõõtühikud",
        icon: <Measurements />,
        link: "/backend/measurements",
      },
    ],
  },
];
