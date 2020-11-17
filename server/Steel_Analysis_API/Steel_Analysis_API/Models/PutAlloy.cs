using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Steel_Analysis_API.Models
{
    public class PutAlloy
    {
        public Alloy alloy;
        public string prevName;

        [JsonConstructor]
        public PutAlloy(Alloy alloy, string prevName)
        {
            this.alloy = alloy;
            this.prevName = prevName;
        }
    }
}
