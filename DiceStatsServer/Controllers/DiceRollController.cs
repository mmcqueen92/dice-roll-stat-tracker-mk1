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
            return await _context.DiceRolls.ToListAsync();
        }

        // GET: api/DiceRoll/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DiceRoll>> GetDiceRoll(int id)
        {
            var diceRoll = await _context.DiceRolls.FindAsync(id);

            if (diceRoll == null)
            {
                return NotFound();
            }

            return diceRoll;
        }

        // POST: api/DiceRoll
        [HttpPost]
        public async Task<ActionResult<DiceRoll>> PostDiceRoll(DiceRoll diceRoll)
        {
            _context.DiceRolls.Add(diceRoll);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDiceRoll), new { id = diceRoll.DiceRollId }, diceRoll);
        }

        // PUT: api/DiceRoll/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiceRoll(int id, DiceRoll diceRoll)
        {
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
