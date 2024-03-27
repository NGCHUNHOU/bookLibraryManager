import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef} from '@angular/core';

class Book {
  bookid: number = 0
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
  @ViewChild('infoBox') infoBox?: ElementRef
  @ViewChild('infoMsg') infoMsg?: ElementRef
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

  closeModal(event: Event) {
    let currDialog = (<HTMLDialogElement>(<HTMLElement>(<HTMLElement>event.target).parentNode).parentNode)
    currDialog.close()
    window.location.reload()
  }

  initBookPostData(event : KeyboardEvent) {
    if (event.target !== null) {
      let currrow = (<HTMLElement>(<HTMLElement>event.target).parentNode).parentNode
      if (currrow !== null) {
        let arr: Element[] = Array.from(currrow.children)
        //let bookidInput = (<HTMLInputElement>arr[1].firstChild).value
        let nameInput = (<HTMLInputElement>arr[2].firstChild).value
        let descriptionInput = (<HTMLInputElement>arr[3].firstChild).value
        let authorInput = (<HTMLInputElement>arr[4].firstChild).value
        let createdDate = (<HTMLInputElement>arr[5].firstChild).value
        this.bookPostData.name = nameInput
        this.bookPostData.description = descriptionInput
        this.bookPostData.author = authorInput
        this.bookPostData.createdDate = createdDate
      }
    }
  }
  postAddBook() {
    //this.http.post<any>('/addbook', this.bookPostData).subscribe((res) => console.log(res), (err) => console.log(err))
    this.http.post<any>('/addbook', this.bookPostData).subscribe({
      error: (err) => {
        console.log(err)
      },
      next: (res) => {
        console.log("response",res)
        let addMessageBox = this.infoBox?.nativeElement
        let addMessage = this.infoMsg?.nativeElement
        addMessage.innerText = "the row is successfully added into the table"
        addMessageBox.showModal()
      },
    })
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
  getBook() {
    let curr_tablerow = null
      for (const ele of this.rowInputBox) {
        let curr_checkbox_inrow = ele.nativeElement.firstChild
        if (curr_checkbox_inrow.checked) {
          curr_tablerow = curr_checkbox_inrow.parentNode.parentNode
          return curr_tablerow
        }
      }
      return null
  }
  putEditBook(targetRow : KeyboardEvent) {
    let currentInputNode = targetRow.target
    let currentRow = null
    if (currentInputNode !== null) {
      currentRow = (<HTMLElement>(<HTMLElement>currentInputNode).parentNode).parentNode
      if (currentRow !== null) {
        let childs = <HTMLCollection>currentRow.children
        let bookToEdit = new Book()
        bookToEdit.bookid = parseInt(<string>(<HTMLInputElement>(<HTMLElement>childs.item(1)).firstChild).value)
        bookToEdit.name = (<HTMLInputElement>(<HTMLElement>childs.item(2)).firstChild).value
        bookToEdit.description = (<HTMLInputElement>(<HTMLElement>childs.item(3)).firstChild).value
        bookToEdit.author = (<HTMLInputElement>(<HTMLElement>childs.item(4)).firstChild).value
        bookToEdit.createdDate = (<HTMLInputElement>(<HTMLElement>childs.item(5)).firstChild).value
        debugger
        this.http.put<any>("/editbook", bookToEdit).subscribe({
          error: (err) => {
            console.log(err)
          },
          next: (res) => {
            console.log("response",res)
            let removeMessageBox = this.infoBox?.nativeElement
            let removeMessage = this.infoMsg?.nativeElement
            removeMessage.innerText = "the row is successfully updated in the table"
            removeMessageBox.showModal()
          },
        });
      }
    }
  }
  inputizeBook(bookRow: HTMLCollection) {
    let bookidNode = <HTMLTableCellElement>bookRow.item(1)
    let nameNode = <HTMLTableCellElement>bookRow.item(2)
    let descriptionNode = <HTMLTableCellElement>bookRow.item(3)
    let authorNode = <HTMLTableCellElement>bookRow.item(4)
    let createdDateNode = <HTMLTableCellElement>bookRow.item(5)
    for (let node of [bookidNode, nameNode, descriptionNode, authorNode, createdDateNode]) {
      let value = node.innerText
      node.innerText = ""
      let inputNode = document.createElement("input")
      inputNode.value = value
      inputNode.addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
          event.preventDefault()
          this.putEditBook(event)
        }
      })
      node.appendChild(inputNode)
    }
  }
  editBookButton() {
    let targetBook = this.getBook()
    if (targetBook === null) {
      console.log("editBookButton(): no book is selected")
    } else {
      let bookdata = <HTMLCollection>(targetBook).children
      this.inputizeBook(bookdata)
    }
  }
  getBookToRemove() {
    let bookToRemove = new Book()
    if (this.rowInputBox != undefined) {
      for (const ele of this.rowInputBox) {
        let curr_checkbox_inrow = ele.nativeElement.firstChild
        if (curr_checkbox_inrow.checked) {
          let curr_tablerow = curr_checkbox_inrow.parentNode.parentNode
          let childs = curr_tablerow.children
          bookToRemove.bookid = parseInt(childs.item(1).innerText)
          bookToRemove.name = childs.item(2).innerText
          bookToRemove.description = childs.item(3).innerText
          bookToRemove.author = childs.item(4).innerText
          bookToRemove.createdDate = childs.item(5).innerText
          break
        }
      }
    }
    return bookToRemove
  }
  rmBookButton() {
    let targetBookToDelete = this.getBookToRemove()
    // this.http.delete<any>("/removebook", { body: targetBookToDelete }).subscribe((res) => console.log(res), (err) => console.log(err));
    this.http.delete<any>("/removebook", { body: targetBookToDelete }).subscribe({
      error: (err) => {
        console.log(err)
      },
      next: (res) => {
        console.log("response",res)
        let removeMessageBox = this.infoBox?.nativeElement
        let removeMessage = this.infoMsg?.nativeElement
        removeMessage.innerText = "the row is successfully removed from the table"
        removeMessageBox.showModal()
      },
    });
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
    this.http.get<Book[]>('/book').subscribe({
      error: (err) => { console.log(err) },
      next: (res) => { this.books = res},
    });
  }

  title = 'booklibrary.client';
}
