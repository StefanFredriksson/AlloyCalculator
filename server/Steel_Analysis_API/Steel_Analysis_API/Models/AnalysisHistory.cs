using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class AnalysisHistory
    {
        public string name;
        private double weight, price;
        public int rotation;

        public AnalysisHistory(string name, double weight, double price, int rotation)
        {
            this.name = name;
            Weight = weight;
            this.price = price;
            this.rotation = rotation;
        }

        public double Price
        {
            get { return price; }
        }

        public double Weight
        {
            get { return weight; }
            set { weight = value; }
        }

        public double TotalPrice
        {
            get
            {
                return Weight * price;
            }
        }
    }
}
