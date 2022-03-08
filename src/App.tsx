import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './pages/Home';
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import FieldPage from './pages/FieldPage';
import CreateOrder from "./pages/CreateOrder";
import CreateStock from "./pages/CreateStock";
import CreateSale from "./pages/CreateSale";
import Sales from './pages/Sales';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Stock from './pages/Stock';
import Costs from "./pages/Costs";
import CreateCost from "./pages/CreateCost";
import CostPage from "./pages/CostPage";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<DatabaseProvider>
					<Switch>
						<PrivateRoute exact path="/" component={Home} />
						<PrivateRoute path="/overview" component={Overview} />
						<PrivateRoute path="/sales" component={Sales} />
						<PrivateRoute path="/field/:id" component={FieldPage} />
						<PrivateRoute path="/stock" component={Stock} />
						<PrivateRoute path="/create-order" component={CreateOrder} />
						<PrivateRoute path="/create-stock" component={CreateStock} />
						<PrivateRoute path="/create-sale" component={CreateSale} />
						<PrivateRoute path="/costs" component={Costs} />
						<PrivateRoute path="/create-cost" component={CreateCost} />
						<PrivateRoute path="/cost/:id" component={CostPage} />
						<PrivateRoute path="/settings" component={Settings} />
						<Route path = "/login" component={Login} />
						<Route path = "/signup" component={Signup} />
						<Route path="/forgot-password" component={ForgotPassword} />
					</Switch>
				</DatabaseProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
