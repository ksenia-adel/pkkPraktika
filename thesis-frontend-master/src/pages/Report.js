// Libraries
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

// Components
import Sidebar from "../components/Sidebar";
import { ReportSidebarData } from "../components/ReportSidebarData";
import ReportTable from "../components/ReportTable";

// Icons
import EditButton from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";

// Hooks
import { AuthContext } from "../context/Authentication";

// Utils
import { getCurrentDate } from "../utils/getCurrentDate";
import { getCurrentYear } from "../utils/getCurrentDate";

// Styles
import "./Common.css";
import "./Report.css";
import ReportPreviewModal from "../components/ReportPreviewModal";

function Report({ editMode }) {
  const { user, accessToken } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState("");
  let { id } = useParams();
  const navigate = useNavigate();

  const DATE = getCurrentDate();
  const MIN_DATE = getCurrentDate(-1);
  const MAX_DATE = getCurrentDate(1);

  const [reportData, setReportData] = useState({
    id: id,
    company_name: "",
    customer_id: null,
    samples_received_date: editMode ? null : DATE,
    start_date: editMode ? null : DATE,
    end_date: "",
    insertor_user_id: editMode ? null : user.user_id,
    generation_time: "",
    generator_user_id: null,
    notes: "",
    archived: false,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const buttonDisabled = !reportData.customer_id ? true : false;
  const handleSubmit = async (e) => {
    if (!editMode) {
      try {
        const result = await axios.post(`/api/report/`, {
          withCredentials: true,
          data: reportData,
        });
        if (result.status === 200) {
          navigate("/home");
        }
      } catch (err) {
        console.log(err.response);
      }
    } else if (editMode) {
      try {
        await axios.put(`/api/report/${reportData.id}`, {
          withCredentials: true,
          data: reportData,
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (err) {
        console.log(err.response);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setReportData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

    // Find customer_id value by company_name
    if (e.target.id === "company_name") {
      setReportData((prev) => ({
        ...prev,
        customer_id:
          customers?.filter(
            (customer) => customer.company_name === e.target.value
          )[0]?.customer_id || undefined,
      }));
    }
  };

  const [editingAllowed, setEditingAllowed] = useState(false);
  const allowEditing = () => {
    if (editMode) {
      if (editingAllowed === false) {
        setEditingAllowed(true);
        setTitle("Raporti andmete muutmine");
      } else {
        setEditingAllowed(false);
        setTitle("Raporti andmed");
      }
    }
  };

  const [hiddenClass, setHiddenClass] = useState("");
  const [title, setTitle] = useState("Raporti andmed");

  // On rendering
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const rawCustomers = await axios.get("/api/customers/", {
          withCredentials: true,
        });
        setCustomers(rawCustomers.data);
      } catch (err) {
        console.log(err.response);
      }
    };

    fetchCustomers(); // Always fetch all customers

    // If editmode, then also fetch reports data
    if (editMode) {
      const fetchReport = async () => {
        try {
          const rawReport = await axios.get(`/api/report/${id}`, {
            withCredentials: true,
          });
          if (rawReport.data[0]) {
            setReportData(rawReport.data[0]);
          }
        } catch (err) {
          console.log(err);
          //navigate("/home");
        }
      };
      fetchReport();
    }

    if (!editMode) {
      setEditingAllowed(true);
      setHiddenClass("report__hidden");
      setTitle("Uue raporti sisestamine");
    } else if (editMode && user.is_admin === true) {
      setHiddenClass("report__editButton");
    }
  }, [editMode, id, user.is_admin]);

  //if (user) return <NavLink to="/home" />;
  return (
    <div className="report">
      {modalOpen && (
        <ReportPreviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          reportData={reportData}
        />
      )}

      <div className="report__container">
        {/*      <Sidebar sidebarData={ReportSidebarData} />
         */}

        <h2>
          {title}
          {!editingAllowed ? (
            <EditButton
              className={hiddenClass || "report__editButton"}
              onClick={allowEditing}
              titleAccess="Muuda raporti andmeid"
            />
          ) : (
            <CloseIcon
              className={hiddenClass || "report__editButton"}
              onClick={allowEditing}
              titleAccess="Tagasi"
            />
          )}
        </h2>
        {editMode && reportData.id !== undefined && (
          <h3>
            Katseprotokoll nr 9-5-1/{reportData.id}-
            {getCurrentYear().toString().substring(2)}
          </h3>
        )}
        <form>
          <div className="report__container__row">
            <div className="report__container__column">
              <label>Ettevõtte nimi</label>
              <input
                onChange={handleChange}
                id="company_name"
                list="customersList"
                placeholder="Otsi ettevõtet"
                value={reportData.company_name}
                disabled={!editingAllowed || !user.is_admin}
                title={
                  !editingAllowed ||
                  (!user.is_admin && "Andmete muutmiseks puuduvad õigused!")
                }
                required
              />
              <datalist id="customersList">
                {customers?.map((customer, i) => (
                  <option key={i} value={customer.company_name}>
                    {customer.company_name}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="report__container__column">
              <label>Proovide saabumise kuupäev</label>
              <input
                onChange={handleChange}
                type="date"
                id="samples_received_date"
                value={reportData.samples_received_date}
                min={MIN_DATE}
                max={MAX_DATE}
                disabled={!editingAllowed || !user.is_admin}
                title={
                  !editingAllowed ||
                  (!user.is_admin && "Andmete muutmiseks puuduvad õigused!")
                }
              />
            </div>
          </div>
          <div className="report__container__row">
            <div className="report__container__column">
              <label>Alustamise kuupäev</label>
              <input
                onChange={handleChange}
                type="date"
                id="start_date"
                value={reportData.start_date}
                min={MIN_DATE}
                max={MAX_DATE}
                disabled={!editingAllowed || !user.is_admin}
                title={
                  !editingAllowed ||
                  (!user.is_admin && "Andmete muutmiseks puuduvad õigused!")
                }
              />
            </div>
            <div className="report__container__column">
              <label>Lõpetamise kuupäev</label>
              <input
                onChange={handleChange}
                type="date"
                id="end_date"
                value={reportData.end_date}
                min={MIN_DATE}
                max={MAX_DATE}
                disabled={!editingAllowed || !user.is_admin}
                title={
                  !editingAllowed ||
                  (!user.is_admin && "Andmete muutmiseks puuduvad õigused!")
                }
              />
            </div>
          </div>
          <div className="report__container__row">
            <div className="report__container__column">
              <label>Märkmed</label>
              <textarea
                name=""
                id="notes"
                rows="3"
                onChange={handleChange}
                value={reportData.notes}
                disabled={!editingAllowed}
                maxLength="2048"
              />
            </div>
          </div>
          <button
            hidden={!editingAllowed}
            disabled={buttonDisabled}
            onClick={handleSubmit}
          >
            {!editMode ? "Lisa uus raport" : "Muuda raportit"}
          </button>
          {message && <span>{message}</span>}
          <span>{message}</span>
        </form>
      </div>
      {editMode && (
        <div className="report__container">
          <ReportTable id={id} reportData={reportData} />
          <button disabled={!user.is_admin} onClick={() => setModalOpen(true)}>
            Eelvaade
          </button>
        </div>
      )}
    </div>
  );
}

export default Report;
