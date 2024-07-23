using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DiceStatsServer.Services
{
    public class AuthService
    {
        public string GenerateJwtToken(string email, string username, int userId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim("email", email),
                new Claim("username", username),
                new Claim("id", userId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "http://localhost:5050",
                audience: "http://localhost:3000",
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
