import * as express from "express"

import { booksRouter } from "./features/books"

const app = express()
const port = 9666

app.get("/", (req, res) => res.send("It's a book library CRUD server"))

app.use("/books", booksRouter)

app.listen(port, () => {
  console.log(`backend-crud listening on port ${port}`)
})
