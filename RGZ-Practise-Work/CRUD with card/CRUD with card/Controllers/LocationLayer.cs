using Microsoft.Data.SqlClient;
using CRUD_with_card.Model;
using Dapper;

namespace CRUD_with_card.Layer
{
    public class LocationLayer
    {
        private readonly string _connectionString;  

        public LocationLayer(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("LocMaster");
        }

        public async Task<IEnumerable<LocationModel>> GetLocationsAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "SELECT * FROM Location WHERE IsActive = 1"; 
                return await connection.QueryAsync<LocationModel>(query);
            }
        }

        public async Task<LocationModel> GetLocationByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "SELECT * FROM Location WHERE Id = @Id AND IsActive = 1";
                return await connection.QueryFirstOrDefaultAsync<LocationModel>(query, new { Id = id });
            }
        }
    
        public async Task<int> AddLocationAsync(LocationModel location)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                location.IsActive = true; 
                var query = "INSERT INTO Location (State, City, Address, Zipcode, Postalcode, IsActive) VALUES (@State, @City, @Address, @Zipcode, @Postalcode, @IsActive)";
                return await connection.ExecuteAsync(query, location);
            }
        }

        public async Task<int> UpdateLocationAsync(LocationModel location)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Location SET State = @State, City = @City, Address = @Address, Zipcode = @Zipcode, Postalcode = @Postalcode WHERE Id = @Id";
                return await connection.ExecuteAsync(query, location);
            }
        }

        //public async Task<int> UpdateLocationAsync(LocationModel location)
        //{
        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        await connection.OpenAsync();

        //        var updateLocationQuery = "UPDATE Location SET State = @State, City = @City, Address = @Address, Zipcode = @Zipcode, Postalcode = @Postalcode WHERE Id = @Id";
        //        var updateCardQuery = "UPDATE Card SET State = @State WHERE LocationId = @Id";

        //        using (var transaction = connection.BeginTransaction())
        //        {
        //            try
        //            {
        //                await connection.ExecuteAsync(updateLocationQuery, location, transaction);
        //                await connection.ExecuteAsync(updateCardQuery, new { State = location.State, Id = location.Id }, transaction);
        //                transaction.Commit();
        //            }
        //            catch
        //            {
        //                transaction.Rollback();
        //                throw;
        //            }
        //        }

        //        return 1;
        //    }
        //}

        //public async Task<int> UpdateLocationAsync(LocationModel location)
        //{
        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        await connection.OpenAsync();

        //        var updateLocationQuery = "UPDATE Location SET State = @State, City = @City, Address = @Address, Zipcode = @Zipcode, Postalcode = @Postalcode WHERE Id = @Id";
        //        var updateCardQuery = "UPDATE Card SET State = @State WHERE LocationId = @Id";

        //        using (var transaction = connection.BeginTransaction())
        //        {
        //            try
        //            {
        //                await connection.ExecuteAsync(updateLocationQuery, location, transaction);
        //                await connection.ExecuteAsync(updateCardQuery, new { State = location.State, Id = location.Id }, transaction);
        //                transaction.Commit();
        //            }
        //            catch
        //            {
        //                transaction.Rollback();
        //                throw;
        //            }
        //        }

        //        return 1;
        //    }
        //}

        public async Task<int> DeleteLocationAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Location SET IsActive = 0 WHERE Id = @Id"; 
                return await connection.ExecuteAsync(query, new { Id = id });
            }
        }

        //public async Task UpdateStateFromLocationAsync(int locationId, string state)
        //{
        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        var query = @"
        //        BEGIN TRANSACTION;
        //        UPDATE Location
        //        SET State = @State
        //        WHERE Id = @LocationId;
        //        UPDATE Card
        //        SET State = @State
        //        WHERE LocationId = @LocationId;
        //        COMMIT TRANSACTION;";

        //        var parameters = new { LocationId = locationId, State = state };
        //        await connection.ExecuteAsync(query, parameters);
        //    }
        //}

    }
}
