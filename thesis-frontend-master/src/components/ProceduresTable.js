import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";

// Hooks

// Icons
import NewObject from "@mui/icons-material/PostAddOutlined";
import EditButton from "@mui/icons-material/BorderColorOutlined";
import ArchiveButton from "@mui/icons-material/ArchiveOutlined";
import SaveButton from "@mui/icons-material/CheckOutlined";
import RevertChanges from "@mui/icons-material/ClearOutlined";
import ExpandArrow from "@mui/icons-material/KeyboardArrowRightOutlined";
import ShrinkRow from "@mui/icons-material/KeyboardArrowDownOutlined";

// Tables
import "./BackendTable.css";
import AccordionModal from "./AccordionModal";

function ProceduresTable({ data, columns }) {
  const [message, setMessage] = useState();
  const [editing, setEditing] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [activeId, setActiveId] = useState(-1);
  const [expandedRow, setExpandedRow] = useState(false);
  const [activeRow, setActiveRow] = useState({});
  const [accordionModalOpen, setAccordionModalOpen] = useState(false);
  const [accordionType, setAccordionType] = useState("");

  const loc = useLocation();

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      setEditing(false);
      setInserting(false);
    }
  };

  const handleKeydown = (e) => {
    return handleEscape && handleEscape(e);
  };

  const updateData = async () => {
    try {
      const result = await axios.put(`/api${loc.pathname}/${activeRow.id}`, {
        withCredentials: true,
        data: activeRow,
      });

      if (result.status === 200) setMessage("Andmed edukalt uuendatud");
    } catch (err) {
      console.log(err.response);
    }
  };

  const deleteObject = (id) => {
    //console.log(`Deleted row ${id + 1}`);

    // Change currently edited row archived value to true
    setActiveRow((data) => ({ ...data, archived: true }));
  };

  const startInserting = (bool) => {
    setInserting(bool);
    setActiveRow({});
  };

  const startEditing = (id) => {
    console.log(`Started editing row ${id + 1}`);

    // Change editing state to true
    setEditing(true);
    setActiveId(id);

    // Hold the currently edited row data in state
    setActiveRow(data[id]);
  };

  const handleUpdate = (id) => {
    console.log(`Updated row ${id + 1}`);

    // Update data in database
    updateData();

    // Change editing state to false after updating
    setEditing(false);
    setActiveId(-1);
    setActiveRow({});

    // Refresh page
    window.location.reload(false);
  };

  const handleInsert = () => {
    insertData();
    setInserting(false);
    setActiveRow({});

    window.location.reload(false);
  };

  const insertData = async () => {
    console.log(activeRow);
    try {
      await axios.post(`/api${loc.pathname}`, {
        withCredentials: true,
        data: activeRow,
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "accredited") {
      if (e.target.value === "Jah") {
        setActiveRow((prev) => ({
          ...prev,
          [e.target.id]: "Ei",
        }));
      } else {
        setActiveRow((prev) => ({
          ...prev,
          accredited: "Jah",
        }));
      }
    } else {
      e.preventDefault();
      setActiveRow((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
    console.log(activeRow);
  };

  const renderButtons = (i) => {
    if (!editing && !inserting) {
      return (
        <div className="backendTable__buttonsContainer">
          <EditButton
            className="backendTable__button"
            onClick={(e) => startEditing(i)}
            titleAccess="Muuda"
          />
        </div>
      );
    } else if (editing && activeId === i && !inserting) {
      return (
        <div className="backendTable__buttonsContainer">
          <SaveButton
            className="backendTable__button"
            onClick={() => handleUpdate(i)}
            titleAcces="Salvesta"
          />
          <RevertChanges
            className="backendTable__button"
            onClick={() => setEditing(false)}
            titleAccess="Tagasi"
          />
          <ArchiveButton
            className="backendTable__button"
            onClick={() => deleteObject(i)}
            titleAccess="Arhiveeri"
          />
        </div>
      );
    } else if (i === undefined) {
      return (
        <div className="backendTable__buttonsContainer">
          <SaveButton
            className="backendTable__button"
            onClick={() => handleInsert()}
            titleAccess="Salvesta"
          />
          <RevertChanges
            className="backendTable__button"
            onClick={() => setInserting(false)}
            titleAccess="Tagasi"
          />
        </div>
      );
    }
  };

  useEffect(() => {
    setEditing(false);
    setInserting(false);
    setExpandedRow(false);
  }, [loc.pathname]);

  const handleRowExpansion = (i, boolean) => {
    setActiveId(i);
    setExpandedRow(boolean);
  };

  const handleModalOpen = (path, id) => {
    setActiveId(id);
    setAccordionType(path);
    setAccordionModalOpen(true);
  };

  const handleModalClose = () => {
    setAccordionModalOpen(false);
    setAccordionType("");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div className="backendTable__container">
      <div className="backendTable__message">
        <h2>{message}</h2>
      </div>

      {accordionModalOpen && (
        <AccordionModal
          open={accordionModalOpen}
          onClose={() => handleModalClose()}
          name={data[activeId].name_est}
          path={accordionType}
          id={data[activeId].id}
        />
      )}

      <table className="backendTable">
        <thead className="backendTable__head">
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column.header}</th>
            ))}
            <th>
              {!editing && !inserting && (
                <NewObject
                  className="backendTable__button"
                  onClick={() => startInserting(true)}
                  titleAccess="Andmete lisamine"
                />
              )}
            </th>
          </tr>
        </thead>
        <tbody className="backendTable__body">
          {inserting && (
            <tr>
              {columns.map((column, _i) => (
                <td key={_i}>
                  {column.field !== "id" &&
                    (column.field === "accredited" ? (
                      <input
                        key={_i}
                        id={column.field}
                        value={activeRow[column.field] === "Jah" ? "Jah" : "Ei"}
                        onChange={(e) => handleChange(e)}
                        type="checkbox"
                        checked={activeRow[column.field] === "Jah"}
                      />
                    ) : (
                      <input
                        key={_i}
                        id={column.field}
                        value={activeRow[column.field]}
                        onChange={(e) => handleChange(e)}
                      />
                    ))}
                </td>
              ))}
              <td>{renderButtons(undefined)}</td>
            </tr>
          )}

          {data.map((row, i) => (
            <>
              <tr key={i} id={expandedRow && activeId === i && "expandedRow"}>
                {columns.map((column, _i) => (
                  <td key={_i}>
                    {editing && activeId === i && column.field !== "id" ? (
                      column.field === "accredited" ? (
                        <input
                          key={_i}
                          id={column.field}
                          value={
                            activeRow[column.field] === "Jah" ? "Jah" : "Ei"
                          }
                          onChange={(e) => handleChange(e)}
                          type="checkbox"
                          checked={activeRow[column.field] === "Jah"}
                        />
                      ) : (
                        <input
                          key={i}
                          id={column.field}
                          value={activeRow[column.field]}
                          onChange={(e) => handleChange(e)}
                        />
                      )
                    ) : column.field === "id" ? (
                      <div class="backendTable__idColumn">
                        {expandedRow && activeId === i ? (
                          <ShrinkRow
                            onClick={() => handleRowExpansion(-1, false)}
                            className="backendTable__button"
                            titleAccess="Sulge sätted"
                          />
                        ) : (
                          <ExpandArrow
                            onClick={() => handleRowExpansion(i, true)}
                            className="backendTable__button"
                            titleAccess="Ava sätted"
                          />
                        )}

                        {row[column.field]}
                      </div>
                    ) : (
                      row[column.field]
                    )}
                  </td>
                ))}
                <td>{renderButtons(i)}</td>
              </tr>
              {expandedRow && activeId === i && (
                <div className="backendTable__accordion">
                  <tr>
                    <td className="backendTable__accordionButtons">
                      <button>
                        {accordionType === "" ||
                        accordionType === "procedureSamples" ? (
                          <ExpandArrow
                            className="backendTable__button"
                            onClick={() =>
                              handleModalOpen("procedureMethods", i)
                            }
                            titleAccess="Ava meetodite tabel"
                          />
                        ) : (
                          <ShrinkRow className="backendTable__button" />
                        )}
                        Meetodid
                      </button>
                      <button>
                        {accordionType === "" ||
                        accordionType === "procedureMethods" ? (
                          <ExpandArrow
                            className="backendTable__button"
                            onClick={() =>
                              handleModalOpen("procedureSamples", i)
                            }
                            titleAccess="Ava proovide tabel"
                          />
                        ) : (
                          <ShrinkRow className="backendTable__button" />
                        )}
                        Proovid
                      </button>
                    </td>
                  </tr>
                </div>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProceduresTable;
