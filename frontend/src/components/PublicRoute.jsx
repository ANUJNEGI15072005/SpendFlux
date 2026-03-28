import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader/>;

  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;