using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Events
{
    public class CustomerRegisteredEvent
    {
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }

}
