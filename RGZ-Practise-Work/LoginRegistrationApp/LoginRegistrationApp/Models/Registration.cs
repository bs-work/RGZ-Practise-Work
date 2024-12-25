namespace LoginRegistrationApp.Models
{
	public class Registration
	{
        public required string UserName { get; set; }
        public required string Email { get; set; }
		public required string Password { get; set; }

		//public required int IsActive { get; set; }
	}

	public class Login
	{
		public required string Email { get; set; }
		public required string Password { get; set; }
	}
}