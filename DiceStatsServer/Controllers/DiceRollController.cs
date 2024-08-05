using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DiceStatsServer.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiceStatsServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiceRollController : ControllerBase
    {
        private readonly DiceStatsContext _context;

        public DiceRollController(DiceStatsContext context)
        {
            _context = context;
        }

        // GET: api/DiceRoll
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DiceRoll>>> GetDiceRolls()
        {
            // Retrieve the user ID from the context
            var userId = HttpContext.Items["UserId"]?.ToString();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Fetch characters for the user
            var userCharacters = await _context.Characters
                .Where(c => c.UserId == int.Parse(userId))
                .ToListAsync();

            var characterIds = userCharacters.Select(c => c.CharacterId).ToList();

            // Fetch dice rolls for those characters
            var diceRolls = await _context.DiceRolls
                .Where(dr => characterIds.Contains(dr.CharacterId))
                .ToListAsync();

            return Ok(diceRolls);
        }


        // GET: api/DiceRoll/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<DiceRoll>>> GetDiceRolls(int id, [FromQuery] int? limit, [FromQuery] int skip = 0, [FromQuery] string orderBy = "Timestamp", [FromQuery] string orderDirection = "desc")
        {
            var query = _context.DiceRolls.Where(dr => dr.CharacterId == id);

            if (orderDirection.ToLower() == "asc")
            {
                query = orderBy.ToLower() switch
                {
                    "rollvalue" => query.OrderBy(dr => dr.RollValue),
                    "success" => query.OrderBy(dr => dr.Success),
                    _ => query.OrderBy(dr => dr.Timestamp),
                };
            }
            else
            {
                query = orderBy.ToLower() switch
                {
                    "rollvalue" => query.OrderByDescending(dr => dr.RollValue),
                    "success" => query.OrderByDescending(dr => dr.Success),
                    _ => query.OrderByDescending(dr => dr.Timestamp),
                };
            }

            query = query.Skip(skip);

            if (limit.HasValue && limit.Value > 0)
            {
                query = query.Take(limit.Value);
            }

            var diceRolls = await query.ToListAsync();

            return Ok(diceRolls);
        }


        // GET: api/:id/count
        [HttpGet("{id}/count")]
        public async Task<ActionResult<int>> GetDiceRollsCount(int id, [FromQuery] string orderBy = "Timestamp", [FromQuery] string orderDirection = "desc")
        {
            var query = _context.DiceRolls.Where(dr => dr.CharacterId == id);

            // Apply ordering to the query (optional, if you want to match the other route exactly)
            if (orderDirection.ToLower() == "asc")
            {
                query = orderBy.ToLower() switch
                {
                    "rollvalue" => query.OrderBy(dr => dr.RollValue),
                    "success" => query.OrderBy(dr => dr.Success),
                    _ => query.OrderBy(dr => dr.Timestamp),
                };
            }
            else
            {
                query = orderBy.ToLower() switch
                {
                    "rollvalue" => query.OrderByDescending(dr => dr.RollValue),
                    "success" => query.OrderByDescending(dr => dr.Success),
                    _ => query.OrderByDescending(dr => dr.Timestamp),
                };
            }

            // Get the count of records
            var count = await query.CountAsync();

            return Ok(count);
        }



        // POST: api/DiceRoll/Create
        [HttpPost("Create")]
        public async Task<ActionResult<DiceRoll>> CreateDiceRoll(DiceRoll diceRoll)
        {
            _context.DiceRolls.Add(diceRoll);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDiceRolls), new { id = diceRoll.DiceRollId }, diceRoll);
        }

        // PUT: api/DiceRoll/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiceRoll(int id, DiceRoll diceRoll)
        {
            Console.WriteLine("EDITING DICEROLL");
            if (id != diceRoll.DiceRollId)
            {
                return BadRequest();
            }

            _context.Entry(diceRoll).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiceRollExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/DiceRoll/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiceRoll(int id)
        {
            var diceRoll = await _context.DiceRolls.FindAsync(id);
            if (diceRoll == null)
            {
                return NotFound();
            }

            _context.DiceRolls.Remove(diceRoll);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DiceRollExists(int id)
        {
            return _context.DiceRolls.Any(e => e.DiceRollId == id);
        }
    }
}
