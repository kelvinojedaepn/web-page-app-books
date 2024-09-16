import React, {useState, useEffect} from 'react';
import {Link, Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import BooksList from './BooksList';
import BookForm from './BookForm';
import SearchBar from './SearchBar';
import {getBooks} from '../services/api';  // Servicio para cargar libros
import {Bar} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';  // Para las estadísticas
import {getAuth, signOut} from 'firebase/auth';

// Registrar componentes de Chart.js
Chart.register(...registerables);

const AdminDashboard = ({token}) => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    // Cargar los libros cuando se monta el componente
    useEffect(() => {
        getBooks()
            .then((response) => {
                if (response.data) {
                    setBooks(response.data);  // Asegurarse de que los libros se están cargando correctamente
                }
            })
            .catch((error) => {
                console.error('Error al cargar libros:', error);
            });
    }, []);

    // Función para seleccionar un libro y editarlo
    const handleEditBook = (book) => {
        setSelectedBook(book);
    };

    // Función que será llamada cuando un libro sea agregado, editado o eliminado
    const handleBookSavedOrDeleted = () => {
        getBooks()
            .then((response) => setBooks(response.data))
            .catch((error) => console.error('Error al actualizar libros:', error));
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/login-admin');  // Redirigir al login de administrador
            })
            .catch(error => console.error('Error al cerrar sesión:', error));
    };

    // Datos de estadísticas (libros por género)
    const calculateBooksByGenre = () => {
        const genreCounts = books.reduce((acc, book) => {
            acc[book.genre] = (acc[book.genre] || 0) + 1;
            return acc;
        }, {});
        return genreCounts;
    };

    const genreCounts = calculateBooksByGenre();
    const chartData = {
        labels: Object.keys(genreCounts),
        datasets: [
            {
                label: 'Cantidad de libros por género',
                data: Object.values(genreCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Barra de navegación superior fija */}
            <nav className="bg-blue-500 text-white p-4 fixed w-full top-0 shadow-md z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Panel de Administración</h1>
                    <div className="space-x-4 flex items-center">
                        <Link to="/admin/books"
                              className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100 transition duration-300">
                            Gestión de Libros
                        </Link>
                        <Link to="/admin/stats"
                              className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100 transition duration-300">
                            Estadísticas
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenido debajo de la barra fija */}
            <div className="container mx-auto p-6 pt-20">
                <Routes>
                    {/* Redirigir a la gestión de libros por defecto */}
                    <Route path="/admin" element={<Navigate to="/admin/books"/>}/>

                    {/* Gestión de libros */}
                    <Route
                        path="books"
                        element={
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="w-2/3">
                                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                                    </div>

                                    <Link
                                        to="/admin/new"
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Agregar nuevo libro
                                    </Link>
                                </div>
                                <BooksList
                                    books={books}
                                    onEdit={handleEditBook}
                                    token={token}
                                    onBookDeleted={handleBookSavedOrDeleted}
                                    searchTerm={searchTerm}
                                />
                            </div>
                        }
                    />

                    {/* Formulario de libros para editar/agregar */}
                    <Route
                        path="new"
                        element={<BookForm token={token} onBookSaved={handleBookSavedOrDeleted}/>}
                    />
                    <Route
                        path="edit/:id"
                        element={<BookForm token={token} existingBook={selectedBook}
                                           onBookSaved={handleBookSavedOrDeleted}/>}
                    />

                    {/* Estadísticas de libros */}
                    <Route
                        path="stats"
                        element={
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold mb-4">Estadísticas de Libros por Género</h2>
                                <Bar data={chartData} options={chartOptions}/>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
