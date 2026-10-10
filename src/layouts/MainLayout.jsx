import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from '../components/AuthModal';
import RouteModal from '../components/RouteModal';
import WeatherModal from '../components/WeatherModal';
import ReviewsModal from '../components/ReviewsModal';
import { getWeatherForDestination } from '../services/api';

export default function MainLayout() {
  const [routeModalState, setRouteModalState] = useState({
    isOpen: false,
    initialData: null,
  });

  const [weatherModalState, setWeatherModalState] = useState({
    isOpen: false,
    weather: null,
  });

  const [reviewsModalState, setReviewsModalState] = useState({
    isOpen: false,
    destination: null,
  });

  // Modal Triggers
  const handleOpenRouteModal = (data = null) => {
    setRouteModalState({
      isOpen: true,
      initialData: data || {
        fromName: 'Mumbai Central Terminus',
        fromLat: 18.9696,
        fromLon: 72.8193,
        toName: 'Gateway of India',
        toLat: 18.9220,
        toLon: 72.8347,
        mode: 'DRIVING',
      },
    });
  };

  const handleCloseRouteModal = () => {
    setRouteModalState({ isOpen: false, initialData: null });
  };

  const handleOpenWeatherModal = async (destination) => {
    try {
      const res = await getWeatherForDestination(destination.id);
      setWeatherModalState({
        isOpen: true,
        weather: res.data,
      });
    } catch (err) {
      alert('Unable to load weather forecast: ' + err.message);
    }
  };

  const handleCloseWeatherModal = () => {
    setWeatherModalState({ isOpen: false, weather: null });
  };

  const handleOpenReviewsModal = (destination) => {
    setReviewsModalState({
      isOpen: true,
      destination,
    });
  };

  const handleCloseReviewsModal = () => {
    setReviewsModalState({ isOpen: false, destination: null });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Navigation Bar */}
      <Navbar onOpenRouteModal={() => handleOpenRouteModal()} />

      {/* Main Routed Page Content */}
      <main style={{ flex: 1 }}>
        <Outlet
          context={{
            openRouteModal: handleOpenRouteModal,
            openWeatherModal: handleOpenWeatherModal,
            openReviewsModal: handleOpenReviewsModal,
          }}
        />
      </main>

      {/* Global Academic & Enterprise Footer */}
      <Footer />

      {/* Globally Mounted Modals */}
      <AuthModal />

      {routeModalState.isOpen && (
        <RouteModal
          initialData={routeModalState.initialData}
          onClose={handleCloseRouteModal}
        />
      )}

      {weatherModalState.isOpen && (
        <WeatherModal
          weather={weatherModalState.weather}
          onClose={handleCloseWeatherModal}
        />
      )}

      {reviewsModalState.isOpen && (
        <ReviewsModal
          destination={reviewsModalState.destination}
          onClose={handleCloseReviewsModal}
        />
      )}
    </div>
  );
}
