using CRUD_with_card.Layer;
using CRUD_with_card.Model;
using Microsoft.AspNetCore.Mvc;

namespace CRUD_with_card.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly LocationLayer _locationLayer;

        public LocationController(LocationLayer locationLayer)
        {
            _locationLayer = locationLayer;
        }

        // api/location
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationModel>>> GetLocations()
        {
            var locations = await _locationLayer.GetLocationsAsync();
            return Ok(locations);
        }

        // api/location/id
        [HttpGet("{id}")]

        public async Task<ActionResult<LocationModel>> GetLocation(int id)
        {
            var location = await _locationLayer.GetLocationByIdAsync(id);
            if (location == null)
            {
                return NotFound();
            }
            return Ok(location);
        }
    
        // POST: api/location
        [HttpPost]
        public async Task<ActionResult<LocationModel>> CreateLocation(LocationModel location)
        {
            var result = await _locationLayer.AddLocationAsync(location);
            if (result > 0)
            {
                return CreatedAtAction(nameof(GetLocation), new { location.Id }, location);
            }
            return BadRequest("Could not create location.");
        }

        // PUT: api/location/id
        [HttpPut("{id}")]   
        public async Task<ActionResult> UpdateLocation(int id, LocationModel location)
        {
            if (id != location.Id )
            {
                return BadRequest();
            }

            var result = await _locationLayer.UpdateLocationAsync(location);
            if (result > 0)
            {
                return NoContent();
            }
            return NotFound();
        }

        // DELETE: api/location/id  
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLocation(int id)
        {
            var result = await _locationLayer.DeleteLocationAsync(id);
            if (result > 0)
            {
                return NoContent();
            }
            return NotFound();
        }

        //[HttpPut("updateStateFromLocation")]
        //public async Task<ActionResult> UpdateStateFromLocation(int locationId, string state)
        //{
        //    await _locationLayer.UpdateStateFromLocationAsync(locationId, state);
        //    return NoContent();
        //}
    }
}
