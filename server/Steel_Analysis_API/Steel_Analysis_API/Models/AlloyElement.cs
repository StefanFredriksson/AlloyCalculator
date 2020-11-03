using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class AlloyElement
    {
        public string name { get; set; }

        public double value { get; set; }

        public AlloyElement(string name, double value)
        {
            this.name = name;
            this.value = value;
        }
    }
}
