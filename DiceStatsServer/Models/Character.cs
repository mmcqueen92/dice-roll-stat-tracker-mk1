using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DiceStatsServer.Models
{
    public class Character
    {
        [Key]
        public int CharacterId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string Class { get; set; }

        [MaxLength(50)]
        public string? SecondaryClass { get; set; }

        [JsonIgnore]
        public ICollection<DiceRoll> DiceRolls { get; set; }

        // Parameterless constructor for EF Core
        public Character()
        {

        }
    }
}
