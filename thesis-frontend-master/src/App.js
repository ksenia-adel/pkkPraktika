// Libraries
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Report from "./pages/Report";
import Backend from "./pages/Backend";
import Navigation from "./components/Navigation";

// Hooks

// Styles
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={[<Navigation />, <Home />]} />
        <Route path="/settings" element={[<Navigation />, <Settings />]} />
        <Route
          path="/report/:id"
          element={[<Navigation />, <Report editMode={true} />]}
        />
        <Route
          path="/report"
          element={[<Navigation />, <Report editMode={false} />]}
        />
        <Route path="/backend" element={[<Navigation />, <Backend />]}>
          <Route path="customers" element={[<Navigation />, <Backend />]}>
            <Route path=":id" element={[<Navigation />]} />
          </Route>
          <Route path="procedures" element={[<Navigation />, <Backend />]}>
            <Route path=":id" element={[<Navigation />]} />
          </Route>
          <Route path="methods" element={[<Navigation />, <Backend />]}>
            <Route path=":id" element={[<Navigation />]} />
          </Route>
          <Route path="samples" element={[<Navigation />, <Backend />]}>
            <Route path=":id" element={[<Navigation />]} />
          </Route>
          <Route path="measurements" element={[<Navigation />, <Backend />]}>
            <Route path=":id" element={[<Navigation />]} />
          </Route>
          <Route path="users" element={[<Navigation />, <Backend />]}>
            <Route path=":id" element={[<Navigation />]} />
          </Route>
          <Route path="roles" element={[<Navigation />, <Backend />]}>
            <Route path=":id" element={[<Navigation />]} />
          </Route>
          <Route path="settings" element={[<Navigation />, <Settings />]} />
        </Route>

        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
