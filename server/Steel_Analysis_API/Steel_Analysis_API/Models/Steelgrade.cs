using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Steel_Analysis_API.Models
{
    public class Steelgrade
    {
        public string name, elements;
        public List<SteelgradeElement> elementList;

        [JsonConstructor]
        public Steelgrade(string name, string elements)
        {
            this.name = name;
            this.elements = elements;
        }

        public Steelgrade(string name, List<SteelgradeElement> elements)
        {
            this.name = name;
            elementList = elements;
        }
    }
}
