import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Obtener la lista de libros
export const getBooks = async () => {
    return axios.get(`${API_URL}/books`);
};

// Agregar un nuevo libro
export const addBook = async (book, token) => {
    return axios.post(`${API_URL}/books`, book, {
        headers: {
            Authorization: `Bearer ${token}`  // Agrega el token para proteger la ruta
        }
    });
};

// Editar un libro
export const updateBook = async (id, book, token) => {
    return axios.put(`${API_URL}/books/${id}`, book, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Eliminar un libro
export const deleteBook = async (id, token) => {
    return axios.delete(`${API_URL}/books/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
