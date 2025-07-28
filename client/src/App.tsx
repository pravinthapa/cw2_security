import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider } from "./contexts/AuthContext";

// Components
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages

import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import VaultItemDetail from "./pages/VaultItemDetail";
// import EmergencyContacts from "./pages/EmergencyContacts";
import FileUpload from "./pages/FileUpload";
import StripePayment from "./pages/StripePayment";
import ActivityLogs from "./pages/ActivityLogs";
import AdminAudit from "./pages/AdminAudit";
import NotFound from "./pages/NotFound";
import VaultItemCreate from "./pages/VaultItemCreate";
import { Toaster } from "./components/ui/toaster";
import Settings from "./pages/Settings";
import PremiumFeatures from "./pages/PremiumFeatures";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vault"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Vault />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vault/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaultItemCreate />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vault/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaultItemDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EmergencyContacts />
                  </Layout>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FileUpload />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StripePayment />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ActivityLogs />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Layout>
                    <AdminAudit />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vault"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Vault />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vault/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaultItemCreate />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vault/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VaultItemDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FileUpload />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StripePayment />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ActivityLogs />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Layout>
                    <AdminAudit />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/premium"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PremiumFeatures />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
