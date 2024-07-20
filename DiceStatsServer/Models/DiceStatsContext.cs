using Microsoft.EntityFrameworkCore;

namespace DiceStatsServer.Models
{
    public class DiceStatsContext : DbContext
    {
        public DiceStatsContext(DbContextOptions<DiceStatsContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<DiceRoll> DiceRolls { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, Username = "user1", Email = "user1@example.com", HashedPassword = "password1" },
                new User { UserId = 2, Username = "user2", Email = "user2@example.com", HashedPassword = "password2" },
                new User { UserId = 3, Username = "user3", Email = "user3@example.com", HashedPassword = "password3" }
            );

            modelBuilder.Entity<Character>().HasData(
                new Character { CharacterId = 1, UserId = 1, Name = "Character1", Class = "Warrior" },
                new Character { CharacterId = 2, UserId = 2, Name = "Character2", Class = "Mage" },
                new Character { CharacterId = 3, UserId = 3, Name = "Character3", Class = "Rogue" }
            );

            modelBuilder.Entity<DiceRoll>().HasData(
                new DiceRoll { DiceRollId = 1, CharacterId = 1, DiceSize = 20, RollType = "attack", SkillType = null, RollValue = 15, Timestamp = DateTime.Now.AddDays(-3), Success = true },
                new DiceRoll { DiceRollId = 2, CharacterId = 1, DiceSize = 20, RollType = "skill", SkillType = "athletics", RollValue = 10, Timestamp = DateTime.Now.AddDays(-3), Success = false },
                new DiceRoll { DiceRollId = 3, CharacterId = 1, DiceSize = 20, RollType = "saving", SkillType = null, RollValue = 18, Timestamp = DateTime.Now.AddDays(-3), Success = true },
                new DiceRoll { DiceRollId = 4, CharacterId = 2, DiceSize = 20, RollType = "attack", SkillType = null, RollValue = 12, Timestamp = DateTime.Now.AddDays(-2), Success = false },
                new DiceRoll { DiceRollId = 5, CharacterId = 2, DiceSize = 20, RollType = "skill", SkillType = "arcana", RollValue = 20, Timestamp = DateTime.Now.AddDays(-2), Success = true },
                new DiceRoll { DiceRollId = 6, CharacterId = 2, DiceSize = 20, RollType = "saving", SkillType = null, RollValue = 14, Timestamp = DateTime.Now.AddDays(-2), Success = true },
                new DiceRoll { DiceRollId = 7, CharacterId = 3, DiceSize = 20, RollType = "attack", SkillType = null, RollValue = 9, Timestamp = DateTime.Now.AddDays(-1), Success = false },
                new DiceRoll { DiceRollId = 8, CharacterId = 3, DiceSize = 20, RollType = "skill", SkillType = "stealth", RollValue = 17, Timestamp = DateTime.Now.AddDays(-1), Success = true },
                new DiceRoll { DiceRollId = 9, CharacterId = 3, DiceSize = 20, RollType = "saving", SkillType = null, RollValue = 11, Timestamp = DateTime.Now.AddDays(-1), Success = false }
            );

        }
    }
}
