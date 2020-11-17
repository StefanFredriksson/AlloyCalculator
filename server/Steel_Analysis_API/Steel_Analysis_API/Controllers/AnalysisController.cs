using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Steel_Analysis_API.Models;
using Newtonsoft.Json;

namespace Steel_Analysis_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalysisController : ControllerBase
    {
        private MySqlConnection con = null;
        private MySqlCommand cmd = null;

        public AnalysisController(IConfiguration config)
        {
            con = new MySqlConnection(config.GetValue<string>("DB_String"));
        }

        [HttpGet]
        public string Get()
        {
            con.Open();
            cmd = new MySqlCommand("select name, steelgrade, weight, elements, maxWeight from analysis", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            List<Analysis> analysis = new List<Analysis>();

            while (reader.Read())
            {
                List<AnalysisElement> elements = JsonConvert.DeserializeObject<IEnumerable<AnalysisElement>>((string)reader[3]) as List<AnalysisElement>;
                string name = (string)reader[0];
                string steelgrade = (string)reader[1];
                double weight = (double)reader[2];
                double maxWeight = (double)reader[4];
                analysis.Add(new Analysis(name, steelgrade, weight, maxWeight, elements));
            }

            string json = JsonConvert.SerializeObject(analysis);

            reader.Close();
            cmd.Dispose();
            con.Close();

            return json;
        }

        [HttpPost]
        public string Post([FromBody] Analysis analysis)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"insert into analysis (name, steelgrade, weight, maxWeight, elements)" +
                $"values (\"{analysis.name}\", \"{analysis.steelgrade}\", \"{analysis.weight}\", \"{analysis.maxWeight}\", \"{analysis.elements.Replace("\"", "'")}\")", con);
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            con.Close();

            return "OK!";
        }

        [Route("/api/[controller]/calculate")]
        [HttpGet]
        public string Calculate([FromQuery(Name = "analysis")] string analysisName)
        {
            con.Open();
            cmd = new MySqlCommand($"select name, steelgrade, weight, elements, maxWeight from analysis where name=\"{analysisName}\"", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            Analysis analysis = null;
            
            while(reader.Read())
            {
                List<AnalysisElement> elements = JsonConvert.DeserializeObject<IEnumerable<AnalysisElement>>((string)reader[3]) as List<AnalysisElement>;
                analysis = new Analysis((string)reader[0], (string)reader[1], (double)reader[2], (double)reader[4], elements);
            }

            reader.Close();
            cmd.Dispose();
            con.Close();

            List<Alloy> alloys = AlloyController.GetAlloys(con, cmd);

            //Analysis cheapest = Logic.TestAlloy(analysis, alloys);
            //Analysis cheapest = Logic.BeginSimpleCalculation(analysis.DeepCopy(), alloys);
            Analysis cheapest = Logic.BeginCheapestCalculation(analysis, alloys);
            //Logic.CalculateUsingAllCombinations(analysis, alloys);

            Console.WriteLine("------------------------\nFINISHED\n------------------------------");
            //Console.WriteLine(cheapest.TotalPrice);

            Console.WriteLine(cheapest);

            string json = JsonConvert.SerializeObject(cheapest);

            return json;
        }
    }
}