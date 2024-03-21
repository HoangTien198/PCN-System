using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace IE_MSC.Models.Entities
{
    public partial class PCNDbContext : DbContext
    {
        public PCNDbContext()
            : base("name=PCNDbContext")
        {
        }

        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<DepartmentEmployee> DepartmentEmployees { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<PCNConfirm> PCNConfirms { get; set; }
        public virtual DbSet<PCN> PCNs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>()
                .Property(e => e.CustomerID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.UpdatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.CreatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<DepartmentEmployee>()
                .Property(e => e.DepartmentID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<DepartmentEmployee>()
                .Property(e => e.EmployeeID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<DepartmentEmployee>()
                .Property(e => e.UpdatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<DepartmentEmployee>()
                .Property(e => e.CreatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Department>()
                .Property(e => e.DepartmentID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Department>()
                .Property(e => e.CustomerID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Department>()
                .Property(e => e.UpdatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Department>()
                .Property(e => e.CreatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Department>()
                .HasMany(e => e.DepartmentEmployees)
                .WithRequired(e => e.Department)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.EmployeeID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.EmployeeCode)
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.DeskPhone)
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.MobilePhone)
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.Username)
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.Password)
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.UpdatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.CreatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.DepartmentEmployees)
                .WithRequired(e => e.Employee)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Employee>()
                .HasMany(e => e.PCNConfirms)
                .WithRequired(e => e.Employee)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<PCNConfirm>()
                .Property(e => e.EmployeeID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCNConfirm>()
                .Property(e => e.PCNID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCNConfirm>()
                .Property(e => e.ConfirmedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCNConfirm>()
                .Property(e => e.RejectedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.PCNID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.RecommendedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.IEConfirmBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.BossConfirmBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.IERejectBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.BossRejectBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.UpdatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .Property(e => e.CreatedBy)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<PCN>()
                .HasMany(e => e.PCNConfirms)
                .WithRequired(e => e.PCN)
                .WillCascadeOnDelete(false);
        }
    }
}
