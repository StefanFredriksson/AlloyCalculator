using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Steel_Analysis_API.Models
{
    public class Analysis
    {
        public string name, elements, steelgrade;
        public double weight;
        public List<AnalysisElement> elementList;
        public List<AddedAlloy> addedAlloys = new List<AddedAlloy>();

        [JsonConstructor]
        public Analysis(string name, string steelgrade, string elements, double weight)
        {
            this.name = name;
            this.steelgrade = steelgrade;
            this.elements = elements;
            this.weight = weight;
        }

        public Analysis(string name, string steelgrade, double weight, List<AnalysisElement> elementList)
        {
            this.name = name;
            this.steelgrade = steelgrade;
            this.weight = weight;
            this.elementList = elementList;
        }
    }
}
