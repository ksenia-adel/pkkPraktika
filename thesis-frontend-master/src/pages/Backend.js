// Libraries
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios, { axiosPrivate } from "../api/axios";

// Hooks

// Components
import Sidebar from "../components/Sidebar";
import { SidebarData } from "../components/SidebarData";
import BackendTable from "../components/BackendTable";
import ProceduresTable from "../components/ProceduresTable";
import Settings from "./Settings";

// Styles
import "./Common.css";

function Backend() {
  const loc = useLocation();
  const locationEndpointMap = [
    {
      location: "/backend",
      endpoint: "",
      columns: [],
    },
    {
      location: "/backend/customers",
      endpoint: "customers",
      columns: [
        { field: "id", header: "Kliendi id" },
        { field: "company_name", header: "ettevõtte nimi" },
        { field: "company_registration_code", header: "registrikood" },
        { field: "company_address", header: "aadress" },
        { field: "customer_contact_person", header: "kontaktisik" },
        { field: "customer_email", header: "e-post" },
        { field: "customer_phone", header: "telefon" },
      ],
    },
    {
      location: "/backend/procedures",
      endpoint: "procedures",
      columns: [
        { field: "id", header: "Protseduuri id" },
        { field: "name_est", header: "Nimetus eesti keeles" },
        { field: "name_eng", header: "Nimetus inglise keeles" },
      ],
    },
    {
      location: "/backend/methods",
      endpoint: "methods",
      columns: [
        { field: "id", header: "Meetodi id" },
        { field: "name", header: "Nimetus" },
        { field: "accredited", header: "Akrediteeritud" },
      ],
    },
    {
      location: "/backend/samples",
      endpoint: "samples",
      columns: [
        { field: "id", header: "Proovi id" },
        { field: "name_est", header: "Nimetus eesti keeles" },
        { field: "name_eng", header: "Nimetus inglise keeles" },
      ],
    },
    {
      location: "/backend/measurements",
      endpoint: "measurements",
      columns: [
        { field: "id", header: "Mõõtühiku id" },
        { field: "unit", header: "Mõõtühik" },
      ],
    },
    {
      location: "/backend/users",
      endpoint: "users",
      columns: [
        { field: "id", header: "Kasutaja id" },
        { field: "username", header: "Kasutajanimi" },
        { field: "firstname", header: "Eesnimi" },
        { field: "lastname", header: "Perekonnanimi" },
        { field: "email", header: "E-post" },
        { field: "profession", header: "Ametikoht" },
        { field: "role_name", header: "Rolli nimetus" },
        { field: "address", header: "Aadress" },
      ],
    },
    {
      location: "/backend/roles",
      endpoint: "roles",
      columns: [
        { field: "id", header: "Rolli id" },
        { field: "name", header: "Rolli nimetus" },
        { field: "comment", header: "Märkmed" },
      ],
    },
  ];

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  // Run this useEffect every time when page path changes
  useEffect(() => {
    // Check if the user is admin, if not, redirect to home page (reports view)
    //if (user.is_admin === false) {navigate("/home");}

    if (loc.pathname !== "/backend/settings") {
      const fetchData = async () => {
        // Fetch data
        try {
          const result = await axios.get(`api${loc.pathname}`, {
            withCredentials: true,
          });
          setData(result.data);

          // Change the columns
          setColumns(
            locationEndpointMap.filter((i) => i.location === loc.pathname)[0]
              ?.columns
          );
        } catch (err) {
          console.log(err.response);
        }
      };
      // Fetch data
      fetchData();
    } else {
      setData([]);
      setColumns({});
    }
  }, [loc.pathname]);

  function renderContent() {
    if (columns?.length > 0) {
      if (loc.pathname === "/backend/procedures") {
        return <ProceduresTable data={data} columns={columns} />;
      } else {
        return <BackendTable data={data} columns={columns} />;
      }
    } else if (loc.pathname === "/backend/settings") {
      return <Settings />;
    } else {
      return <h2>Andmeid ei leitud!</h2>;
    }
  }

  return (
    <div className="backend">
      <div className="backend__sidebar">
        <Sidebar sidebarData={SidebarData} />
      </div>
      <div className="backend__content">{renderContent()}</div>
    </div>
  );
}

export default Backend;
