using Microsoft.OpenApi.Models;
using TAS.QueueManagement.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Keep Property Name Case as property or CamelCase is handled by default
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// HttpClient registration for ChatController Gemini calls
builder.Services.AddHttpClient();

// Register Queue Service as a Singleton for persistent in-memory simulation state
builder.Services.AddSingleton<IQueueService, QueueService>();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
 c.SwaggerDoc("v1", new OpenApiInfo 
 { 
     Title = "Tashkent International Airport Queue Management API", 
     Version = "v1",
     Description = "Priority-based passenger segregation & queue dispatcher API for TAS Terminal 2"
 }));

// Configure CORS to allow Angular UI to communicate
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularUI", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true) // always enable swagger for demonstration
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TAS Queue Management API v1");
        c.RoutePrefix = "swagger";
    });
}

// Redirect or rewrite root path to Swagger for intuitive landing page
app.MapGet("/", async context =>
{
    context.Response.Redirect("/swagger");
    await Task.CompletedTask;
});

app.UseCors("AllowAngularUI");

app.UseAuthorization();

app.MapControllers();

app.Run();
