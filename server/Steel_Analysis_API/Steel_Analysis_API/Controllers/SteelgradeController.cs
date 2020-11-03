using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Steel_Analysis_API.Models;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace Steel_Analysis_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SteelgradeController : ControllerBase
    {
        private MySqlConnection con = null;
        private MySqlCommand cmd = null;

        public SteelgradeController(IConfiguration config)
        {
            con = new MySqlConnection(config.GetValue<string>("DB_String"));
        }

        [HttpGet]
        public String Get()
        {
            con.Open();
            cmd = new MySqlCommand("select name, elements from steelgrades", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            List<Steelgrade> steelgrades = new List<Steelgrade>();

            while (reader.Read())
            {
                List<SteelgradeElement> elements = JsonConvert.DeserializeObject<IEnumerable<SteelgradeElement>>((string)reader[1]) as List<SteelgradeElement>;
                string name = (string)reader[0];
                steelgrades.Add(new Steelgrade(name, elements));
            }

            string json = JsonConvert.SerializeObject(steelgrades);

            reader.Close();
            cmd.Dispose();
            con.Close();

            return json;
        }

        [HttpPost]
        public String Post([FromBody] Steelgrade steelgrade)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"insert into steelgrades (name, elements) " +
                $"values (\"{steelgrade.name}\", \"{steelgrade.elements.Replace("\"", "'")}\")", con);
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            con.Close();

            return "OK!";
        }
    }
}