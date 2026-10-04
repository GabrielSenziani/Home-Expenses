using Microsoft.AspNetCore.Mvc;
using HomeExpenses.Api.Data;
using HomeExpenses.Api.Models;
using HomeExpenses.Api.DTOs;

namespace HomeExpenses.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

     [HttpGet]
    public IActionResult Listar()
    {
        return Ok(_context.TabelaTransacao.ToList()); //O metodo ToList() vai retornar tudo que esta dentro da tabela
    }

    [HttpPost]
    public IActionResult Criar(TransacaoCreateDto dto)
    {
    var pessoa = _context.TabelaPessoa.Find(dto.PessoaId); //busca a pessoa pelo id da transacao recebida

    if (pessoa == null)
{
    return BadRequest("Pessoa não encontrada.");
}

if (dto.Data > DateTime.Now)
{
    return BadRequest("Não é possível cadastrar uma transação com data futura.");
}
    // Cria a entidade Transacao a partir do DTO
    var transacao = new Transacao
    {
        Descricao = dto.Descricao,
        Valor = dto.Valor,
        Tipo = dto.Tipo,
        PessoaId = dto.PessoaId,
        Data = dto.Data
    };

    if (pessoa.IsMinor && transacao.Tipo != TipoTransacao.Despesa)
{
    return BadRequest("Menores de idade só podem cadastrar despesas."); // Essa aplicação vai criar um limitador para pessoas com menores de 18 anos, onde elas não poderão cadastrar nenhuma transação financeira alem de despesas
}

    _context.TabelaTransacao.Add(transacao); // Add() vai adicionar uma transacao ao banco de dados, para isso é necessario inserir o body de acordo com o que foi escrito no models Transacao.cs
    _context.SaveChanges();
    return Ok(transacao);
    }
}
