// Libraries
import React, { useState, useEffect } from "react";
import axios from "../api/axios";

// Components
import Table from "../components/Table";

// Styles
import "./Common.css";

const Home = () => {
  const [reports, setReports] = useState([]);
  const endpoint = "/report";
  const addButtonPath = "/report";

  const fetchReports = async () => {
    try {
      const result = await axios.get("/api/report", {
        withCredentials: true,
      });
      setReports(result.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  const headers = [
    { field: "id", header: "raporti id" },
    { field: "company_name", header: "ettevõtte nimi" },
    { field: "samples_received_date", header: "proovide saabumise kuupäev" },
    { field: "start_date", header: "alustamise kuupäev" },
    { field: "end_date", header: "lõpetamise kuupäev" },
  ];
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="home">
      {reports?.length ? (
        <Table
          data={reports}
          columns={headers}
          path={endpoint}
          addButtonPath={addButtonPath}
        />
      ) : (
        <p>No reports found</p>
      )}
    </div>
  );
};

export default Home;
