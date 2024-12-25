using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRUD_with_card.Model
{
    public class LocationModel
    {
        public int Id { get; set; }
        public required string State { get; set; }
        public required string City { get; set; }
        public required string Address { get; set; }
        public required int Zipcode { get; set; }
        public required int Postalcode { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class CardModel
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }
        public int StateId { get; set; } 
        [Required(ErrorMessage = "State is required.")]
        public string State { get; set; }
        [Required(ErrorMessage = "DatePicker is required.")]
        public DateOnly DatePicker { get; set; }
        [Required(ErrorMessage = "Uploadfile is required.")]
        public string Uploadfile { get; set; }
        [Required(ErrorMessage = "Fileurl is required.")]
        public string Fileurl { get; set; }
        public bool IsActive { get; set; }
    }
}
