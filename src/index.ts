import * as express from "express"

import { booksRouter } from "./features/books"

const app = express()
const port = 9666

const html = `
<h1>Book Library CRUD Server</h1>
<p><a href="/books">View all books</a></p>
<p>See source on <a href='https://github.com/mrlasers/backend-crud'>GitHub</a>.</p>
`

app.get("/", (_, res) => res.send(html))

app.use("/books", booksRouter)

app.listen(port, () => {
  console.log(`backend-crud listening on port ${port}`)
})
