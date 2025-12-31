import React, { useEffect, useState } from "react";
import axios from "../api/axios";

//Components

//Icons
import CloseIcon from "@mui/icons-material/Close";

//Styles
import "./AccordionModal.css";

function AccordionModal({ open, onClose, name, path, id }) {
  const modalMap = [
    {
      endpoint: "procedureMethods",
      columns: [
        { field: "id", header: "mappi id" },
        { field: "name", header: "meetodi nimetus" },
        { field: "accredited", header: "akrediteeritud" },
        { field: "mapped", header: "ühendatud" },
      ],
    },
    {
      endpoint: "procedureSamples",
      columns: [
        { field: "id", header: "mappi id" },
        { field: "name", header: "proovi nimetus" },
        { field: "mapped", header: "ühendatud" },
      ],
    },
  ];

  const [modalData, setModalData] = useState([]);
  const [modalColumns, setModalColumns] = useState([]);

  const handleEscape = (e) => {
    if (e.key === "Escape") onClose();
  };

  const handleKeydown = (e) => {
    return handleEscape && handleEscape(e);
  };

  const handleChange = async (e, id) => {
    const { procedure_id } = modalData[id];

    const second_id = modalData[id].method_id
      ? modalData[id].method_id
      : modalData[id].sample_id;

    if (modalData[id].mapped === "Jah") {
      try {
        await axios.delete(`/api/backend/${path}/${procedure_id}`, {
          withCredentials: true,
          data: { second_id },
        });
        //if (result.status === 200) setMessage("Andmed edukalt uuendatud");
      } catch (err) {
        console.log(err.response);
      }
    } else if (modalData[id].mapped === "Ei") {
      try {
        await axios.post(`/api/backend/${path}`, {
          withCredentials: true,
          data: { procedure_id, second_id },
        });
        //if (result.status === 200) setMessage("Andmed edukalt uuendatud");
      } catch (err) {
        console.log(err.response);
      }
    }
    fetchData();
  };

  const fetchData = async () => {
    try {
      const result = await axios.get(`api/backend/${path}/${id}`, {
        withCredentials: true,
      });
      setModalData(result.data);
    } catch (err) {
      console.log(err.response);
    }
    setModalColumns(modalMap.filter((i) => i.endpoint === path)[0]?.columns);
  };

  useEffect(() => {
    fetchData();

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  if (!open) return null;

  return (
    <div onClick={onClose} className="accordionModal">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="accordionModal__container"
      >
        <div className="accordionModal__header ">
          <h4 className="accordionModal__title">
            {modalData && (
              <>
                #{id}: {name} -{" "}
                {path === "procedureMethods" ? "Meetodid" : "Proovid"}
              </>
            )}
          </h4>
          <span class="accordionModal__button" data-tooltip="Sulge">
            <CloseIcon
              onClick={onClose}
              className="accordionModal__closeIcon"
              titleAccess="Sulge aken"
            />
          </span>
        </div>

        <table className="accordionModal__table">
          <thead className="accordionModal__head">
            <tr>
              {modalColumns?.map((accordionColumn, idx) => (
                <th key={idx}>{accordionColumn.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="accordionModal__body">
            {modalData?.map((accordionRow, i) => (
              <tr key={i}>
                {modalColumns?.map((accordionColumn, _i) =>
                  accordionColumn.field === "mapped" ? (
                    <td key={_i} className="accordionModal__checkbox">
                      <input
                        key={_i}
                        id={accordionColumn.field}
                        value={
                          accordionRow[accordionColumn.field] === "Jah"
                            ? "Jah"
                            : "Ei"
                        }
                        onChange={(e) => handleChange(e, i)}
                        type="checkbox"
                        checked={accordionRow[accordionColumn.field] === "Jah"}
                      />
                    </td>
                  ) : (
                    <td key={_i}>{accordionRow[accordionColumn.field]}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccordionModal;
