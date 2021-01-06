using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class ElementWithin
    {
        public string name;
        public bool within;
        public int aboveOrBelow;

        public ElementWithin(string name, bool within, int aboveOrBelow)
        {
            this.name = name;
            this.within = within;
            this.aboveOrBelow = aboveOrBelow;
        }
    }
}
