import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios, { axiosPrivate } from "../api/axios";

// Hooks
import { AuthContext } from "../context/Authentication";

// Icons
import NewObject from "@mui/icons-material/PostAddOutlined";
import EditButton from "@mui/icons-material/BorderColorOutlined";
import ArchiveButton from "@mui/icons-material/ArchiveOutlined";
import SaveButton from "@mui/icons-material/CheckOutlined";
import RevertChanges from "@mui/icons-material/ClearOutlined";

// Tables
import "./BackendTable.css";

function BackendTable({ data, columns }) {
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      setEditing(false);
      setInserting(false);
    }
  };

  const handleKeydown = (e) => {
    return handleEscape && handleEscape(e);
  };

  const { user } = useContext(AuthContext);

  const { message, setMessage } = useState();
  const [editing, setEditing] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [activeId, setActiveId] = useState(-1);

  const [roles, setRoles] = useState([]);

  const [activeRow, setActiveRow] = useState({});
  const loc = useLocation();

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
    // Change editing state to true
    setEditing(true);
    setActiveId(id);

    // Hold the currently edited row data in state
    setActiveRow(data[id]);
  };

  const handleUpdate = (id) => {
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
    } else if (e.target.id === "role_name") {
      setActiveRow((prev) => ({
        ...prev,
        role_id:
          roles?.filter((role) => role.name === e.target.value)[0]?.id ||
          undefined,
      }));

      setActiveRow((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));

      setActiveRow((prev) => ({
        ...prev,
        role_grantor_user_id: user.user_id,
      }));
    } else {
      e.preventDefault();
      setActiveRow((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const renderButtons = (i) => {
    if (!editing && !inserting) {
      /*-- IF NOT IN EDIT MODE NOR INSERT MODE, RENDER ONLY EDIT BUTTON --*/
      return (
        <div className="backendTable__buttonsContainer">
          <EditButton
            className="backendTable__button"
            onClick={(e) => startEditing(i)}
            data-tooltip="test"
            titleAccess="Muuda"
          />
        </div>
      );
    } else if (editing && activeId === i && !inserting) {
      /*-- IF EDIT MODE AND NOT INSERT MODE AND ROW ID === CURRENTLY SELECTED ROW, RENDER SAVE/REVERT/ARCHIVE BUTTONS --*/
      return (
        <span className="backendTable__buttonsContainer">
          <SaveButton
            className="backendTable__button"
            onClick={() => handleUpdate(i)}
            titleAccess="Salvesta"
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
        </span>
      );
    } else if (i === undefined) {
      /*-- IF INSERT MODE, RENDER SAVE AND REVERT(DISCARD) BUTTONS --*/
      return (
        <span className="backendTable__buttonsContainer">
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
        </span>
      );
    }
  };

  useEffect(() => {
    setEditing(false);
    setInserting(false);

    const fetchRoles = async () => {
      try {
        const result = await axiosPrivate.get("api/backend/roles");
        setRoles(result.data);
      } catch (err) {
        console.log(err.response);
      }
    };

    if (loc.pathname === "/backend/users") {
      fetchRoles();
    }
  }, [loc.pathname]);

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

      {/*---------- TABLE START ----------*/}
      <table className="backendTable">
        {/*-- HEADER --*/}
        <thead className="backendTable__head">
          <tr>
            {/*-- MAP THROUGH EVERY COLUMN HEADER --*/}
            {columns.map((column, i) => (
              <th key={i}>{column.header}</th>
            ))}
            <th>
              {/*-- IF NOT IN EDIT NOR INSERT MODE: SHOW NEW OBJECT BUTTON --*/}
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

        {/*-- BODY --*/}
        <tbody className="backendTable__body">
          {/*-- IF INSERT MODE, ADD NEW LINE ON TOP OF ALL DATA FOR USER EASY ACCESS --*/}
          {inserting && (
            <tr>
              {/*-- RENDER INPUT FIELD FOR EVERY ATRIBUTE --*/}
              {columns.map((column, _i) => (
                <td key={_i}>
                  {/*-- USER CAN'T ADD ID FIELD --*/}
                  {column.field !== "id" &&
                    (column.field === "accredited" ? (
                      /*-- CHECKBOX INPUT FIELD FOR BOOLEAN VALUE--*/
                      <input
                        key={_i}
                        id={column.field}
                        value={activeRow[column.field] === "Jah" ? "Jah" : "Ei"}
                        onChange={(e) => handleChange(e)}
                        type="checkbox"
                        checked={activeRow[column.field] === "Jah"}
                        autoComplete="off"
                      />
                    ) : column.field === "role_name" ? (
                      /*-- INPUT FIELD FOR ROLE VALUE--*/
                      <>
                        <input
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          id="role_name"
                          list="rolesList"
                          value={activeRow[column.field]}
                          autoComplete="off"
                          required
                        />
                        <datalist id="rolesList">
                          {roles?.map((role, __i) => (
                            <option key={__i} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </datalist>
                      </>
                    ) : (
                      /*-- INPUT FIELD OTHER ATTRIBUTES --*/
                      <input
                        key={_i}
                        id={column.field}
                        value={activeRow[column.field]}
                        onChange={(e) => handleChange(e)}
                        autoComplete="off"
                      />
                    ))}
                </td>
              ))}
              {/*-- RENDER BUTTONS IN THE LAST CELL OF A ROW BASED ON STATE --*/}
              <td>{renderButtons(undefined)}</td>
            </tr>
          )}

          {/*-- EXISTING DATA, MAP THROUGH EVERY ROW --*/}
          {data.map((row, i) => (
            <>
              <tr key={i}>
                {/*-- MAP THROUGH EVERY COLUMN --*/}
                {columns.map((column, _i) => (
                  <td key={_i}>
                    {/*-- IF EDIT MODE, PREFILL INPUT FIELDS FOR USER --*/}
                    {editing && activeId === i && column.field !== "id" ? (
                      column.field === "accredited" ? (
                        /*-- CHECKBOX INPUT FIELD FOR BOOLEAN VALUE--*/
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
                      ) : column.field === "role_name" ? (
                        /*-- INPUT FIELD FOR ROLE VALUE--*/
                        <>
                          <input
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            id="role_name"
                            list="rolesList"
                            value={activeRow[column.field]}
                            autoComplete="off"
                            required
                          />
                          <datalist id="rolesList">
                            {roles?.map((role, __i) => (
                              <option key={__i} value={role.name}>
                                {role.name}
                              </option>
                            ))}
                          </datalist>
                        </>
                      ) : (
                        /*-- INPUT FIELD OTHER ATTRIBUTES --*/
                        <input
                          key={_i}
                          id={column.field}
                          value={activeRow[column.field]}
                          onChange={(e) => handleChange(e)}
                          autoComplete="off"
                        />
                      )
                    ) : (
                      /*-- IF ROW IS NOT CURRENTLY IN EDIT MODE, SHOW DATA IN ORDINARY FORM --*/
                      row[column.field]
                    )}
                  </td>
                ))}

                {/*-- RENDER BUTTONS IN THE LAST CELL OF A ROW BASED ON STATE --*/}
                <td>{renderButtons(i)}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BackendTable;
