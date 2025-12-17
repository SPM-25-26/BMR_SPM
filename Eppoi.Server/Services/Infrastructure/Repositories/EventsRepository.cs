using eppoi.Models.Data;
using eppoi.Models.Entities.Import.Events;

namespace eppoi.Server.Services.Infrastructure.Repositories
{
    public class EventsRepository(ApplicationDBContext context): Repository<Event>(context), IEventsRepository
    {
        public ApplicationDBContext Context
        {
            get { return context; }
        }
    }
}
