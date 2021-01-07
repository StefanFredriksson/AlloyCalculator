using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class AddedAlloy
    {
        public string name;
        public double price;
        private double weight;

        public AddedAlloy(string name, double price)
        {
            this.name = name;
            this.price = price;
        }

        public double Weight
        {
            get
            {
                return weight;
            } set
            {
                weight = value;
            }
        }

        public double AddWeight
        {
            set
            {
                weight += value;
            }
        }

        public double TotalPrice
        {
            get
            {
                return price * Weight;
            }
        }

        public override string ToString()
        {
            return $"Name: {name} \t Price: {price} \t Weight: {weight}";
        }
    }
}
