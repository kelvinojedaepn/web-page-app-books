import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import appFirebase from '../firebaseConfig'; // Configuración de Firebase

const auth = getAuth(appFirebase);

const LoginAdmin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Para la redirección

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                const user = result.user;
                onLogin(user);

                // Verificar si es el administrador por correo
                if (user.email === 'admin@admin.com') {
                    navigate('/admin');  // Redirigir al panel de administración
                } else {
                    setError('Acceso denegado. Solo el administrador puede acceder.');
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
                setError('Error al iniciar sesión. Verifique las credenciales.');
            });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión como Administrador</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Correo electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
};

export default LoginAdmin;
