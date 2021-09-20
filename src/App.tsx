import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './pages/Home';
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
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
						<PrivateRoute path="/about" component={About} />
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
