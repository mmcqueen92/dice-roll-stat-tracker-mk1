using System.ComponentModel.DataAnnotations;

namespace DiceStatsServer.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string HashedPassword { get; set; }

        // Parameterless constructor for EF Core - Private to prevent accidentally creating default instances
        private User() {
            Username = String.Empty;
            Email = String.Empty;
            HashedPassword = String.Empty;
        }

        // Constructor with required fields
        public User(string username, string email, string hashedPassword)
        {
            Username = username;
            Email = email;
            HashedPassword = hashedPassword;
        }
    }
}
