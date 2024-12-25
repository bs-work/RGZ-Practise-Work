using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using LoginRegistrationApp.Models;
using System;
using System.Text.RegularExpressions;
using NSubstitute.Core;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LoginRegistrationApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RegistrationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
  
        [HttpPost]
        [Route("registration")]
        public IActionResult Registration(Registration registration)
        {
            if (string.IsNullOrWhiteSpace(registration.UserName) ||
                string.IsNullOrWhiteSpace(registration.Password) ||
                string.IsNullOrWhiteSpace(registration.Email))
            {
                return BadRequest(new { messages = new[] {"Username, Password, and Email are Required."}});
            }
            if (!IsValidEmail(registration.Email))
            {
                return BadRequest(new { messages = new[] {"Invalid Email Format."} });
            }
            if (!IsValidPassword(registration.Password))
            {
                return BadRequest(new { messages = new[] { "Password must be at least 8 characters long, contain at least one uppercase letter and one special character." } });
            }

            using (var con = new SqlConnection(_configuration.GetConnectionString("TestDb")))
            {
                string checkUserQuery = "SELECT COUNT(*) FROM Registration WHERE Email = @Email";
                using (var checkUserCmd = new SqlCommand(checkUserQuery, con))
                {
                    checkUserCmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = registration.Email;
                    con.Open();

                    object result = checkUserCmd.ExecuteScalar();
                    int userExists = Convert.ToInt32(result); 
                    con.Close();
                    if (userExists > 0)
                    {
                        return Conflict(new { messages = new[] { "User Already Exists With This Email." } });
                    }
                }
                string query = "INSERT INTO Registration (UserName, Password, Email) VALUES (@UserName, @Password, @Email)";
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.Add("@UserName", SqlDbType.NVarChar).Value = registration.UserName;
                    cmd.Parameters.Add("@Password", SqlDbType.NVarChar).Value = registration.Password;
                    cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = registration.Email;
                    con.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();
                    con.Close();
                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "User Registered Successfully." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Error inserting data." });
                    }
                }
            }
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] Login login)
        {
            if (string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.Password))
            {
                return BadRequest(new { messages = new[] { "Email and Password are Required." } });
            }

            using (var con = new SqlConnection(_configuration.GetConnectionString("TestDb")))
            {
                string query = "SELECT Password, Username FROM Registration WHERE Email = @Email";
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = login.Email;
                    con.Open();

                    object result = cmd.ExecuteScalar();
                    if (result == null)
                    {
                        return Unauthorized(new { message = "Invalid User" });
                    }
                    string storedPassword = result as string;
                    con.Close();

                    if (storedPassword == login.Password)
                    {
                        var token = GenerateJwtToken(login.Email);

                        return Ok(new { token }); 
                    }
                    else
                    {
                        return Unauthorized(new { message = "Invalid password." }); 
                    }
                }
            }
        }
        private string GenerateJwtToken(string email)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, email), 
       
    };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("JWTToken"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddHours(1), 
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token); 
        }

        private bool IsValidEmail(string email)
        {
            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            var regex = new Regex(emailPattern);
            return regex.IsMatch(email);
        }
        private bool IsValidPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
                return false;

            bool hasUpperCase = false;
            bool hasSpecialChar = false;
            foreach (char c in password)
            {
                if (char.IsUpper(c))
                    hasUpperCase = true;
                if (!char.IsLetterOrDigit(c))
                    hasSpecialChar = true;
            }

            return hasUpperCase && hasSpecialChar;
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok();
        }

        [HttpGet]
        [Route("test-connection")]
        public IActionResult TestConnection()   
        {
            try
            {
                using (var con = new SqlConnection(_configuration.GetConnectionString("TestDb")))
                {
                    con.Open();
                    return Ok(new { message = "Connection successful!" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Connection failed: {ex.Message}"});
            }
        }
    }
}

