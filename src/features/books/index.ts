import { flow, pipe } from "fp-ts/lib/function"
import * as D from "io-ts/Decoder"

export { booksRouter } from "./routes"

const thisYear = new Date().getFullYear()

const YearD = pipe(
  D.number,
  D.parse((n) =>
    n % 2 === 0 && n <= thisYear
      ? D.success(n)
      : D.failure(n, `Expected an integer less than or equal to ${thisYear}`)
  )
)

export const ID = pipe(
  D.string,
  D.parse((s) =>
    !!s.match(/^[A-Za-z0-9_-]{21,21}$/)
      ? D.success(s)
      : D.failure(s, `Expected a string of 21 characters (A-Za-z0-9_-)`)
  )
)

export type ID = D.TypeOf<typeof ID>

export const NewBook = D.struct({
  title: D.string,
  author: D.struct({
    fname: D.string,
    lname: D.string,
  }),
  publisher: D.string,
  releaseYear: YearD,
})

export type NewBook = D.TypeOf<typeof NewBook>

export const Book = pipe(NewBook, D.intersect(D.struct({ id: ID })))

export type Book = D.TypeOf<typeof Book>
