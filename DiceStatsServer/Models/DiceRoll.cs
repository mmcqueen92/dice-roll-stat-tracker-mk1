using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DiceStatsServer.Models
{
    public class DiceRoll
    {
        [Key]
        public int DiceRollId { get; set; }

        [Required]
        public int CharacterId { get; set; }

        [ForeignKey("CharacterId")]
        public Character? Character { get; set; }

        [Required]
        public int SessionId { get; set; }

        [ForeignKey("SessionId")]
        public Session? Session { get; set; }

        [Required]
        public int DiceSize { get; set; }

        public string? RollType { get; set; } // Nullable

        public string? SkillType { get; set; } // Nullable

        [Required]
        public int RollValue { get; set; }

        [Required]
        public DateTime Timestamp { get; set; }

        public bool? Success { get; set; } // Nullable

        // Parameterless constructor for EF Core
        public DiceRoll()
        {
            
        }
    }
}
