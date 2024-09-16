import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';  // Usamos Outlet para las subrutas
import BooksList from './BooksList';
import SearchBar from './SearchBar';
import { getBooks } from '../services/api';  // Servicio para cargar libros

const UserDashboard = ({ token, user, handleLogout }) => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

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

    return (
        <div className="min-h-screen flex flex-col">
            {/* Barra de navegación fija */}
            <nav className="bg-blue-500 text-white p-4 fixed w-full top-0 shadow-md z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Bienvenido, {user.displayName}</h1>
                    <div className="space-x-4 flex items-center">
                        {/* Botón de Gestión de Libros */}
                        <Link to="/user/books" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100 transition duration-300">
                            Gestión de Libros
                        </Link>
                        {/* Botón de Cerrar sesión */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenido debajo de la barra fija */}
            <div className="container mx-auto p-6 pt-20">
                <div className="flex justify-between items-center mb-4">
                    <div className="w-2/3">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                    <Link
                        to="/new"
                        className="inline-block w-1/10 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Agregar nuevo libro
                    </Link>
                </div>

                {/* Aquí se renderizan las rutas secundarias */}
                <Outlet />

                {/* Renderizamos la lista de libros */}
                <BooksList
                    books={books}
                    onEdit={handleEditBook}
                    token={token}
                    onBookDeleted={handleBookSavedOrDeleted}
                    searchTerm={searchTerm}
                />
            </div>
        </div>
    );
};

export default UserDashboard;
