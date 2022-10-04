import * as bodyParser from "body-parser"
import * as express from "express"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/lib/function"

import { addBook, deleteBook, getBooks, updateBook } from "../../database"

export const booksRouter = express.Router()

booksRouter.get("/:id?", (req, res) => {
  return res.send(getBooks(req.params.id))
})

booksRouter.post("/", bodyParser.json(), (req, res) => {
  return pipe(
    addBook(req.body),
    E.fold(
      (err) => res.send(err.msg).status(400),
      (book) => res.send(book).status(201)
    )
  )
})

booksRouter.delete("/:id", (req, res) => {
  return pipe(
    deleteBook(req.params.id),
    E.fold(
      () => res.send("Not found").status(304),
      (id) => res.send(`Book deleted: "${id}"`)
    )
  )
})

booksRouter.put("/:id", bodyParser.json(), (req, res) => {
  console.log(req.body)
  return pipe(
    updateBook(req.params.id, req.body),
    E.fold(
      (msg) => {
        switch (msg.type) {
          default:
            return res.send(`Server error, please try again later.`).status(500)
          case "BAD_REQUEST":
            return res.send(`Bad request`).status(400)
          case "NOT_FOUND":
            return res
              .send(`Resource not found: "${req.params.id}"`)
              .status(404)
        }
      },
      (result) => res.send(result).status(200)
    )
  )
})
