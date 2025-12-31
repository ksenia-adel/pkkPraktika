import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Hooks
import { AuthContext } from "../context/Authentication";

// Icons
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";

// Tables
import "./Table.css";

function Table({ data, columns, path, addButtonPath }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const userRedirect = (id) => {
    if (path) navigate(`${path}/${id}`);
  };

  const handlebuttonRedirect = () => {
    if (addButtonPath) navigate(`${addButtonPath}`);
  };

  return (
    <div className="table__container">
      <table className="table">
        <thead className="table__head">
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column.header}</th>
            ))}
            {user.username === "admin" && addButtonPath && (
              <th>
                <PostAddOutlinedIcon
                  className="table__button"
                  onClick={() => handlebuttonRedirect()}
                  titleAccess="Lisa rida"
                />
              </th>
            )}
          </tr>
        </thead>
        <tbody className="table__row">
          {data.map((object, i) => (
            <tr key={i} onClick={() => userRedirect(object.id)}>
              {columns.map((column, _i) => (
                <td key={_i}>{object[column.field]}</td>
              ))}
              {user.username === "admin" && addButtonPath && <td key={i}></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
