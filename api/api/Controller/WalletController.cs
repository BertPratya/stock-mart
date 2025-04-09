using api.Dtos.Wallet;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class WalletController(IWalletService walletService, UserManager<AppUser> userManager) : ControllerBase
    {
        private readonly IWalletService _walletService = walletService;
        private readonly UserManager<AppUser> _userManager = userManager;

        // GET: api/Wallet
        [HttpGet]
        public async Task<IActionResult> GetAllWallets()
        {
            try
            {
                var wallets = await _walletService.GetAllWallets();
                var walletDtos = wallets.Select(w => new WalletDto
                {
                    WalletId = w.WalletId,
                    Balance = w.Balance,
                    UserId = w.UserId,
                    Currency = w.Currency,
                    CreatedOn = w.CreatedOn,
                    LastUpdate = w.LastUpdate,
                    Status = w.Status.ToString()
                }).ToList();

                return Ok(walletDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Wallet/{walletId}
        [HttpGet("{walletId}")]
        public async Task<IActionResult> GetWalletById(string walletId)
        {
            try
            {
                var wallet = await _walletService.GetWalletByWalletId(walletId);
                if (wallet == null)
                {
                    return NotFound("Wallet not found.");
                }

                var walletDto = new WalletDto
                {
                    WalletId = wallet.WalletId,
                    Balance = wallet.Balance,
                    UserId = wallet.UserId,
                    Currency = wallet.Currency,
                    CreatedOn = wallet.CreatedOn,
                    LastUpdate = wallet.LastUpdate,
                    Status = wallet.Status.ToString()
                };

                return Ok(walletDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Wallet
        [HttpPost]
        public async Task<IActionResult> CreateWallet([FromBody] WalletDto walletDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();

                // Search for the AppUser by UserId
                var appUser = await _userManager.FindByIdAsync(walletDto.UserId);
                if (appUser == null)
                {
                    return NotFound("User not found.");
                }

                // Create the wallet using the found AppUser
                var wallet = await _walletService.CreateWallet(walletDto.UserId, appUser);

                var createdWalletDto = new WalletDto
                {
                    WalletId = wallet.WalletId,
                    Balance = wallet.Balance,
                    UserId = wallet.UserId,
                    Currency = wallet.Currency,
                    CreatedOn = wallet.CreatedOn,
                    LastUpdate = wallet.LastUpdate,
                    Status = wallet.Status.ToString()
                };

                return CreatedAtAction(nameof(GetWalletById), new { walletId = wallet.WalletId }, createdWalletDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // POST: api/Wallet/Deposit
        [HttpPost("Deposit")]
        public async Task<IActionResult> Deposit([FromBody] WalletWithDrawDto depositDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();

                var wallet = await _walletService.Deposit(depositDto.WalletId, depositDto.Amount);

                var walletDto = new WalletDto
                {
                    WalletId = wallet.WalletId,
                    Balance = wallet.Balance,
                    UserId = wallet.UserId,
                    Currency = wallet.Currency,
                    CreatedOn = wallet.CreatedOn,
                    LastUpdate = wallet.LastUpdate,
                    Status = wallet.Status.ToString()
                };

                return Ok(walletDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Wallet/Withdraw
        [HttpPost("Withdraw")]
        public async Task<IActionResult> Withdraw([FromBody] WalletWithDrawDto withdrawDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();

                var wallet = await _walletService.Withdraw(withdrawDto.WalletId, withdrawDto.Amount);

                var walletDto = new WalletDto
                {
                    WalletId = wallet.WalletId,
                    Balance = wallet.Balance,
                    UserId = wallet.UserId,
                    Currency = wallet.Currency,
                    CreatedOn = wallet.CreatedOn,
                    LastUpdate = wallet.LastUpdate,
                    Status = wallet.Status.ToString()
                };

                return Ok(walletDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Wallet/UpdateStatus
        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateStatus([FromBody] WalletUpdateStatusDto updateStatusDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();

                var wallet = await _walletService.UpdateStatus(updateStatusDto.WalletId, updateStatusDto.Status);

                var walletDto = new WalletDto
                {
                    WalletId = wallet.WalletId,
                    Balance = wallet.Balance,
                    UserId = wallet.UserId,
                    Currency = wallet.Currency,
                    CreatedOn = wallet.CreatedOn,
                    LastUpdate = wallet.LastUpdate,
                    Status = wallet.Status.ToString()
                };

                return Ok(walletDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
