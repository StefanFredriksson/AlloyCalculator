using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class PutAnalysis
    {
        public Analysis analysis;
        public string prevName;

        [JsonConstructor]
        public PutAnalysis(Analysis analysis, string prevName)
        {
            this.analysis = analysis;
            this.prevName = prevName;
        }
    }
}
