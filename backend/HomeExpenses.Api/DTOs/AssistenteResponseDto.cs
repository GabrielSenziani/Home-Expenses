namespace HomeExpenses.Api.DTOs;

public class AssistenteResponseDto
{
    public string Acao { get; set; }
    public string Periodo { get; set; }
    public string? CategoriaMencionada { get; set; } //nesse casi string? pois pode vir null quando o usuario nao menciona categoria
}