using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class SteelgradeElement
    {
        public string name;
        public double min, max, aim;

        public SteelgradeElement(string name, double min, double max, double aim)
        {
            this.name = name;
            this.min = min;
            this.max = max;
            this.aim = aim;
        }
    }
}
