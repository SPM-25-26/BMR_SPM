using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eppoi.Models.Importer
{
    public class EventImport
    {
        public string identifier { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string typology { get; set; } = string.Empty;
        public string primaryImage { get; set; } = string.Empty;
        public string audience { get; set; } = string.Empty;
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
        public string? date { get; set; } = string.Empty;
        public string? startDate { get; set; } = string.Empty;
        public string? endDate { get; set; } = string.Empty;
        public Organizer organizer { get; set; } = new Organizer();
    }

    public class Organizer
    {
        public string taxCode { get; set; } = string.Empty;
        public string legalName { get; set; } = string.Empty;
        public string website { get; set; } = string.Empty;
    }

}
