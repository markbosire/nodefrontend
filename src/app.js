import React from 'react';
import { Router, Route } from 'wouter';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';
import Browse from './pages/Browse';
import Collection from './pages/Collection';
import OnSale from './pages/OnSale';

const App = () => {
  // Check if 'immortal-token' exists in localStorage
  const isLoggedIn = localStorage.getItem('immortal-token');
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedInImmortal');

  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/admin" component={isAdminLoggedIn?AdminHome:AdminLogin}/>
      {/* Render Home if 'immortal-token' exists, otherwise render LandingPage */}
      <Route path="/" component={isLoggedIn ? Home : LandingPage} />
      <Route path='/browse' component={Browse}/>
      <Route path='/collection' component={Collection}/>
      <Route path='/usersale' component={OnSale}/>
    </Router>
  );
};

export default App;
