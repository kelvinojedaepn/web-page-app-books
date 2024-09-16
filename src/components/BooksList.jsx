import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteBook } from '../services/api';  // Importamos el servicio para eliminar libros

const BooksList = ({ books, onEdit, token, onBookDeleted, searchTerm }) => {
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const booksPerPage = 5;  // Cantidad de libros por página

    // Función para eliminar un libro
    const handleDelete = (id) => {
        deleteBook(id, token)
            .then(() => {
                onBookDeleted();  // Llamamos a onBookDeleted para actualizar la lista después de eliminar
            })
            .catch(error => console.error('Error al eliminar libro:', error));
    };

    // Filtrar libros según el término de búsqueda
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Obtener libros para la página actual (de la lista filtrada)
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    // Función para paginación
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Libros</h1>

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 border-b">Título</th>
                    <th className="py-2 px-4 border-b">Autor</th>
                    <th className="py-2 px-4 border-b">Año</th>
                    <th className="py-2 px-4 border-b">Género</th>
                    <th className="py-2 px-4 border-b">Idioma</th>
                    <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {currentBooks.map((book) => (
                    <tr key={book.id} className="border-b">
                        <td className="py-2 px-4 border-b">{book.title}</td>
                        <td className="py-2 px-4 border-b">{book.author}</td>
                        <td className="py-2 px-4 border-b">{book.year}</td>
                        <td className="py-2 px-4 border-b">{book.genre}</td>
                        <td className="py-2 px-4 border-b">{book.language}</td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                            <Link
                                to={`/edit/${book.id}`}
                                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                                onClick={() => onEdit(book)}
                            >
                                Editar
                            </Link>
                            <button
                                onClick={() => handleDelete(book.id)}
                                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`py-2 px-4 rounded ${
                        currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Anterior
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={indexOfLastBook >= filteredBooks.length}
                    className={`py-2 px-4 rounded ${
                        indexOfLastBook >= filteredBooks.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default BooksList;
