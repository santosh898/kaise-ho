import Router from "preact-router";
import "./app.css";
import ThisWeek from "./routes/this-week";
import Past from "./routes/past";

export function App() {
  return (
    <Router>
      <ThisWeek path="this-week" />
      <Past path="/past" />
    </Router>
  );
}
