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

type ErrorMsg = { _tag: "ERROR"; code: number; msg: string }

function error(code: number, msg: string) {
  return (): ErrorMsg => ({ _tag: "ERROR", code, msg })
}

export function addBook(newBook: any): E.Either<ErrorMsg, Book> {
  return pipe(
    newBook,
    NewBook.decode,
    E.mapLeft(error(400, "Bad Request")),
    E.map(
      flow(addBookId(nanoid()), (book) => {
        fakeDb.books = [...fakeDb.books, book]
        return book
      })
    )
  )
}

export function getBooks(bookId?: ID): Book[] {
  return pipe(
    O.fromNullable(bookId),
    O.map(
      flow((id) => fakeDb.books.find((book) => book.id === id), O.fromNullable)
    ),
    O.fold(
      () => fakeDb.books,
      O.fold(
        () => [],
        (book) => [book]
      )
    )
  )
}
