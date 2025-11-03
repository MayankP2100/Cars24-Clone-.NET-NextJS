using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;
    public SearchController(ISearchService searchService) => _searchService = searchService;

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] string city)
    {
        var ids = await _searchService.SearchListingsAsync(query, city);
        return Ok(ids);
    }

    [HttpGet("suggestions")]
    public async Task<IActionResult> Suggest([FromQuery] string query)
    {
        var suggestions = await _searchService.GetSuggestionsAsync(query);
        return Ok(suggestions);
    }
}