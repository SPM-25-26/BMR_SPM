using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eppoi.Models.Importer
{
    public class EntertainmentImport
    {
        public string identifier { get; set; } = string.Empty;
        public string officialName { get; set; } = string.Empty;
        public string? address { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string category { get; set; } = string.Empty;
        public string primaryImage { get; set; } = string.Empty;
        public string[]? gallery { get; set; } = [];
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
    }
}
