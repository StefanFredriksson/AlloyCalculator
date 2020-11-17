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
        private static MySqlConnection con = null;
        private static MySqlCommand cmd = null;

        public AlloyController(IConfiguration config)
        {
            con = new MySqlConnection(config.GetValue<string>("DB_String"));
        }

        [HttpGet]
        public String Get()
        {
            List<Alloy> alloys = GetAlloys(con, cmd);
            string json = JsonConvert.SerializeObject(alloys);

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

        [HttpPut]
        public String Put([FromBody] PutAlloy putAlloy)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"update alloys set name='{putAlloy.alloy.name}', price='{putAlloy.alloy.price}', elements='{putAlloy.alloy.elements}'" +
                $" where name='{putAlloy.prevName}'", con);
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            con.Close();

            return "Ok!";
        }

        [HttpDelete]
        public String Delete([FromBody] string alloy)
        {
            con.Open();
            string query = $"delete from alloys where name=\"{alloy}\"";

            MySqlCommand cmd = new MySqlCommand(query, con);
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            con.Close();

            return "Ok!";
        }

        public static List<Alloy> GetAlloys(MySqlConnection con, MySqlCommand cmd)
        {
            if (con == null || con.State == ConnectionState.Closed)
            {
                con.Open();
            }
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

            reader.Close();
            cmd.Dispose();
            con.Close();

            return alloys;
        }
    }
}