import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Book {
  name: string,
  description: string,
  author: string,
  createdDate: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public books: Book[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getBooks();
  }

  addBookButton(e: Event) {
    this.books.push({ name: "add book", description: "add book desciption", author: "book author", createdDate: this.getDate() })
  }
  rmBookButton(e: Event) {
    this.books.pop()
  }
  getDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    let mmStr = ""
    let ddStr = ""

    if (mm < 10) mmStr = '0' + mm.toString()
    else mmStr = mm.toString();
    if (dd < 10) ddStr = '0' + dd.toString();
    else ddStr = dd.toString();


    return ddStr + '/' + mmStr + '/' + yyyy;
  }

  getBooks() {
    this.http.get<Book[]>('/book').subscribe(
      (result) => {
        this.books = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'booklibrary.client';
}
