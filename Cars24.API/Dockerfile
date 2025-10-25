FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/out ./

ENV ASPNETCORE_URLS=http://+:5207
EXPOSE 5207

ENTRYPOINT ["dotnet", "Cars24.API.dll"]