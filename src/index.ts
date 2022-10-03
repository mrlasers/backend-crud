import * as express from "express"

const app = express()
const port = 9666

app.get("/", (req, res) => res.send("Hello, World!"))

app.listen(port, () => {
  console.log(`backend-crud listening on port ${port}`)
})
