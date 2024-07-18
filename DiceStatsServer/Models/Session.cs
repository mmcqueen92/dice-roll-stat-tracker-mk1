using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DiceStatsServer.Models
{
    public class Session
    {
        [Key]
        public int SessionId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public DateTime Date { get; set; }

        // Parameterless constructor for EF Core
        private Session() {
            UserId = 0;
            Date = new DateTime();
        }

        // Constructor with required fields
        public Session(int userId, DateTime date, TimeSpan time)
        {
            UserId = userId;
            Date = date;
        }
    }
}
