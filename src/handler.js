const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  let finished

  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
}

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books: books.map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  }
})

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    } else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const getBookHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (reading === '1') {
    const matchingRead = books.filter((book) => book.reading === true)

    if (matchingRead.length > 0) {
      return {
        status: 'success',
        data: {
          books: matchingRead.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      }
    }
  } else if (reading === '0') {
    const matchingRead = books.filter((book) => book.reading === false)

    if (matchingRead.length > 0) {
      return {
        status: 'success',
        data: {
          books: matchingRead.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      }
    }
  }

  if (finished === '1') {
    const matchingFin = books.filter((book) => book.finished === true)

    if (matchingFin.length > 0) {
      return {
        status: 'success',
        data: {
          books: matchingFin.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      }
    }
  } else if (finished === '0') {
    const matchingFin = books.filter((book) => book.finished === false)

    if (matchingFin.length > 0) {
      return {
        status: 'success',
        data: {
          books: matchingFin.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      }
    }
  }

  if (name != null) {
    const lowerCaseName = name.toLowerCase()

    const matchingName = books.filter((book) => book.name.toLowerCase().includes(lowerCaseName))

    if (matchingName.length > 0) {
      return {
        status: 'success',
        data: {
          books: matchingName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      }
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }

  return {
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, getBookHandler }
