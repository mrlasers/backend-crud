import * as bodyParser from "body-parser"
import * as express from "express"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/lib/function"

import { addBook, deleteBook, getBooks } from "../../database"

export const booksRouter = express.Router()

booksRouter.get("/:id?", (req, res) => {
  return res.send(getBooks(req.params.id))
})

booksRouter.post("/", bodyParser.json(), (req, res) => {
  return pipe(
    addBook(req.body),
    E.fold(
      (err) => res.send(err.msg).status(400),
      (book) => res.send(book)
    )
  )
})

booksRouter.delete("/:id", (req, res) => {
  return res.send(deleteBook(req.params.id))
})
