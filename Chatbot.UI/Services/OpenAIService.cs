using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Chatbot.UI.Services
{
    public class OpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OpenAIService> _logger;

        public OpenAIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GetResponseFromAIAsync(string question)
        {
            string apiKey = _configuration.GetValue<string>("Cohere:ApiKey");
            string apiUrl = _configuration.GetValue<string>("Cohere:Url");
            string model = _configuration.GetValue<string>("Cohere:Model");
            string answer = string.Empty;

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiUrl) || string.IsNullOrEmpty(model))
                _logger.LogError("Cohere API configuration values are missing.");

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var requestData = new
            {
                message = question,
                chat_history = new object[] { },
                model
            };

            var json = JsonConvert.SerializeObject(requestData);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(apiUrl, content);
            var result = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                dynamic opts = JsonConvert.DeserializeObject<object>(result) ?? new object();
                answer = Convert.ToString(opts?.text) ?? string.Empty;
            }
            else
            {
                _logger.LogError("Cohere API call failed. StatusCode: {StatusCode}, Response: {Response}", response.StatusCode, result);
            }

            return answer;
        }
    }
}
