import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Importamos Link para el botón de navegación
import appFirebase from '../firebaseConfig';

const auth = getAuth(appFirebase);

const Login = ({ onLogin, onLogout }) => {
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(result => {
                setUser(result.user);
                onLogin(result.user);  // Llamamos al callback para notificar al padre
            })
            .catch(error => console.error('Error al iniciar sesión:', error));
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
                onLogout();  // Notificamos al padre que el usuario cerró sesión
            })
            .catch(error => console.error('Error al cerrar sesión:', error));
    };

    return (
        <div className="bg-gray-100">
            {user ? (
                <div className="p-4 flex justify-between items-center bg-gray-100">
                    {/* Parte izquierda: Nombre y foto del usuario */}
                    <div className="flex items-center space-x-3">
                        <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                        <p className="text-lg font-semibold">Bienvenido, {user.displayName}</p>
                    </div>

                    {/* Parte derecha: Gestión de Libros y Cerrar sesión */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/user/books"
                            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Gestión de Libros
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition duration-300"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            ) : (
                // Pantalla completa de inicio de sesión
                <div className="flex min-h-screen">
                    <div className="w-1/2 flex flex-col items-center justify-center p-6">
                        <h1 className="text-3xl font-bold mb-6">Inicia sesión con tu cuenta de Google</h1>
                        <button
                            onClick={handleLogin}
                            className="bg-blue-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                        >
                            <FaGoogle className="mr-2 text-white" size={24} />
                            Iniciar sesión con Google
                        </button>
                    </div>
                    <div
                        className="w-1/2 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1720192861639-1524439fc166?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
                    />
                </div>
            )}
        </div>
    );
};

export default Login;
