using Microsoft.Data.SqlClient;
using CRUD_with_card.Model;
using Microsoft.Extensions.Configuration;
using Dapper;

namespace CRUD_with_card.Layer
{
    public class CardLayer
    {
        private readonly string _connectionString;

        public CardLayer(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("LocMaster");
        }

        public async Task<IEnumerable<CardModel>> GetCardsAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    SELECT 
                        Card.Id,
                        Card.Name,
                        Location.State, 
                        Card.State As StateId,
                        Card.DatePicker,
                        Card.Uploadfile,
                        Card.Fileurl,
                        Card.IsActive
                    FROM 
                        Card
                    JOIN 
                        Location ON Card.State = Location.Id
                    WHERE 
                        Card.IsActive = 1";
                var cards = await connection.QueryAsync<dynamic>(query);
                var cardModels = cards.Select(card => new CardModel
                {
                    Id = card.Id,
                    Name = card.Name,
                    State = card.State,
                    StateId = Convert.ToInt32(card.StateId),
                    DatePicker = DateOnly.FromDateTime(DateTime.Parse(card.DatePicker.ToString())),
                    Uploadfile = card.Uploadfile,
                    Fileurl = card.Fileurl,
                    IsActive = card.IsActive
                });
                return cardModels;
            }
        }

        public async Task<CardModel> GetCardByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    SELECT 
                        Card.Id,
                        Card.Name,
                        Location.State,
                        Card.State As StateId,
                        Card.DatePicker,
                        Card.Uploadfile,
                        Card.Fileurl,
                        Card.IsActive
                    FROM 
                        Card
                    JOIN 
                        Location ON Card.State = Location.Id
                    WHERE 
                        Card.Id = @Id AND Card.IsActive = 1";
                var card = await connection.QueryFirstOrDefaultAsync<dynamic>(query, new { Id = id });

                if (card != null)
                {
                    int stateId = Convert.ToInt32(card.StateId);

                    return new CardModel
                    {
                        Id = card.Id,
                        Name = card.Name,
                        State = card.State,
                        StateId = stateId,
                        DatePicker = DateOnly.FromDateTime(card.DatePicker),
                        Uploadfile = card.Uploadfile,
                        Fileurl = card.Fileurl,
                        IsActive = card.IsActive
                    };
                }

                return null;
            }
        }

        public async Task<int> AddCardAsync(CardModel card)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "INSERT INTO Card (Name, State, StateId, DatePicker, Uploadfile, IsActive, Fileurl) VALUES (@Name, @State, @StateId, @DatePicker, @Uploadfile, @IsActive, @Fileurl)";
                var parameters = new
                {
                    card.Name,
                    card.State,
                    StateId = card.StateId,
                    DatePicker = card.DatePicker.ToDateTime(new TimeOnly(0, 0)),
                    card.Uploadfile,
                    card.Fileurl,
                    card.IsActive
                };

                return await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task<int> UpdateCardAsync(CardModel card)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Card SET Name = @Name, State = @State, StateId = @StateId, DatePicker = @DatePicker, Uploadfile = @Uploadfile, Fileurl = @Fileurl WHERE Id = @Id";
                var parameters = new
                {
                    card.Name,
                    card.State,  // Ensure State is used
                    StateId = card.StateId,  // Ensure StateId is used
                    DatePicker = card.DatePicker.ToDateTime(new TimeOnly(0, 0)),
                    card.Uploadfile,
                    card.Fileurl,
                    card.Id
                };

                return await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task<int> DeleteCardAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Card SET IsActive = 0 WHERE Id = @Id";
                return await connection.ExecuteAsync(query, new { Id = id });
            }
        }
    }
}
