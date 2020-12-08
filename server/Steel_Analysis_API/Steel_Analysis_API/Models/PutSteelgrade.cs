﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public class PutSteelgrade
    {
        public Steelgrade steelgrade;
        public string prevName;

        [JsonConstructor]
        public PutSteelgrade(Steelgrade steelgrade, string prevName)
        {
            this.steelgrade = steelgrade;
            this.prevName = prevName;
        }
    }
}
