import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Vehiculos from "../pages/Vehiculos";
import Cotizaciones from "../pages/Cotizaciones";
import Facturas from "../pages/Facturas";
import Condiciones from "../pages/Condiciones";
import Implementaciones from "../pages/Implementaciones";
import ConfiguracionEmpresa from "../pages/ConfiguracionEmpresa";
import Usuarios from "../pages/Usuarios";
import Roles from "../pages/Roles";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../layouts/DashboardLayout";
import Inicio from "../pages/Inicio";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Secretaria", "Operador"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Secretaria"]}>
            <Layout>
              <Clientes />
            </Layout>
          </ProtectedRoute>
        }
      />
<Route
  path="/roles"
  element={
    <ProtectedRoute rolesPermitidos={["Administrador"]}>
      <Layout>
        <Roles />
      </Layout>
    </ProtectedRoute>
  }
/>
      <Route
        path="/vehiculos"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Operador"]}>
            <Layout>
              <Vehiculos />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cotizaciones"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Secretaria"]}>
            <Layout>
              <Cotizaciones />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/facturas"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Secretaria"]}>
            <Layout>
              <Facturas />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/condiciones"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador"]}>
            <Layout>
              <Condiciones />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/implementaciones"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador"]}>
            <Layout>
              <Implementaciones />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador"]}>
            <Layout>
              <Usuarios />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/configuracion-empresa"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador"]}>
            <Layout>
              <ConfiguracionEmpresa />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}