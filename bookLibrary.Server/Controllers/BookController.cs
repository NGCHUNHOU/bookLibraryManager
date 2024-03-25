using bookLibrary.Server.Data;
using Microsoft.AspNetCore.Mvc;
//using System.Data.Entity;
using System.Net;
using Microsoft.EntityFrameworkCore;

namespace bookLibrary.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : Controller
    {
        private readonly ILogger<BookController> _logger;
        private bookLibraryServerContext _bLContext; 
        private HttpResponseMessage _httpResponseMessage; 
        public BookController(ILogger<BookController> logger, bookLibraryServerContext bLSContext) { 
            _logger = logger; 
            _bLContext = bLSContext;
        }

        [HttpGet(Name = "Book")]
        public async Task<IActionResult> Get()
        {
            // hard code book data
            //var bookData = new List<Book>();
            //var dateNow = DateOnly.FromDateTime(DateTime.Now);
            //if (bookData != null) {
            //    bookData.Add(new Book { Name = "Harry Potter", Description = "Test Description", Author = "foo", CreatedDate = dateNow.ToString()});
            //    bookData.Add(new Book { Name = "Weather Book", Description = "Weather Description", Author = "bar", CreatedDate = dateNow.ToString()});
            //    return bookData;
            //}
            var bookData = await _bLContext.tblBook.ToListAsync<Book>();
            if (bookData == null) { 
                return NotFound(); 
            }
            else {
                return Json(bookData);
            }
        }
        [HttpPost("/AddBook")]
        public HttpResponseMessage AddBook([FromBody] Book requestBody)
        {
            _bLContext.tblBook.Add(requestBody);
            var addResult = _bLContext.SaveChanges();
            if (addResult == 0) {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
        [HttpDelete("/RemoveBook")]
        public HttpResponseMessage RemoveBook([FromBody] Book requestBody)
        {
            _bLContext.tblBook.Remove(requestBody);
            var removeResult = _bLContext.SaveChanges();
            if (removeResult == 0) {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            return new HttpResponseMessage(HttpStatusCode.Accepted);
        }
    }
}
