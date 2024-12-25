using CRUD_with_card.Layer;
using CRUD_with_card.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace CRUD_with_card.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly CardLayer _cardLayer;
        private readonly string _fileUploadPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");  


        public CardController(CardLayer cardLayer)
        {
            _cardLayer = cardLayer;

            if (!Directory.Exists(_fileUploadPath))
            {
                Directory.CreateDirectory(_fileUploadPath);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CardModel>>> GetCards()
        {
            var cards = await _cardLayer.GetCardsAsync();
            return Ok(cards);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CardModel>> GetCard(int id)
        {
            var card = await _cardLayer.GetCardByIdAsync(id);
            if (card == null)
            {
                return NotFound();
            }
            return Ok(card);
        }

        [HttpPost]
        public async Task<ActionResult<CardModel>> CreateCard(CardModel card)
        {
            var result = await _cardLayer.AddCardAsync(card);
            if (result > 0)
            {
                return CreatedAtAction(nameof(GetCard), new { card.Id }, card);
            }
            return BadRequest("Could not create card.");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCard(int id, CardModel card)
        {
            if (id != card.Id)
            {
                return BadRequest();
            }

            var result = await _cardLayer.UpdateCardAsync(card);
            if (result > 0)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCard(int id)
        {
            var result = await _cardLayer.DeleteCardAsync(id);
            if (result > 0)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpPost("upload")]
        public async Task<ActionResult<string>> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var filePath = Path.Combine(_fileUploadPath, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var fileUrl = $"{Request.Scheme}://{Request.Host}/UploadedFiles/{file.FileName}";
            return Ok(fileUrl);
        }

        //[HttpPut("updateStateFromLocation")]
        //public async Task<ActionResult> UpdateStateFromLocation(int locationId, string state)
        //{
        //    await _cardLayer.UpdateStateFromLocationAsync(locationId, state);
        //    return NoContent();
        //}

        //[HttpGet("state/{locationId}")]
        //public async Task<ActionResult<string>> GetStateByLocationId(int locationId)
        //{
        //    var state = await _cardLayer.GetStateByLocationIdAsync(locationId);
        //    if (state == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(state);
        //}
    }
}
