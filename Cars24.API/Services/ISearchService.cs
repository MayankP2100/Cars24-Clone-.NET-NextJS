using Cars24.API.Models;

namespace Cars24.API.Services;

public interface ISearchService
{
    Task<List<string>> SearchListingsAsync(string query, string city);
    Task<List<string>> GetSuggestionsAsync(string query);
}