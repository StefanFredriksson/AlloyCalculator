using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class AnalysisElement
    {
        public string name;
        public double min, aim, max, actual, weight;

        public AnalysisElement(string name, double min, double aim, double max, double actual, double weight)
        {
            this.name = name;
            this.min = min;
            this.aim = aim;
            this.max = max;
            this.actual = actual;
            this.weight = weight;
        }

        public override string ToString()
        {
            return $"Name: {name}\t min: {min}\t aim: {aim}\t max: {max}\t actual: {Math.Round(actual, 4)}\t weight: {Math.Round(weight)}";
        }

        public AnalysisElement DeepCopy()
        {
            AnalysisElement temp = (AnalysisElement) this.MemberwiseClone();
            temp.name = name;
            temp.min = min;
            temp.max = max;
            temp.aim = aim;
            temp.actual = actual;
            temp.weight = weight;

            return temp;
        }
    }
}
