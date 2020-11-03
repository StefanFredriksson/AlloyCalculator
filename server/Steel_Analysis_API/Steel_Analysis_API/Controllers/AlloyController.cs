using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;
using Steel_Analysis_API.Models;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace Steel_Analysis_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlloyController : ControllerBase
    {
        private MySqlConnection con = null;
        private MySqlCommand cmd = null;

        public AlloyController(IConfiguration config)
        {
            con = new MySqlConnection(config.GetValue<string>("DB_String"));
        }

        [HttpGet]
        public String Get()
        {
            con.Open();
            cmd = new MySqlCommand("select name, price, elements from alloys", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            List<Alloy> alloys = new List<Alloy>();

            while (reader.Read())
            {
                List<AlloyElement> elements = JsonConvert.DeserializeObject<IEnumerable<AlloyElement>>((string)reader[2]) as List<AlloyElement>;
                string name = (string)reader[0];
                double price = Double.Parse((string)reader[1]);
                alloys.Add(new Alloy(name, elements, price));
            }

            string json = JsonConvert.SerializeObject(alloys);

            reader.Close();
            cmd.Dispose();
            con.Close();

            return json;
        }

        [HttpPost]
        public String Post([FromBody] Alloy alloy)
        {
            con.Open();
            
            MySqlCommand cmd = new MySqlCommand($"insert into alloys (name, elements, price) " +
                $"values (\"{alloy.name}\", \"{alloy.elements.Replace("\"", "'")}\", \"{alloy.price}\")", con);
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            con.Close();

            return "OK!";
        }
    }
}