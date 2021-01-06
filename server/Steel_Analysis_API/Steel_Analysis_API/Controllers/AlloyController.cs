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
        public String Get([FromQuery] string name)
        {
            string json = "";

            if (name == null)
            {
                List<Alloy> alloys = GetAlloys(con, cmd);
                json = JsonConvert.SerializeObject(alloys);
            } else
            {
                Alloy alloy = GetOneAlloy(con, cmd, name);
                json = JsonConvert.SerializeObject(alloy);
            }
            

            return json;
        }

        [HttpPost]
        public StatusCodeResult Post([FromBody] Alloy alloy)
        {
            con.Open();
            
            MySqlCommand cmd = new MySqlCommand($"insert into alloys (name, elements, price) " +
                $"values (\"{alloy.name}\", \"{alloy.elements.Replace("\"", "'")}\", \"{alloy.price}\")", con);
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                if (e.Message.ToUpper().Contains("DUPLICATE"))
                    return StatusCode(409);
            }
            cmd.Dispose();
            con.Close();

            return StatusCode(200);
        }

        [HttpPut]
        public StatusCodeResult Put([FromBody] PutAlloy putAlloy)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"update alloys set name='{putAlloy.alloy.name}', price='{putAlloy.alloy.price}', elements='{putAlloy.alloy.elements}'" +
                $" where name='{putAlloy.prevName}'", con);
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                if (e.Message.ToUpper().Contains("DUPLICATE"))
                    return StatusCode(409);
            }
            cmd.Dispose();
            con.Close();

            return StatusCode(200);
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

        private static Alloy GetOneAlloy(MySqlConnection con, MySqlCommand cmd, string name)
        {
            if (con == null || con.State == ConnectionState.Closed)
            {
                con.Open();
            }

            cmd = new MySqlCommand($"select name, price, elements from alloys where name=\"{name}\"", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            Alloy alloy = null;

            while (reader.Read())
            {
                List<AlloyElement> elements = JsonConvert.DeserializeObject<IEnumerable<AlloyElement>>((string)reader[2]) as List<AlloyElement>;
                string alloyName = (string)reader[0];
                double price = Double.Parse((string)reader[1]);
                alloy = new Alloy(alloyName, elements, price);
            }

            reader.Close();
            cmd.Dispose();
            con.Close();

            return alloy;
        }
    }
}