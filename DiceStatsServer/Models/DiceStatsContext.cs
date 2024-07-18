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
        public DbSet<Session> Sessions { get; set; }
        public DbSet<DiceRoll> DiceRolls { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
        }
    }
}
