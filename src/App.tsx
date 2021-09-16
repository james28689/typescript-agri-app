import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './pages/Home';
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Switch>
					<PrivateRoute exact path="/" component={Home} />
					<PrivateRoute path="/about" component={About} />
					<Route path = "/login" component={Login} />
					<Route path = "/signup" component={Signup} />
					<Route path="/forgot-password" component={ForgotPassword} />
				</Switch>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
