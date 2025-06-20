using System.Diagnostics;
using Chatbot.UI.Models;
using Chatbot.UI.Services;
using Microsoft.AspNetCore.Mvc;

namespace Chatbot.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly OpenAIService _openAIService;

        public HomeController(ILogger<HomeController> logger, OpenAIService openAIService)
        {
            _logger = logger;
            _openAIService = openAIService;
        }

        public IActionResult Index()
        {
            //await _openAIService.GetResponseFromAIAsync("Who invented laptop");
            return View();
        }

        [HttpPost]
        [Route("AskBot")]
        public async Task<IActionResult> AskBot([FromBody] string question)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(question))
                    return BadRequest("Question cannot be empty.");

                var response = await _openAIService.GetResponseFromAIAsync(question);

                if (string.IsNullOrEmpty(response))
                    return StatusCode(500, "No response from AI");

                return Ok(new { answer = response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while calling Cohere API.");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
