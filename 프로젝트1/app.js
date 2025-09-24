const express = require('express');
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: '모던 자바스크립트 Deep Dive', author: '이웅모', publisher: '위키북스', publication_date: '2020-09-24', isbn: '9791158392239', pages: 1080 },
  { id: 2, title: '혼자 공부하는 컴퓨터 구조 + 운영체제', author: '강민철', publisher: '한빛미디어', publication_date: '2022-01-03', isbn: '9791162245525', pages: 596 }
];
let nextId = 3;

app.get('/books', (req, res) => {
  res.status(200).json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('해당 ID의 책을 찾을 수 없습니다.');
  res.status(200).json(book);
});

app.post('/books', (req, res) => {
  const { title, author, publisher, publication_date, isbn, pages } = req.body;
  if (!title || !author) return res.status(400).send('제목과 저자는 필수 항목입니다.');

  const newBook = {
    id: nextId++,
    title,
    author,
    publisher,
    publication_date,
    isbn,
    pages
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('해당 ID의 책을 찾을 수 없습니다.');

  const { title, author, publisher, publication_date, isbn, pages } = req.body;
  if (!title || !author) return res.status(400).send('제목과 저자는 필수 항목입니다.');

  book.title = title;
  book.author = author;
  book.publisher = publisher;
  book.publication_date = publication_date;
  book.isbn = isbn;
  book.pages = pages;

  res.status(200).json(book);
});

app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).send('해당 ID의 책을 찾을 수 없습니다.');

  books.splice(bookIndex, 1);
  res.status(204).send();
});

const port = 3000;
app.listen(port, () => console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`));