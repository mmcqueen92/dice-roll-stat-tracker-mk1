using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DiceStatsServer.Models
{
    public class DiceRoll
    {
        [Key]
        public int RollId { get; set; }

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
        private DiceRoll() {
            CharacterId = 0;
            SessionId = 0;
            DiceSize = 0;
            RollValue = 0;
            Timestamp = new DateTime();
        }

        // Constructor with required fields
        public DiceRoll(int characterId, int sessionId, int diceSize, int rollValue, DateTime timestamp, string? rollType, string? skillType, bool? success = null)
        {
            CharacterId = characterId;
            SessionId = sessionId;
            DiceSize = diceSize;
            RollValue = rollValue;
            Timestamp = timestamp;
            RollType = rollType;
            SkillType = skillType;
            Success = success;
        }
    }
}
