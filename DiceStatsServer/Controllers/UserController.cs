using Microsoft.AspNetCore.Mvc;
using DiceStatsServer.Models;
using DiceStatsServer.Services;
using DiceStatsServer.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DiceStatsServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DiceStatsContext _context;
        private readonly AuthService _authService;
        public UserController(DiceStatsContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/User/Register
        [HttpPost("Register")]
        public async Task<ActionResult<User>> RegisterUser(RegisterUserDto registerUserDto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerUserDto.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "A user with this email address already exists." });
            }
            
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password);
            var user = new User
            {
                Username = registerUserDto.Username,
                Email = registerUserDto.Email,
                HashedPassword = hashedPassword
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _authService.GenerateJwtToken(user.Email, user.Username, user.UserId);

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, new { user, token });
        }

        // POST: api/User/Login
        [HttpPost("Login")]
        public async Task<ActionResult> LoginUser(LoginUserDto loginUserDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginUserDto.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.HashedPassword);

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }


            var token = _authService.GenerateJwtToken(user.Email, user.Username, user.UserId);
            // Generate a token or session
            return Ok(new { token });
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
