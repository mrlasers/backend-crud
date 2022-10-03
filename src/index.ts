import * as express from "express"

const app = express()
const port = 9666

app.get("/", (req, res) => res.send("Hello, World!"))

export type Book = {
  id: string
  title: string
  author: {
    fname: string
    lname: string
  }
  publisher: string
  releaseYear: number
}

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

app.listen(port, () => {
  console.log(`backend-crud listening on port ${port}`)
})
