# backend-crud

A little CRUD backend for managing a book library.

## API

### Show All Books

Returns JSON array of all books in the library.

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

Returns JSON array of book if found by `id`, otherwise empty array.

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

### Add a new book

Adds new book to library and returns array of new book.

**URL**: `/books`

**METHOD**: `POST`

**Auth required**: NO

**Permissions required**: None

#### Success Response

**Code**: `200 OK`

**Request body example**

```json
{
  "title": "My Cool Book",
  "author": {
    "fname": "My",
    "lname": "Name"
  },
  "publisher": "MyCoolBookPublisher.xyz",
  "releaseYear": 2049
}
```

### Update a book

Updates an existing book and returns array of updated book.

**URL**: `/books/{id}`

**METHOD**: `PUT`

**Auth required**: NO

**Permissions required**: None

**Request body examples**

```json
{
  "title": "My Coolest Book"
}
```

```json
{
  "author": {
    "fname": "My",
    "lname": "Name"
  }
}
```

```json
{
  "releaseYear": 2019
}
```

### Delete a Book

Removes a book from the library and returns `id` of removed book.

**URL**: `/books/{id}`

**METHOD**: `DELETE`

**Auth required**: NO

**Permissions required**: None

#### Success Response

**Code**: `200 OK`
