import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Workers from "./pages/Workers";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/orders" component={Orders} />
      <Route path="/workers" component={Workers} />
      <Route path="/analytics" component={Analytics} />
      <Route component={Home} />
    </Switch>
  );
}
