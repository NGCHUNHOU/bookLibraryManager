using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using bookLibrary.Server;

namespace bookLibrary.Server.Data
{
    public class bookLibraryServerContext : DbContext
    {
        public bookLibraryServerContext (DbContextOptions<bookLibraryServerContext> options)
            : base(options)
        {
        }

        public DbSet<bookLibrary.Server.Book> tblBook { get; set; } = default!;
    }
}
