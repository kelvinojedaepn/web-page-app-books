import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LoginAdmin from './components/LoginAdmin';
import UserDashboard from './components/UserDashboard';  // Importamos UserDashboard
import AdminDashboard from './components/AdminDashboard'; // Importamos AdminDashboard
import BookForm from './components/BookForm';

function App() {
    const [user, setUser] = useState(null);  // Usuario autenticado
    const [token, setToken] = useState('');  // Token JWT para peticiones autenticadas
    const [selectedBook, setSelectedBook] = useState(null); // Libro seleccionado para editar

    // Función para manejar el inicio de sesión y obtener el token
    const handleLogin = (user) => {
        setUser(user);
        user.getIdToken().then((token) => setToken(token));  // Obtener token JWT
    };

    const handleLogout = () => {
        setUser(null);
        setToken('');  // Limpiar el token cuando el usuario cierra sesión
    };

    return (
        <Router>
            <Routes>
                {/* Ruta de login para usuarios convencionales */}
                <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} onLogout={handleLogout} />}
                />

                {/* Ruta de login para administrador */}
                <Route
                    path="/login-admin"
                    element={<LoginAdmin onLogin={handleLogin} />}
                />

                {/* Panel de administrador */}
                <Route
                    path="/admin/*"
                    element={
                        user && user.email === 'admin@admin.com' ? (
                            <AdminDashboard token={token} />
                        ) : (
                            <Navigate to="/login-admin" />
                        )
                    }
                />

                {/* Panel de usuario convencional */}
                <Route
                    path="/user/*"
                    element={
                        user && user.email !== 'admin@admin.com' ? (
                            <UserDashboard token={token} user={user} handleLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Gestión de libros directamente en "/user/books" */}
                <Route
                    path="/user/books"
                    element={
                        user && user.email !== 'admin@admin.com' ? (
                            <UserDashboard token={token} user={user} handleLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Rutas para el formulario de creación/edición de libros */}
                <Route
                    path="/new"
                    element={
                        user ? (
                            <BookForm token={token} onBookSaved={() => window.history.back()} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/edit/:id"
                    element={
                        user ? (
                            <BookForm token={token} existingBook={selectedBook} onBookSaved={() => window.history.back()} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
