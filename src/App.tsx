import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './pages/Home';
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import Weather from "./pages/Weather";
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from "./contexts/DatabaseContext";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<DatabaseProvider>
					<Switch>
						<PrivateRoute exact path="/" component={Home} />
						<PrivateRoute path="/overview" component={Overview} />
						<PrivateRoute path="/weather" component={Weather} />
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
