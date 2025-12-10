using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;

        public Category() { }

        public Category(CategoryImport import)
        {
            Name = import.category.Trim();
            ImagePath = import.imagePath.Trim();
            Label = import.label.Trim();
        }
    }
}
