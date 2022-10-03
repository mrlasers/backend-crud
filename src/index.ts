import * as bodyParser from "body-parser"
import * as express from "express"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/lib/function"

import { addBook, deleteBook, getBooks } from "./database"
import { Book, booksRouter, ID, NewBook } from "./features/books"

const app = express()
const port = 9666

app.get("/", (req, res) => res.send("It's a book library CRUD server"))

app.use("/books", booksRouter)

app.listen(port, () => {
  console.log(`backend-crud listening on port ${port}`)
})
