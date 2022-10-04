import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import { nanoid } from "nanoid"

import { Book, BookUpdate, ID, NewBook } from "../features/books"

type FakeDbSchema = {
  books: Book[]
}

// fake db data
const fakeDb: FakeDbSchema = {
  books: [
    {
      id: "ZbCR2WdXkF4OaCpB00Z8d",
      title: "Hello, World!: An Interactive Guide to Computers",
      author: {
        fname: "John",
        lname: "Boyd",
      },
      publisher: "John Boy-ee, LLC",
      releaseYear: 2021,
    },
    {
      id: "9RANMKReRogZ2dVZNL1zo",
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

function updateDbBooks(books: Book[]): void {
  fakeDb.books = books
}

type ErrorMsg =
  | { type: "BAD_REQUEST"; msg?: string }
  | { type: "SERVER_ERROR"; msg?: string }
  | { type: "NOT_FOUND"; msg?: string }

function errorMsg(msg: ErrorMsg): ErrorMsg {
  return msg
}

function addBookId(id: ID) {
  return (newBook: NewBook): Book => {
    return { ...newBook, id }
  }
}

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

export function _getBooks({ getBooks }: { getBooks: () => Book[] }) {
  return (bookId?: ID): E.Either<ErrorMsg, Book[]> => {
    const books = getBooks()

    return pipe(
      O.fromNullable(bookId),
      O.map(flow((id) => books.find((book) => book.id === id), O.fromNullable)),
      O.fold(
        () => E.right(books),
        O.fold(
          () => E.left(errorMsg({ type: "NOT_FOUND" })),
          (book) => E.right([book])
        )
      )
    )
  }
}

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

function _updateBook({
  getBooks,
  callback,
}: {
  getBooks: () => Book[]
  callback: (books: Book[]) => void
}) {
  return ({
    id,
    bookUpdate,
  }: {
    id: ID
    bookUpdate: BookUpdate
  }): E.Either<ErrorMsg, Book[]> => {
    const books = getBooks()

    return pipe(
      bookUpdate,
      BookUpdate.decode,
      E.mapLeft(() => errorMsg({ type: "BAD_REQUEST" })),
      E.chain((update) =>
        Object.keys(update).length
          ? E.right(update)
          : E.left(errorMsg({ type: "BAD_REQUEST" }))
      ),
      E.chain((update) =>
        pipe(
          books.find((book) => book.id === id),
          E.fromNullable(errorMsg({ type: "NOT_FOUND" })),
          E.map((book) => ({ ...book, ...update }))
        )
      ),
      E.map((updatedBook) => {
        callback(
          books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        )

        return [updatedBook]
      })
    )
  }
}

export const addBook = _addBook({
  nextBookId: nanoid,
  getBooks: () => fakeDb.books,
  callback: updateDbBooks,
})
export const getBooks = _getBooks({ getBooks: () => fakeDb.books })
export const updateBook = _updateBook({
  getBooks: () => fakeDb.books,
  callback: updateDbBooks,
})
export const deleteBook = _deleteBook({
  getBooks: () => fakeDb.books,
  callback: updateDbBooks,
})
