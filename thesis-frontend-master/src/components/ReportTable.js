import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useFetch from "../hooks/useFetch";

// Components
import ReportPreviewModal from "../components/ReportPreviewModal";

// Hooks
import { AuthContext } from "../context/Authentication";

// Icons
import NewObject from "@mui/icons-material/PostAddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteButton from "@mui/icons-material/DeleteForever";
import SaveButton from "@mui/icons-material/CheckOutlined";
import EditButton from "@mui/icons-material/BorderColorOutlined";

// Styles
import "./Table.css";
import "./ReportTable.css";

function ReportTable({ id, reportData }) {
  const { user } = useContext(AuthContext);

  const [insertMode, setInsertMode] = useState(false);
  const [refetch, setRefetch] = useState(true);

  const [procedureId, setProcedureId] = useState(null);
  const [newProcedure, setNewProcedure] = useState("");

  const [newMethodId, setNewMethodId] = useState(null);
  const [newMethod, setNewMethod] = useState("");

  const [newSampleId, setNewSampleId] = useState(null);
  const [newSample, setNewSample] = useState("");

  const [newMeasurementId, setNewMeasurementId] = useState(null);
  const [newMeasurement, setNewMeasurement] = useState("");

  const [insertingValue, setInsertingValue] = useState(-1);

  const [modalOpen, setModalOpen] = useState(false);

  // Report procedures
  const { data: reportProcedures } = useFetch(
    "/api/report/reportProcedures",
    id,
    refetch
  );
  const procedureDataColumns = [
    { field: "id", header: "Id" },
    { field: "procedure_name_est", header: "Protseduur" },
    { field: "method_name", header: "Meetod" },
    { field: "accredited", header: "Akrediteeritud" },
    { field: "sample_name_est", header: "Proov" },
    { field: "value", header: "Tulemus" },
    { field: "unit", header: "Mõõtühik" },
  ];

  const [measurementValue, setMeasurementValue] = useState("");

  // Load procedures, samples, methods and measurements
  const { data: procedures } = useFetch("/api/backend/procedures", -1, refetch);
  const { data: methods } = useFetch(
    "/api/backend/procedureMethods",
    procedureId,
    refetch
  );
  const { data: samples } = useFetch(
    "/api/backend/procedureSamples",
    procedureId,
    refetch
  );
  const { data: measurements } = useFetch(
    "/api/backend/measurements",
    -1,
    refetch
  );

  const handleInsert = async () => {
    try {
      await axiosPrivate.post("/api/report/reportProcedures", {
        data: { id, procedureId, newMethodId, newSampleId, newMeasurementId },
      });
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Load methods and samples after
  const handleProcedureUpdate = (e) => {
    setNewProcedure(e.target.value);
    setProcedureId(
      procedures.filter((procedure) => procedure.name_est === e.target.value)[0]
        ?.id
    );
    setRefetch(true);
  };

  useEffect(() => {
    setRefetch(false);
  }, [insertMode]);

  useEffect(() => {
    setNewMethodId(null);
    setNewMethod("");

    setNewSampleId(null);
    setNewSample("");

    setNewMeasurementId(null);
    setNewMeasurement("");
  }, [newProcedure]);

  const handleMethodUpdate = (newValue) => {
    setNewMethod(newValue);
    setNewMethodId(
      methods.filter((method) => method.name === newValue)[0]?.method_id || null
    );
  };

  const handleSampleUpdate = (newValue) => {
    setNewSample(newValue);
    setNewSampleId(
      samples.filter((sample) => sample.name === newValue)[0]?.sample_id || null
    );
  };

  const handleMeasurementUpdate = (newValue) => {
    setNewMeasurement(newValue);
    setNewMeasurementId(
      measurements.filter((measurement) => measurement.unit === newValue)[0]
        ?.id || null
    );
  };

  const handleDelete = async (report_procedure_id) => {
    try {
      await axiosPrivate.delete(
        `/api/report/reportProcedures/${report_procedure_id}`
      );
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMeasurementValueChange = async (
    newValue,
    report_procedure_id,
    updateInDatabase
  ) => {
    if (!updateInDatabase) {
      setMeasurementValue({ value: newValue });
      setMeasurementValue((prev) => ({
        ...prev,
        report_procedure_id: report_procedure_id,
      }));
    } else if (
      updateInDatabase &&
      report_procedure_id === measurementValue.report_procedure_id
    ) {
      console.log("updated");
      try {
        await axiosPrivate.put(
          `/api/report/reportProcedures/${measurementValue.report_procedure_id}`,
          { data: measurementValue.value }
        );
      } catch (err) {
        console.log(err);
      }
      window.location.reload(false);
    }
  };

  return (
    <div className="table__container">
      {modalOpen && (
        <ReportPreviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          reportData={reportData}
          reportProcedures={reportProcedures}
          id={id}
        />
      )}
      {insertMode && (
        <div className="table__addContent">
          <span>
            <CloseIcon
              onClick={() => setInsertMode(false)}
              titleAccess="Sulge aken"
              className="table__closeIcon"
            />
          </span>

          <label>Protseduur</label>
          <input
            onChange={(e) => {
              handleProcedureUpdate(e);
            }}
            id="procedure_name"
            list="proceduresList"
            placeholder="Vali protseduur *"
            value={newProcedure}
            title="Kohustuslik väli!"
            autoComplete="off"
            required
          />
          <datalist id="proceduresList">
            {procedures?.map((procedure, i) => (
              <option key={i} value={procedure.name_est}>
                {procedure.name_est}
              </option>
            ))}
          </datalist>

          {procedureId && (
            <>
              {methods?.filter((method) => method.mapped === "Jah").length >
                0 && (
                <>
                  <label>Meetod</label>
                  <input
                    onChange={(e) => handleMethodUpdate(e.target.value)}
                    id="method_name"
                    list="methodsList"
                    placeholder="Vali meetod"
                    value={newMethod}
                    autoComplete="off"
                  />
                  <datalist id="methodsList">
                    {methods
                      ?.filter((method) => method.mapped === "Jah")
                      .map((method, i) => (
                        <option key={i} value={method.name}>
                          {method.name}
                        </option>
                      ))}
                  </datalist>
                </>
              )}
              {samples?.filter((sample) => sample.mapped === "Jah").length >
                0 && (
                <>
                  <label>Proov</label>
                  <input
                    onChange={(e) => handleSampleUpdate(e.target.value)}
                    id="sample_name"
                    list="samplesList"
                    placeholder="Vali proov *"
                    value={newSample}
                    title="Kohustuslik väli!"
                    autoComplete="off"
                    required
                  />
                  <datalist id="samplesList">
                    {samples
                      ?.filter((sample) => sample.mapped === "Jah")
                      .map((sample, i) => (
                        <option key={i} value={sample.name}>
                          {sample.name}
                        </option>
                      ))}
                  </datalist>
                </>
              )}

              <label>Mõõtühik</label>
              <input
                onChange={(e) => handleMeasurementUpdate(e.target.value)}
                id="measurement"
                list="measurementsList"
                placeholder="Vali mõõtühik"
                value={newMeasurement}
                autoComplete="off"
              />
              <datalist id="measurementsList">
                {measurements?.map((measurement, i) => (
                  <option key={i} value={measurement.unit}>
                    {measurement.unit}
                  </option>
                ))}
              </datalist>
            </>
          )}
          <span>* Tähistatud on kohustuslikud väljad!</span>
          <button
            disabled={!procedureId || !newSampleId}
            onClick={() => handleInsert()}
          >
            Sisesta
          </button>
        </div>
      )}

      <table className="table reportTable">
        <thead className="table__head">
          <tr>
            {procedureDataColumns.map((column, i) => (
              <th key={i}>{column.header}</th>
            ))}
            {user.is_admin && (
              <th>
                <NewObject
                  className="table__button"
                  onClick={() => setInsertMode(true)}
                  titleAccess="Lisa rida"
                />
              </th>
            )}
          </tr>
        </thead>
        <tbody className="table__row">
          {reportProcedures?.map((object, i) => (
            <tr key={i}>
              {procedureDataColumns.map((column, _i) => (
                <td key={_i}>
                  {column.field === "value" ? (
                    <div className="reportTable__value">
                      {insertingValue === object.report_procedure_id ? (
                        <>
                          <input
                            onChange={(e) =>
                              handleMeasurementValueChange(
                                e.target.value,
                                object.report_procedure_id,
                                false
                              )
                            }
                            id="measurementValue"
                            value={
                              measurementValue.report_procedure_id ===
                              object.report_procedure_id
                                ? measurementValue.value
                                : object.value
                            }
                            autoComplete="off"
                          />
                          <SaveButton
                            className="table__button"
                            titleAccess="Sisesta mõõtmistulemus"
                            onClick={() =>
                              handleMeasurementValueChange(
                                null,
                                object.report_procedure_id,
                                true
                              )
                            }
                          />
                        </>
                      ) : (
                        <>
                          {object[column.field] || "-"}
                          <EditButton
                            className="table__button"
                            titleAccess="Sisesta mõõtmistulemus"
                            onClick={() =>
                              setInsertingValue(object.report_procedure_id)
                            }
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    object[column.field]
                  )}
                </td>
              ))}
              {user.is_admin && (
                <td key={i}>
                  {" "}
                  <DeleteButton
                    className="table__button"
                    titleAccess="Kustuta rida"
                    onClick={() => handleDelete(object.report_procedure_id)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
