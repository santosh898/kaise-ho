import Router from "preact-router";
import "./app.css";
import ThisWeek from "./routes/this-week";
import Past from "./routes/past";
import Radial from "./routes/radial";

export function App() {
  return (
    <Router>
      <ThisWeek default path="this-week" />
      <Past path="/past" />
      <Radial path="/radial"/>
    </Router>
  );
}
