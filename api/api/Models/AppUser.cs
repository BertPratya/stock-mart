﻿using Microsoft.AspNetCore.Identity;
namespace api.Models
{
    public class AppUser : IdentityUser
    {
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public Wallet? Wallet { get; set; } = null ;
    }
}
