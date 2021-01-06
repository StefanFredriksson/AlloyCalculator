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
        public string Get([FromQuery] string name)
        {
            string json = "";
            if (name == null)
            {
                List<Steelgrade> steelgrades = GetSteelgrades(con, cmd);
                json = JsonConvert.SerializeObject(steelgrades);
            } else
            {
                Steelgrade steelgrade = GetOneSteelgrade(con, cmd, name);
                json = JsonConvert.SerializeObject(steelgrade);
            }

            return json;
        }

        [HttpPost]
        public StatusCodeResult Post([FromBody] Steelgrade steelgrade)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"insert into steelgrades (name, elements) " +
                $"values (\"{steelgrade.name}\", \"{steelgrade.elements.Replace("\"", "'")}\")", con);
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
        public StatusCodeResult Put([FromBody] PutSteelgrade putSteelgrade)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"update steelgrades set name='{putSteelgrade.steelgrade.name}', elements='{putSteelgrade.steelgrade.elements}' " +
                $"where name='{putSteelgrade.prevName}'", con);
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
        public String Delete([FromBody] string steelgrade)
        {
            con.Open();
            MySqlCommand cmd = new MySqlCommand($"delete from steelgrades where name='{steelgrade}'", con);
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            con.Close();

            return "Ok!";
        }

        private List<Steelgrade> GetSteelgrades(MySqlConnection con, MySqlCommand cmd)
        {
            if (con == null || con.State == System.Data.ConnectionState.Closed)
            {
                con.Open();
            }

            cmd = new MySqlCommand("select name, elements from steelgrades", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            List<Steelgrade> steelgrades = new List<Steelgrade>();

            while (reader.Read())
            {
                List<SteelgradeElement> elements = JsonConvert.DeserializeObject<IEnumerable<SteelgradeElement>>((string)reader[1]) as List<SteelgradeElement>;
                string name = (string)reader[0];
                steelgrades.Add(new Steelgrade(name, elements));
            }

            reader.Close();
            cmd.Dispose();
            con.Close();

            return steelgrades;
        }

        private Steelgrade GetOneSteelgrade(MySqlConnection con, MySqlCommand cmd, string name)
        {
            if (con == null || con.State == System.Data.ConnectionState.Closed)
            {
                con.Open();
            }

            cmd = new MySqlCommand($"select name, elements from steelgrades where name='{name}'", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            Steelgrade steelgrade = null;

            while (reader.Read())
            {
                List<SteelgradeElement> elements = JsonConvert.DeserializeObject<IEnumerable<SteelgradeElement>>((string)reader[1]) as List<SteelgradeElement>;
                string sgName = (string)reader[0];
                steelgrade = new Steelgrade(sgName, elements);
            }

            reader.Close();
            cmd.Dispose();
            con.Close();

            return steelgrade;
        }
    }
}