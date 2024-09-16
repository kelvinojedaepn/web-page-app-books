import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Login from './components/Login';
import BooksList from './components/BooksList';
import BookForm from './components/BookForm';
import SearchBar from './components/SearchBar';  // Importamos el componente SearchBar
import {getBooks} from './services/api';

function App() {
    const [user, setUser] = useState(null);  // Usuario autenticado
    const [token, setToken] = useState('');  // Token JWT para peticiones autenticadas
    const [books, setBooks] = useState([]);  // Lista de libros
    const [selectedBook, setSelectedBook] = useState(null); // Libro seleccionado para editar
    const [searchTerm, setSearchTerm] = useState('');  // Estado para el término de búsqueda

    // Función para manejar el inicio de sesión y obtener el token
    const handleLogin = (user) => {
        setUser(user);
        user.getIdToken().then((token) => setToken(token));  // Obtener token JWT
    };

    const handleLogout = () => {
        setUser(null);
        setToken('');  // Limpiar el token cuando el usuario cierra sesión
    };

    // Función para cargar libros desde el backend
    const loadBooks = () => {
        getBooks()
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error al obtener libros:', error));
    };

    // Cargar libros al montar el componente
    useEffect(() => {
        loadBooks();
    }, []);

    // Función que será llamada cuando un libro sea agregado, editado o eliminado
    const handleBookSavedOrDeleted = () => {
        loadBooks();  // Vuelve a cargar la lista de libros
    };

    // Función para seleccionar un libro y editarlo
    const handleEditBook = (book) => {
        setSelectedBook(book);  // Guardar el libro a editar
    };

    return (
        <Router>
            <div>
                <Login onLogin={handleLogin} onLogout={handleLogout}/>

                {user && (
                    <div>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <div className="container mx-auto p-6">
                                        {/* Contenedor para el botón y la barra de búsqueda */}
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="w-2/3">
                                                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                                            </div>

                                            <Link
                                                to="/new"
                                                className={'inline-block w-1/10 bg-blue-500 text-white py-2 px-4' +
                                                    ' rounded-md ' +
                                                    'hover:bg-blue-600 transition duration-300'}
                                            >
                                                Agregar nuevo libro
                                            </Link>
                                        </div>

                                        {/* Lista de libros filtrada */}
                                        <BooksList
                                            books={books}
                                            onEdit={handleEditBook}
                                            token={token}
                                            onBookDeleted={handleBookSavedOrDeleted}
                                            searchTerm={searchTerm}  // Pasamos el término de búsqueda
                                        />
                                    </div>
                                }
                            />
                            <Route
                                path="/edit/:id"
                                element={
                                    <BookForm
                                        token={token}
                                        existingBook={selectedBook}
                                        onBookSaved={handleBookSavedOrDeleted}
                                    />
                                }
                            />
                            <Route
                                path="/new"
                                element={<BookForm token={token} onBookSaved={handleBookSavedOrDeleted}/>}
                            />
                        </Routes>
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;
