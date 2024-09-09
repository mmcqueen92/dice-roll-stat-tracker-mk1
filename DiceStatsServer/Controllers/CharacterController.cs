using Microsoft.AspNetCore.Mvc;
using DiceStatsServer.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using DiceStatsServer.DTOs;

namespace DiceStatsServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharacterController : ControllerBase
    {
        private readonly DiceStatsContext _context;

        public CharacterController(DiceStatsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
        {
            var userIdString = HttpContext.Items["UserId"] as string;

            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("User ID not found in context");
            }

            if (!int.TryParse(userIdString, out var userId))
            {
                return BadRequest("Invalid User ID format");
            }

            var characters = await _context.Characters
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(characters);
        }

        // GET: api/Character/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Character>> GetCharacter(int id)
        {
            var character = await _context.Characters.FindAsync(id);

            if (character == null)
            {
                return NotFound();
            }

            return character;
        }

        // POST: api/Character
        [HttpPost]
        public async Task<ActionResult<Character>> PostCharacter([FromBody] NewCharacterDto newCharacterDto)
        {
            // Extract UserId from context
            var userIdString = HttpContext.Items["UserId"] as string;

            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("User ID not found in context");
            }

            if (!int.TryParse(userIdString, out var userId))
            {
                return BadRequest("Invalid User ID format");
            }

            // Create a new Character entity with data from DTO and UserId from context
            var character = new Character
            {
                Name = newCharacterDto.Name,
                Class = newCharacterDto.Class,
                UserId = userId,
                SecondaryClass = string.IsNullOrWhiteSpace(newCharacterDto.SecondaryClass) ? null : newCharacterDto.SecondaryClass
            };

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCharacter), new { id = character.CharacterId }, character);
        }


        // PUT: api/Character/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCharacter(int id, Character character)
        {
            if (id != character.CharacterId)
            {
                return BadRequest();
            }

            _context.Entry(character).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CharacterExists(id))
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

        // DELETE: api/Character/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCharacter(int id)
        {
            var character = await _context.Characters.FindAsync(id);
            if (character == null)
            {
                return NotFound();
            }

            _context.Characters.Remove(character);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CharacterExists(int id)
        {
            return _context.Characters.Any(e => e.CharacterId == id);
        }
    }
}
