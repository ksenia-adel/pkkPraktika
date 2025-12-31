import React from "react";

// Icons
import Customers from "@mui/icons-material/GroupsOutlined";
import Procedures from "@mui/icons-material/BiotechOutlined";
import Methods from "@mui/icons-material/AccountTreeOutlined";
import Samples from "@mui/icons-material/ScienceOutlined";
import Measurements from "@mui/icons-material/ScaleOutlined";
import Users from "@mui/icons-material/AccountCircleOutlined";
import Roles from "@mui/icons-material/ManageAccountsOutlined";

export const SidebarData = [
  {
    group: "Raportid",
    objects: [
      { title: "Kliendid", icon: <Customers />, link: "/backend/customers" },
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
  {
    group: "Kasutajad",
    objects: [
      { title: "Töötajad", icon: <Users />, link: "/backend/users" },
      { title: "Rollid", icon: <Roles />, link: "/backend/roles" },
      { title: "Minu kasutaja", icon: <Roles />, link: "/backend/settings" },
    ],
  },
];
