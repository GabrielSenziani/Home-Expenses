using HomeExpenses.Api.Models;

namespace HomeExpenses.Api.DTOs;

public class TransacaoCreateDto 
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public DateTime Data { get; set; }
    public int PessoaId { get; set; } 
}