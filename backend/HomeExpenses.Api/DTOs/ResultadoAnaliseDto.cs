namespace HomeExpenses.Api.DTOs;

public class ResultadoAnaliseDto
{
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
    public string? TextoExplicativo { get; set; }
    public string? Aviso { get; set; } // preenchido só quando a pessoa é menor de idade
}