using Microsoft.AspNetCore.Mvc;
using HomeExpenses.Api.DTOs;
using HomeExpenses.Api.Data;
using HomeExpenses.Api.Models;
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
        },
        generationConfig = new
        {
            responseMimeType = "application/json"
        }
    };

    const int maxTentativas = 2;
    for (int tentativa = 1; tentativa <= maxTentativas; tentativa++)
    {
        var response = await httpClient.PostAsJsonAsync(
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={apiKey}",
            corpoRequisicao
        );

        if (!response.IsSuccessStatusCode)
        {
            var erroDetalhado = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro Gemini ({response.StatusCode}): {erroDetalhado}");

            if (tentativa == maxTentativas)
            return StatusCode(502, "Não foi possível processar sua solicitação no momento. Tente novamente mais tarde.");

            await Task.Delay(3000);
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

                await Task.Delay(1500);
        }
    }

    return StatusCode(500, "Erro inesperado.");
 }

 [HttpPost("confirmar")]
public async Task<IActionResult> ConfirmarAnalise([FromBody] ConfirmacaoAnaliseDto dto)
{
    var pessoa = _context.TabelaPessoa
        .FirstOrDefault(p => p.Nome == dto.NomePessoa);

    if (pessoa == null)
    {
        return NotFound("Pessoa não encontrada.");
    }

    if (pessoa.IsMinor)
    {
        return Ok(new ResultadoAnaliseDto
        {
            Aviso = "A análise de saldo e gastos está disponível apenas para pessoas com 18 anos ou mais."
        });
    }

    var agora = DateTime.Now;

    var transacoesDoMes = _context.TabelaTransacao
    .Where(t => t.PessoaId == pessoa.Id
             && t.Data.Month == agora.Month
             && t.Data.Year == agora.Year)
    .ToList();

    var receitas = transacoesDoMes
    .Where(t => t.Tipo == TipoTransacao.Receita);

    var despesas = transacoesDoMes
    .Where(t => t.Tipo == TipoTransacao.Despesa);

if (!string.IsNullOrEmpty(dto.CategoriaMencionada))
{
    despesas = despesas
    .Where(t => t.Descricao.Contains(dto.CategoriaMencionada, StringComparison.OrdinalIgnoreCase));
}

    var totalReceitas = receitas.Sum(t => t.Valor);
    var totalDespesas = despesas.Sum(t => t.Valor);
    var saldo = totalReceitas - totalDespesas;

    var textoExplicativo = await GerarTextoExplicativo(totalReceitas, totalDespesas, saldo);

    var resultado = new ResultadoAnaliseDto
{
    TotalReceitas = totalReceitas,
    TotalDespesas = totalDespesas,
    Saldo = saldo,
    TextoExplicativo = textoExplicativo
};

    return Ok(resultado);
}

  private async Task<string> GerarTextoExplicativo(decimal totalReceitas, decimal totalDespesas, decimal saldo)
{
    var apiKey = _configuration["Gemini:ApiKey"];
    var httpClient = _httpClientFactory.CreateClient();
    var prompt = MontarPromptExplicativo(totalReceitas, totalDespesas, saldo);

    var corpoRequisicao = new
    {
        contents = new[]
        {
            new { parts = new[] { new { text = prompt } } }
        }
    };

    var response = await httpClient.PostAsJsonAsync(
        $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={apiKey}",
        corpoRequisicao
    );

    if (!response.IsSuccessStatusCode)
    {
        var erroDetalhado = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Erro Gemini (texto explicativo): {erroDetalhado}");
        return "Não foi possível gerar uma explicação no momento.";
    }

    var resultado = await response.Content.ReadFromJsonAsync<GeminiResponse>();
    return resultado?.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "Não foi possível gerar uma explicação no momento.";
}

  private string MontarPromptExplicativo(decimal totalReceitas, decimal totalDespesas, decimal saldo)
  {
    return $@"
Você é um assistente financeiro. Com base nos dados abaixo, escreva um texto amigavel e explicativo ao usuário indicando a porcentagem dos gastos dele em relação a receita e um conselho prático ao usuario. Responda APENAS com o texto final, SEM markdown, SEM explicações adicionais.

Total de receitas: {totalReceitas}
Total de despesas: {totalDespesas}
Saldo: {saldo}
  ";
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