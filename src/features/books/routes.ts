import * as bodyParser from "body-parser"
import * as express from "express"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/lib/function"

import { addBook, deleteBook, getBooks, updateBook } from "../../database"

export const booksRouter = express.Router()

booksRouter.get("/:id?", (req, res) =>
  pipe(
    getBooks(req.params.id),
    E.fold(
      (msg) => res.status(404).send(`Resource not found: "${req.params.id}`),
      (found) => res.send(found)
    )
  )
)

booksRouter.post("/", bodyParser.json(), (req, res) =>
  pipe(
    addBook(req.body),
    E.fold(
      (err) => res.status(400).send(err.msg),
      (book) => res.status(201).send(book)
    )
  )
)

booksRouter.delete("/:id", (req, res) =>
  pipe(
    deleteBook(req.params.id),
    E.fold(
      () => res.status(304).send("Not found"),
      (id) => res.send(id)
    )
  )
)

booksRouter.put("/:id", bodyParser.json(), (req, res) =>
  pipe(
    updateBook({ id: req.params.id, bookUpdate: req.body }),
    E.fold(
      (msg) => {
        switch (msg.type) {
          default:
            return res.status(500).send(`Server error, please try again later.`)
          case "BAD_REQUEST":
            return res.status(400).send(`Bad request`)
          case "NOT_FOUND":
            return res
              .status(404)
              .send(`Resource not found: "${req.params.id}"`)
        }
      },
      (result) => res.status(200).send(result)
    )
  )
)
