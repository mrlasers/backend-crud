import * as bodyParser from "body-parser"
import * as express from "express"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/lib/function"

import { addBook, deleteBook, getBooks } from "./database"
import { Book, ID, NewBook } from "./features/books"

const app = express()
const port = 9666

app.get("/", (req, res) => res.send("Hello, World!"))

app.get("/books/:id?", (req, res) => {
  return res.send(getBooks(req.params.id))
})

app.post("/books", bodyParser.json(), (req, res) => {
  return pipe(
    addBook(req.body),
    E.fold(
      (err) => res.send(err.msg).status(400),
      (book) => res.send(book)
    )
  )
})

app.delete("/books/:id", (req, res) => {
  return res.send(deleteBook(req.params.id))
})

app.listen(port, () => {
  console.log(`backend-crud listening on port ${port}`)
})
