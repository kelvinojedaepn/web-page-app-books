import React, {useState, useEffect} from 'react';
import {addBook, updateBook} from '../services/api';
import {useNavigate} from 'react-router-dom';

const genres = ['Ficción', 'No ficción', 'Misterio', 'Romance', 'Ciencia Ficción', 'Fantasía', 'Historia', 'Biografía'];
const languages = ['Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Japonés', 'Chino'];

const BookForm = ({token, existingBook, onBookSaved}) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());  // Por defecto, el año actual
    const [genre, setGenre] = useState(genres[0]);  // Seleccionamos el primer género por defecto
    const [language, setLanguage] = useState(languages[0]);  // Seleccionamos el primer idioma por defecto
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    // Llenamos el formulario si es edición de un libro existente
    useEffect(() => {
        if (existingBook) {
            setTitle(existingBook.title);
            setAuthor(existingBook.author);
            setYear(existingBook.year);
            setGenre(existingBook.genre);
            setLanguage(existingBook.language);
            setDescription(existingBook.description);
        }
    }, [existingBook]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const book = {title, author, year, genre, language, description};

        if (existingBook) {
            // Si estamos editando un libro existente
            updateBook(existingBook.id, book, token)
                .then(() => {
                    onBookSaved();  // Actualizamos la lista de libros
                    navigate('/');   // Navegamos de vuelta a la lista de libros
                })
                .catch(error => console.error('Error al actualizar libro:', error));
        } else {
            // Si estamos creando un nuevo libro
            addBook(book, token)
                .then(() => {
                    onBookSaved();  // Actualizamos la lista de libros
                    navigate('/');   // Navegamos de vuelta a la lista de libros
                })
                .catch(error => console.error('Error al agregar libro:', error));
        }
    };

    // Generar el rango de años (del 1900 al año actual)
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= 1900; i--) {
            years.push(i);
        }
        return years;
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">{existingBook ? 'Editar Libro' : 'Nuevo Libro'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Título</label>
                    <input
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Autor</label>
                    <input
                        type="text"
                        placeholder="Autor"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Año</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {generateYears().map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                                {yearOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Género</label>
                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {genres.map((genreOption) => (
                            <option key={genreOption} value={genreOption}>
                                {genreOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Idioma</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {languages.map((languageOption) => (
                            <option key={languageOption} value={languageOption}>
                                {languageOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">Descripción</label>
                    <textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    {existingBook ? 'Actualizar Libro' : 'Agregar Libro'}
                </button>
            </form>
        </div>
    );
};

export default BookForm;
