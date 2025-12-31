import React, { useEffect, useState, useContext } from "react";
import useFetch from "../hooks/useFetch";
//import jsPDF from "jspdf";
//import html2canvas from "html2canvas";

//Components

// Hooks
import { AuthContext } from "../context/Authentication";

//Icons
import logo from "../images/logo_color2.png";
import accreditedLogo from "../images/akr_certificate.png";

//Styles
import "./ReportPreviewModal.css";

//Utils
import { getCurrentYear, getCurrentDate } from "../utils/getCurrentDate";

function ReportPreviewModal({ open, onClose, reportData }) {
  const { user } = useContext(AuthContext);
  const [estonianLang, setEstonianLang] = useState(true);

  // Report procedures
  const { data: reportProcedures } = useFetch(
    "/api/report/reportProcedures",
    reportData?.id,
    true
  );

  const accreditedCount = reportProcedures?.filter(
    (procedure) => procedure.accredited === "Jah"
  ).length;

  const notAccreditedCount = reportProcedures?.length;

  const showAccreditedLogo = accreditedCount / notAccreditedCount >= 0.5;

  const procedureDataColumns = [
    {
      fieldEst: "procedure_name_est",
      fieldEng: "procedure_name_eng",
      headerEst: "Kvaliteedinäitaja",
      headerEng: "Parameter",
    },
    {
      fieldEst: "method_name",
      fieldEng: "method_name",
      headerEst: "Katsemeetod",
      headerEng: "Test method",
    },
    {
      fieldEst: "unit",
      fieldEng: "unit",
      headerEst: "Mõõtühik",
      headerEng: "Units",
    },
    //{ fieldEst: "sample_name_est", fieldEng: "sample_name_eng", headerEst: "Proov",headerEng: "Kvaliteedinäitaja" },
    {
      fieldEst: "value",
      fieldEng: "value",
      headerEst: "Katsetulemus",
      headerEng: "Test results",
    },
  ];

  const handleEscape = (e) => {
    if (e.key === "Escape") onClose();
  };

  const handleKeydown = (e) => {
    return handleEscape && handleEscape(e);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const generatePDF = () => {
    //document.getElementById("button1").style.visibility = "hidden";
    //document.getElementById("button2").style.visibility = "hidden";
    const currentTitle = document.title;
    document.title = `Katseprotokoll ${reportData?.id}-${getCurrentYear()
      .toString()
      .substring(2)}`;
    /*
    const input = document.getElementById("report");

    html2canvas(input, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("img/png");

      console.log(canvas.height);
      console.log(canvas.width);

      const report = new jsPDF("portrait", "mm", "a4");

      report.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      report.save(
        `Katseprotokoll 9-5-1/${reportData?.id}-${getCurrentYear()
          .toString()
          .substring(2)}.pdf`
      );
    });
    */
    //window.print();

    /*var newWindow = window.open("", "PRINT", "height=400mm, width=600");

    newWindow.document.write(
      "<html><head><title>" +
        `Katseprotokoll ${reportData?.id}-${getCurrentYear()
          .toString()
          .substring(2)}` +
        "</title>"
    );
    newWindow.document.write(
      '<link rel="stylesheet" href="./ReportPreviewModal.css" type="text/css" />'
    );
    newWindow.document.write("</head><body>");
    newWindow.document.write(document.getElementById("report").innerHTML);
    newWindow.document.write("</body></html>");
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();*/

    window.print();

    document.title = currentTitle;
  };

  if (!open) return null;

  return (
    <div
      //onClick={onClose}
      className="previewModal"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="previewModal__container"
      >
        <div className="previewModal__content" id="report">
          {/* HEADER */}
          <div className="previewModal__header">
            {/* First row of PDF file: Logo and vertical university name*/}
            <div className="previewModal__firstRow">
              <img src={logo} alt="" />
              <p className="uppercaseGray">
                {estonianLang
                  ? "Tallinna Tehnikaülikool"
                  : "Tallinn University of Technology"}
              </p>
            </div>

            {/* Second row of PDF file: Institution and accredited logo*/}
            <div className="previewModal__secondRow marginLarge">
              <div className="previewModal__column">
                <p className="uppercaseGray">
                  {estonianLang
                    ? "Põlevkivi kompetentsikeskus"
                    : "Oil shale competence centre"}
                </p>
                <p className="uppercaseGray">
                  {estonianLang
                    ? "Kütuste Tehnoloogia teadus- ja katselabor"
                    : "Laboratory of fuels technology"}
                </p>
              </div>
              <div className="previewModal__column">
                {showAccreditedLogo && (
                  <img
                    src={accreditedLogo}
                    alt=""
                    className="preciewModal__accreditedLogo"
                  />
                )}
              </div>
            </div>
          </div>

          {/* First section of the report content: samples and company data*/}
          <div className="previewModal__section marginLarge">
            <p className="blackBold">
              {estonianLang
                ? `KATSEPROTOKOLL nr 9-5-1/${reportData?.id}-`
                : `TEST REPORT no 9-5-1/${reportData?.id}-`}
              {getCurrentYear().toString().substring(2)}
            </p>
            <div className="previewModal__row marginSmall">
              <div className="previewModal__column">
                <span className="backgroundTitle">
                  {estonianLang ? "Proov" : "Sample"}
                </span>
                <p className="marginLarge">
                  {estonianLang ? "Nimetus" : "Sample name"}
                </p>
                <p>{estonianLang ? "Proovivõtt" : "Sampling"}</p>
                <p className="marginLarge">
                  {estonianLang ? "Laborisse tulek: " : "Samples received: "}
                  {reportData?.samples_received_date}
                </p>
                <p>
                  {estonianLang ? "Analüüsi algus: " : "Test start date: "}
                  {reportData?.start_date}
                </p>
                <p>
                  {estonianLang ? "Analüüsi lõpp: " : "Test end date: "}
                  {reportData?.end_date}
                </p>
                <p>{estonianLang ? "Registreerimisnumber: " : "Reg. no: "}</p>
              </div>
              <div className="previewModal__column">
                <span className="backgroundTitle">
                  {estonianLang ? "Tellija" : "Customer"}
                </span>
                <p className="marginLarge">
                  {estonianLang ? "Aadress: " : "Address: "}
                  {reportData?.company_address}
                </p>

                <p className="marginLarge">
                  {estonianLang ? "Registrikood: " : "Registration number: "}
                  {reportData?.company_registration_code}
                </p>
                <p className="marginLarge">
                  {estonianLang ? "Kontaktisik: " : "Contact person: "}
                  {reportData?.customer_contact_person}
                </p>
                <p>
                  {estonianLang ? "Telefon: " : "Phone: "}
                  {reportData?.customer_phone}
                </p>
                <p>
                  {estonianLang ? "E-post: " : "E-mail: "}
                  {reportData?.customer_email}
                </p>
              </div>
            </div>
          </div>

          {/* Second section of the report content: test results*/}
          <div className="previewModal__section marginLarge">
            <p className="blackBold">
              {estonianLang ? "Analüüsi tulemused:" : "Test results:"}
            </p>
            <table className="previewModal__proceduresTable">
              <thead>
                <tr>
                  {procedureDataColumns.map((column, i) => (
                    <th key={i}>
                      {estonianLang ? column.headerEst : column.headerEng}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportProcedures?.map((object, i) => (
                  <tr key={i}>
                    {procedureDataColumns?.map((column, _i) => (
                      <td
                        key={_i}
                        className={
                          column.fieldEst === "unit" ||
                          column.fieldEst === "value"
                            ? "center"
                            : ""
                        }
                      >
                        {" "}
                        {estonianLang
                          ? object[column.fieldEst]
                          : object[column.fieldEng]}
                        <small className="remarkRed">
                          {notAccreditedCount !== accreditedCount &&
                            showAccreditedLogo &&
                            object.accredited === "Ei" &&
                            column.fieldEst === "method_name" &&
                            "*"}
                        </small>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Third section of the report content: notes*/}
          <div className="previewModal__section marginLarge">
            <p className="blackBold">{estonianLang ? "Märkused:" : "Notes:"}</p>
            <p className="blackLight">
              {reportData.notes}
              {estonianLang
                ? " Analüüsi tulemused kehtivad analüüsiks toodud proovile."
                : " The test results are valid only for the given sample."}
              <p className="remarkRed">
                {estonianLang &&
                  notAccreditedCount !== accreditedCount &&
                  showAccreditedLogo &&
                  "* Analüüs ei ole akrediteeritud."}
                {!estonianLang &&
                  notAccreditedCount !== accreditedCount &&
                  showAccreditedLogo &&
                  "* Test is not accredited."}
              </p>
            </p>
          </div>

          {/* Forth section of the report content: institution contacts*/}
          <div className="previewModal__section marginLarge">
            <div className="previewModal__row">
              <p className="blackLight">
                {estonianLang
                  ? "/ Allkirjastatud digitaalselt /"
                  : "/ Signed digitally /"}
              </p>
              <p className="blackLight">
                {estonianLang
                  ? "Katseprotokolli allkirjastamise kuupäev: "
                  : "Test report date: "}
                {getCurrentDate()}
              </p>
            </div>

            <p className="blackLight">{user.firstname + " " + user.lastname}</p>
            <p className="blackLight">{user.profession}</p>
            <p className="blackLight">
              {estonianLang
                ? "Kütuste Tehnoloogia teadus- ja katselabor"
                : "Laboratory of fuels technology"}
            </p>
            <p className="blackLight">{user.address}</p>
            <p className="blackLight marginLarge">
              {estonianLang ? "Virumaa kolledž" : "Virumaa College"}
            </p>
            <p className="blackLight">
              {estonianLang ? "Inseneriteaduskond" : "School of Engineering"}
            </p>
            <p className="blackLight">
              {estonianLang
                ? "Tallinna Tehnikaülikool"
                : "Tallinn University of Technology"}
            </p>
          </div>

          {/* FOOTER */}
          <div className="previewModal__footer">
            <div className="p__middle">
              {estonianLang
                ? "Dokumendi osaline paljundamine ilma labori loata keelatud"
                : "Partial reproduction of the document is prohibited without the permission of the laboratory"}
            </div>
            <hr />

            <p className="uppercaseGray marginSmall">
              {estonianLang
                ? "Tallinna Tehnikaülikool"
                : "Tallinn University of Technology"}
            </p>

            <div className="previewModal__row">
              <div className="previewModal__column footerColumn">
                <p className="lowercaseGray">Ehitajate tee 5</p>
                <p className="lowercaseGray">19086 Tallinn</p>
                <p className="lowercaseGray">
                  {estonianLang ? "Registrikood" : "Registry code"}
                </p>
                <p className="lowercaseGray">74000323</p>
              </div>
              <div className="previewModal__column footerColumn">
                <p className="lowercaseGray">
                  {estonianLang ? "Telefon " : "Phone "} 620 2002
                </p>
                <p className="lowercaseGray">
                  {estonianLang ? "E-post " : "E-mail "} info@taltech.ee
                </p>
                <p className="lowercaseGray">www.taltech.ee</p>
                <p className="lowercaseGray pageNumber">1(1)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="previewModal__buttonContainer">
        <button
          className="previewModal__button"
          id="button1"
          onClick={() => setEstonianLang(!estonianLang)}
        >
          {estonianLang ? "Inglise keeles" : "Eesti keeles"}
        </button>
        <button
          className="previewModal__button"
          id="button2"
          onClick={() => generatePDF()}
        >
          Prindi
        </button>
      </div>
    </div>
  );
}

export default ReportPreviewModal;
