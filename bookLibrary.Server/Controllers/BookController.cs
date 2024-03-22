using bookLibrary.Server.Data;
using Microsoft.AspNetCore.Mvc;
using System.Data.Entity;
using System.Threading.Tasks.Dataflow;

namespace bookLibrary.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        private readonly ILogger<BookController> _logger;
        private bookLibraryServerContext _bLContext; 
        public BookController(ILogger<BookController> logger, bookLibraryServerContext bLSContext) { 
            _logger = logger; 
            _bLContext = bLSContext;
        }

        [HttpGet(Name = "Book")]
        public List<Book> Get()
        {
            // hard code book data
            //var bookData = new List<Book>();
            //var dateNow = DateOnly.FromDateTime(DateTime.Now);
            //if (bookData != null) {
            //    bookData.Add(new Book { Name = "Harry Potter", Description = "Test Description", Author = "foo", CreatedDate = dateNow.ToString()});
            //    bookData.Add(new Book { Name = "Weather Book", Description = "Weather Description", Author = "bar", CreatedDate = dateNow.ToString()});
            //    return bookData;
            //}
            var bookData = _bLContext.tblBook.ToList<Book>();
            if (bookData != null)
                return bookData;
            else
                return new List<Book>();
        }
        [HttpPost("/AddBook")]
        public List<Book> AddBook()
        {
            Console.WriteLine("hello");
            return new List<Book>();
        }
    }
}
