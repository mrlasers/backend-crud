import * as bodyParser from "body-parser"
import * as express from "express"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/lib/function"
import { nanoid } from "nanoid"

import { Book, NewBook } from "./features/books"

const app = express()
const port = 9666

app.get("/", (req, res) => res.send("Hello, World!"))

type Schema = {
  books: Book[]
}

const fakeDb: Schema = {
  books: [
    {
      id: "123",
      title: "Hello, World!: An Interactive Guide to Computers",
      author: {
        fname: "John",
        lname: "Boyd",
      },
      publisher: "John Boy-ee, LLC",
      releaseYear: 2021,
    },
    {
      id: "456",
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

app.get("/books/:id?", (req, res) => {
  const result = req.params.id
    ? fakeDb.books.find((book) => book.id === req.params.id)
    : fakeDb.books

  return res.send(result || [])
})

app.post("/books", bodyParser.json(), (req, res) => {
  return pipe(
    req.body,
    NewBook.decode,
    E.map((newBook) => ({
      ...newBook,
      id: nanoid(),
    })),
    E.fold(
      (err) => res.send(err).status(400),
      (book) => {
        fakeDb.books = [...fakeDb.books, book]
        return res.send(fakeDb.books)
      }
    )
  )

  // res.send("Thanks for posting!")
})

app.listen(port, () => {
  console.log(`backend-crud listening on port ${port}`)
})
