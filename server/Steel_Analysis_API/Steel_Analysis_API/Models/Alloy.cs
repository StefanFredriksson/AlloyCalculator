using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Steel_Analysis_API.Models
{
    public class Alloy
    {
        public string name;
        public string elements;
        public double price;
        private List<AlloyElement> elementList;

        [JsonConstructor]
        public Alloy(string name, string elements, double price)
        {
            this.name = name;
            this.elements = elements;
            this.price = price;
        }

        public Alloy(string name, List<AlloyElement> elementList, double price)
        {
            this.name = name;
            ElementList = elementList;
            this.price = price;
        }

        public List<AlloyElement> ElementList
        {
            get { return elementList; }
            set { elementList = value; }
        }
    }
}
