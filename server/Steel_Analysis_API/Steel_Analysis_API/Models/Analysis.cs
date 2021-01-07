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
        public double weight, maxWeight;
        public List<AnalysisElement> elementList;
        public List<AddedAlloy> addedAlloys = new List<AddedAlloy>();

        [JsonConstructor]
        public Analysis(string name, string steelgrade, string elements, double weight, double maxWeight)
        {
            this.name = name;
            this.steelgrade = steelgrade;
            this.elements = elements;
            this.weight = weight;
            this.maxWeight = maxWeight;
        }

        public Analysis(string name, string steelgrade, double weight, double maxWeight, List<AnalysisElement> elementList)
        {
            this.name = name;
            this.steelgrade = steelgrade;
            this.weight = weight;
            this.maxWeight = maxWeight;
            this.elementList = elementList;
        }

        public double TotalPrice
        {
            get
            {
                return addedAlloys.Sum(alloy => alloy.TotalPrice);
            }
        }

        public Analysis DeepCopy()
        {
            Analysis temp = new Analysis(name, steelgrade, weight, maxWeight, elementList);
            List<AnalysisElement> tempList = new List<AnalysisElement>();

            foreach (AnalysisElement ae in this.elementList)
            {
                tempList.Add(new AnalysisElement(ae.name, ae.min, ae.aim, ae.max, ae.actual, ae.weight));
            }

            List<AddedAlloy> tempAlloys = new List<AddedAlloy>();

            foreach (AddedAlloy alloy in addedAlloys)
            {
                AddedAlloy tempAlloy = new AddedAlloy(alloy.name, alloy.price);
                tempAlloy.Weight = alloy.Weight;
                tempAlloys.Add(tempAlloy);
            }

            temp.elementList = tempList;
            temp.addedAlloys = tempAlloys;

            return temp;
        }

        public override string ToString()
        {
            string print = "";

            print += "---------------------------------------\n";
            print += $"Total price: {TotalPrice}\n";
            foreach (AnalysisElement ae in elementList)
            {
                print += ae.ToString() + "\n";
            }

            print += "---------------------------------------";
            print += "ADDED ALLOYS\n";

            foreach (AddedAlloy alloy in addedAlloys)
            {
                print += alloy.ToString() + "\n";
            }

            print += "---------------------------------------";

            return print;
        }
    }
}
