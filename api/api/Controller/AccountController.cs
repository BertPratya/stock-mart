using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Interfaces;
using api.Dtos.AppUser;
namespace api.Controller
{
    [Route("api/[controller]")]
    [ApiController]

    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            try
            {
                var user = new AppUser
                {
                    Email = registerUserDto.Email.ToLower(),
                    UserName = registerUserDto.UserName.ToLower()
                };


                var createResult = await _userManager.CreateAsync(user, registerUserDto.Password);

                if (!createResult.Succeeded)
                {
                    return StatusCode(500, createResult.Errors);
                }
                var token = _tokenService.GenerateToken(user);
                return Ok(
                    new AppUserDto
                    {
                        Email = user.Email,
                        UserId = user.Id,
                        UserName = user.UserName,
                        Token = token
                    }
                );
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var appUser = await _userManager.FindByEmailAsync(loginUserDto.Email);

            if(appUser == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var isLoggedInSuccess = await _signInManager.CheckPasswordSignInAsync(appUser, loginUserDto.Password,false);

            if (!isLoggedInSuccess.Succeeded)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(new AppUserDto
            {
                Email = appUser.Email,
                Token = _tokenService.GenerateToken(appUser),
                UserId = appUser.Id,
                UserName = appUser.UserName
            });

        }










    }
 }
