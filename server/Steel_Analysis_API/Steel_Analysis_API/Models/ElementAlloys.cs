using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class ElementAlloys
    {
        public string name;
        public List<Alloy> alloys;

        public ElementAlloys(string name)
        {
            this.name = name;
            alloys = new List<Alloy>();
        }
    }
}
