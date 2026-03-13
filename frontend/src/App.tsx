import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StartTrial from './pages/StartTrial';
import Favorites from './pages/Favorites';

import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Recommendations from './pages/Recommendations';
import Events from './pages/Events';
import CommunityMoments from './pages/CommunityMoments';

import Settings from './pages/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManager from './pages/admin/UserManager';
import AdminListings from './pages/admin/AdminListings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ExperienceModeration from './pages/admin/ExperienceModeration';

// Owner Pages
import ManageListings from './pages/owner/ManageListings';
import AddListing from './pages/owner/AddListing';

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/start-trial" element={<StartTrial />} />

          {/* User Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/recommendations" element={<Recommendations />} />
            <Route path="/user/events" element={<Events />} />
            <Route path="/user/moments" element={<CommunityMoments />} />
            <Route path="/user/favorites" element={<Favorites />} />
            <Route path="/user/settings" element={<Settings />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={
            <ProtectedRoute adminOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/users" element={<UserManager />} />
            <Route path="/admin/listings" element={<AdminListings />} />
            <Route path="/admin/moderation" element={<ExperienceModeration />} />
          </Route>

          {/* Owner Dashboard Routes */}
          <Route element={
            <ProtectedRoute ownerOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/owner/dashboard" element={<ManageListings />} />
            <Route path="/owner/add-listing" element={<AddListing />} />
          </Route>

        </Routes>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
