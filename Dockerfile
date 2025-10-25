# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy solution file
COPY cars24-training.sln ./

# Copy the API project file
COPY Cars24.API/*.csproj ./Cars24.API/

# Restore dependencies
RUN dotnet restore

# Copy the entire API project
COPY Cars24.API/ ./Cars24.API/

# Build and publish
WORKDIR /app/Cars24.API
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app/Cars24.API/out ./

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5207
EXPOSE 5207

ENTRYPOINT ["dotnet", "Cars24.API.dll"]
