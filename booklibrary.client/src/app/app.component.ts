import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef} from '@angular/core';

class Book {
  bookid: string = ""
  name: string = ""
  description: string = ""
  author: string = ""
  createdDate: string = ""
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('tableBookBody') tableBookBody?: ElementRef
  @ViewChildren('rowInputBox') rowInputBox!: QueryList<ElementRef>
  //private currentTableBody : HTMLTableElement | null = document.querySelector("#tableBookBody")
  public books: Book[] = [];
  private bookPostData: Book
  constructor(private http: HttpClient) {
    this.bookPostData = new Book()
  }

  ngOnInit() {
    this.getBooks();
  }

  initBookPostData(event : KeyboardEvent) {
    if (event.target !== null) {
      let currrow = (<HTMLElement>(<HTMLElement>event.target).parentNode).parentNode
      if (currrow !== null) {
        let arr: Element[] = Array.from(currrow.children)
        let nameInput = (<HTMLInputElement>arr[0].firstChild).value
        let descriptionInput = (<HTMLInputElement>arr[1].firstChild).value
        let authorInput = (<HTMLInputElement>arr[2].firstChild).value
        let createdDate = (<HTMLInputElement>arr[3].firstChild).value
        this.bookPostData.name = nameInput
        this.bookPostData.description = descriptionInput
        this.bookPostData.author = authorInput
        this.bookPostData.createdDate = createdDate
      }
    }
  }
  postAddBook() {
    this.http.post<any>('/addbook', this.bookPostData).subscribe((res) => console.log(res), (err) => console.log(err))
    console.log("data posted: ", this.bookPostData)
  }

  makeEditableTableRow() {
    let tableRow = document.createElement("tr")
    let currTableBookDomNode = this.tableBookBody?.nativeElement
    if (currTableBookDomNode !== null) {
      let tabledatasCopy = currTableBookDomNode.firstElementChild.cloneNode(true)
      let tabledatas: HTMLTableCellElement[] = Array.from(tabledatasCopy.children)
      if (tabledatas !== null) {
        if (tabledatas.length !== 0) {
          for (let td of tabledatas) {
            let inputBox = document.createElement("input")
            inputBox.type = "text"
            td.innerText = ""
            td.appendChild(inputBox)
            td.addEventListener("keypress", (event) => {
              if (event.key == "Enter") {
                event.preventDefault()
                this.initBookPostData(event)
                this.postAddBook()
              }
            })
            tableRow.appendChild(td)
          }
        }
      }
    }
    this.tableBookBody?.nativeElement.appendChild(tableRow)
  }
  addBookButton() {
    this.makeEditableTableRow()
    //this.books.push({ name: "add book", description: "add book desciption", author: "book author", createdDate: this.getDate() })
  }
  getBookToRemove() {
    let bookToRemove = {}
    if (this.rowInputBox != undefined) {
      for (const ele of this.rowInputBox) {
        let curr_checkbox_inrow = ele.nativeElement.firstChild
        if (curr_checkbox_inrow.checked) {
          let curr_tablerow = curr_checkbox_inrow.parentNode.parentNode
          let childs = curr_tablerow.children
          bookToRemove = { bookid: childs.item(1).innerText,  name: childs.item(2).innerText, description: childs.item(3).innerText, author: childs.item(4).innerText, createdDate: childs.item(5).innerText }
          break
        }
      }
    }
    return bookToRemove
  }
  rmBookButton() {
    //let bookToDelete = { name: "", description: "", author: "", createdDate: "" }
    let bookToDelete = this.getBookToRemove()
    this.http.delete<any>("/removebook", {body: bookToDelete}).subscribe((res) => console.log(res), (err) => console.log(err))
    console.log("data deleted: ", bookToDelete)
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
