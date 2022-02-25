import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './pages/Home';
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import Weather from "./pages/Weather";
import FieldPage from './pages/FieldPage';
import CreateOrder from "./pages/CreateOrder"
import CreateStock from "./pages/CreateStock"
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Stock from './pages/Stock';

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<DatabaseProvider>
					<Switch>
						<PrivateRoute exact path="/" component={Home} />
						<PrivateRoute path="/overview" component={Overview} />
						<PrivateRoute path="/weather" component={Weather} />
						<PrivateRoute path="/field/:id" component={FieldPage} />
						<PrivateRoute path="/stock" component={Stock} />
						<PrivateRoute path="/create-order" component={CreateOrder} />
						<PrivateRoute path="/create-stock" component={CreateStock} />
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
