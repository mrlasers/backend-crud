import * as E from "fp-ts/Either"
import { flow, identity, pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import { DecodeError } from "io-ts/Decoder"
import { nanoid } from "nanoid"

import { Book, ID, NewBook } from "../features/books"

type Schema = {
  books: Book[]
}

const fakeDb: Schema = {
  books: [
    {
      id: nanoid(),
      title: "Hello, World!: An Interactive Guide to Computers",
      author: {
        fname: "John",
        lname: "Boyd",
      },
      publisher: "John Boy-ee, LLC",
      releaseYear: 2021,
    },
    {
      id: nanoid(),
      title: "Hello, World! 2: An Even More Interactive Guide to Computers",
      author: {
        fname: "John",
        lname: "Boyd",
      },
      publisher: "John Boy-ee, LLC",
      releaseYear: 2022,
    },
  ],
}

function addBookId(id: ID) {
  return (newBook: NewBook): Book => {
    return { ...newBook, id }
  }
}

type ErrorMsg = { type: "BAD_REQUEST"; msg: string }

export function _addBook({
  nextBookId,
  getBooks,
  callback,
}: {
  nextBookId: () => ID
  // getBooks() in case we want to do some kind of filtering before
  // blindly adding a duplicate or something; the naive approach
  getBooks: () => Book[]
  // do whatever with the updated book array
  callback: (books: Book[]) => void
}) {
  return (newBook: NewBook | any): E.Either<ErrorMsg, Book> =>
    pipe(
      newBook,
      NewBook.decode,
      E.mapLeft((err): ErrorMsg => ({ type: "BAD_REQUEST", msg: String(err) })),
      E.map(
        flow(addBookId(nextBookId()), (book) => {
          callback([...getBooks(), book])
          return book
        })
      )
    )
}

export const addBook = _addBook({
  nextBookId: nanoid,
  getBooks: () => fakeDb.books,
  callback: (books) => {
    fakeDb.books = books
  },
})

export function _getBooks({ getBooks }: { getBooks: () => Book[] }) {
  return (bookId?: ID): Book | Book[] => {
    const books = getBooks()

    return pipe(
      O.fromNullable(bookId),
      O.map(flow((id) => books.find((book) => book.id === id), O.fromNullable)),
      O.fold(
        () => books,
        O.fold(
          () => [],
          (book) => [book]
        )
      )
    )
  }
}

export const getBooks = _getBooks({ getBooks: () => fakeDb.books })

export function _deleteBook({
  getBooks,
  callback,
}: {
  getBooks: () => Book[]
  callback: (book: Book[]) => void
}) {
  return (bookId: string): E.Either<ErrorMsg, ID> => {
    const books = getBooks().filter((book) => book.id !== bookId)

    callback(books)

    return E.right(bookId)
  }
}

export const deleteBook = _deleteBook({
  getBooks: () => fakeDb.books,
  callback: (books) => {
    fakeDb.books = books
  },
})
