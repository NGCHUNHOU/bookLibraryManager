using bookLibrary.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using bookLibrary.Server.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<bookLibraryServerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("bookLibraryServerContext") ?? throw new InvalidOperationException("Connection string 'bookLibraryServerContext' not found.")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMvc();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<bookLibraryServerContext>(options => options.UseSqlServer(connectionString));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
