using Microsoft.AspNetCore.Mvc;
using PayPal.NET8;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();

app.MapPost("/CreatePayment", ([FromBody] IEnumerable<ItemDto> items, IConfiguration configuration, HttpContext context) =>
{
    var baseUrl = context.Request.Host.Value;

    return new PayPalService(configuration).CreatePayment(items, baseUrl);
});

app.MapPost("/ExecutePayment", ([FromBody] ExecutePaymentDto dto, IConfiguration configuration) =>
{
    return new PayPalService(configuration).ExecutePayment(dto);
});

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.Run();
