# backend-crud

A little CRUD backend for managing a book library.

## API

### Show All Books

Get the details of all books in the library

**URL**: `/books`

**METHOD**: `GET`

**Auth required**: NO

**Permissions required**: None

#### Success Response

**Code**: `200 OK`

**Content examples**

```json
[
  {
    "id": "_ZVvgx4abiefTu9YmoSPa",
    "title": "Hello, World!: An Interactive Guide to Computers",
    "author": {
      "fname": "John",
      "lname": "Boyd"
    },
    "publisher": "John Boy-ee, LLC",
    "releaseYear": 2021
  },
  {
    "id": "fS6yDOneuWDGuK_kVqDzZ",
    "title": "Hello, World! 2: An Even More Interactive Guide to Computers",
    "author": {
      "fname": "John",
      "lname": "Boyd"
    },
    "publisher": "John Boy-ee, LLC",
    "releaseYear": 2022
  }
]
```

### Show a Book

Get the details of all books in the library

**URL**: `/books/{id}`

**METHOD**: `GET`

**Auth required**: NO

**Permissions required**: None

#### Success Response

**Code**: `200 OK`

**Content examples**

For a Book with `ID _ZVvgx4abiefTu9YmoSPa` that exists in the library.

```json
[
  {
    "id": "_ZVvgx4abiefTu9YmoSPa",
    "title": "Hello, World!: An Interactive Guide to Computers",
    "author": {
      "fname": "John",
      "lname": "Boyd"
    },
    "publisher": "John Boy-ee, LLC",
    "releaseYear": 2021
  }
]
```

For a Book with `ID 83QEoUa6W-Q9ctASkhKaQ` that does not exist in the library.

```json
[]
```
