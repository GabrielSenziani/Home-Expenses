using Microsoft.AspNetCore.Mvc;
using HomeExpenses.Api.DTOs;
using HomeExpenses.Api.Data;
using System.Net.Http.Json;
using System.Text.Json;

namespace HomeExpenses.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssistenteController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;

    public AssistenteController(IHttpClientFactory httpClientFactory, IConfiguration configuration, AppDbContext context)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AnalisarTexto([FromBody] AssistenteRequestDto request)
{
    var apiKey = _configuration["Gemini:ApiKey"];
    var httpClient = _httpClientFactory.CreateClient();
    var prompt = MontarPrompt(request.Texto);

    var corpoRequisicao = new
    {
        contents = new[]
        {
            new { parts = new[] { new { text = prompt } } }
        }
    };

    const int maxTentativas = 2;
    for (int tentativa = 1; tentativa <= maxTentativas; tentativa++)
    {
        var response = await httpClient.PostAsJsonAsync(
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={apiKey}",
            corpoRequisicao
        );

        if (!response.IsSuccessStatusCode)
        {
            var erroDetalhado = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro Gemini ({response.StatusCode}): {erroDetalhado}");

            if (tentativa == maxTentativas)
            return StatusCode(502, "Não foi possível processar sua solicitação no momento. Tente novamente mais tarde.");
          continue;
        }

        var resultado = await response.Content.ReadFromJsonAsync<GeminiResponse>();
        var textoResposta = resultado?.Candidates?[0]?.Content?.Parts?[0]?.Text;

        try
        {
            var dadosExtraidos = JsonSerializer.Deserialize<AssistenteResponseDto>(
                textoResposta!,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (dadosExtraidos != null)
                return Ok(dadosExtraidos);
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"Erro ao interpretar JSON do Gemini: {ex.Message} | Resposta recebida: {textoResposta}");

            if (tentativa == maxTentativas)
                return BadRequest("Não foi possível interpretar a resposta da IA após múltiplas tentativas.");
        }
    }

    return StatusCode(500, "Erro inesperado.");
 }

  private string MontarPrompt(string textoUsuario)
    {
        return $@"
Você é um assistente financeiro. Analise o texto do usuário e extraia informações no formato JSON abaixo, SEM nenhum texto adicional, SEM markdown, SEM explicações — apenas o JSON puro:

{{
  ""acao"": ""analisa_saldo_gasto"",
  ""periodo"": ""mes_atual"",
  ""categoriaMencionada"": null
}}

Regras:
- ""acao"" é sempre ""analisa_saldo_gasto""
- ""periodo"" é sempre ""mes_atual""
- ""categoriaMencionada"" deve ser o nome da categoria se o usuário mencionar uma (ex: ""alimentação""), ou null se não mencionar

Texto do usuário: ""{textoUsuario}""
";
    }
}