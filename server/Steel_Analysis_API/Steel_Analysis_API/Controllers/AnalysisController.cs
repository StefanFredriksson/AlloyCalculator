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
using System.Net.Http;
using System.Net;

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
        public string Get([FromQuery] string name)
        {
            string json = "";

            if (name == null)
            {
                List<Analysis> analyses = GetAnalyses(con, cmd);
                json = JsonConvert.SerializeObject(analyses);
            } else
            {
                Analysis analysis = GetAnalysis(con, cmd, name);
                json = JsonConvert.SerializeObject(analysis);
            }

            return json;
        }

        [HttpPost]
        public StatusCodeResult Post([FromBody] Analysis analysis)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"insert into analysis (name, steelgrade, weight, maxWeight, elements)" +
                $"values (\"{analysis.name}\", \"{analysis.steelgrade}\", \"{analysis.weight}\", \"{analysis.maxWeight}\", \"{analysis.elements.Replace("\"", "'")}\")", con);
            try
            {
                cmd.ExecuteNonQuery();
            } catch (Exception e)
            {
                if (e.Message.ToUpper().Contains("DUPLICATE"))
                    return StatusCode(409);
            }
            cmd.Dispose();
            con.Close();

            return StatusCode(200);
        }

        [HttpPut]
        public StatusCodeResult Put([FromBody] PutAnalysis putAnalysis)
        {
            con.Open();

            MySqlCommand cmd = new MySqlCommand($"update analysis set name='{putAnalysis.analysis.name}', " +
                $"weight='{putAnalysis.analysis.weight}', maxWeight='{putAnalysis.analysis.maxWeight}', " +
                $"steelgrade='{putAnalysis.analysis.steelgrade}', elements='{putAnalysis.analysis.elements}' " +
                $"where name='{putAnalysis.prevName}'", con);
            try
            {
                cmd.ExecuteNonQuery();
            } catch (Exception e)
            {
                if (e.Message.ToUpper().Contains("DUPLICATE"))
                    return StatusCode(409);
            }
            cmd.Dispose();
            con.Close();

            return StatusCode(200);
        }

        [HttpDelete]
        public string Delete([FromBody] string analysis)
        {
            con.Open();
            MySqlCommand cmd = new MySqlCommand($"delete from analysis where name='{analysis}'", con);
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            con.Close();

            return "Ok!";
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
            //Analysis cheapest = Logic.CalculateUsingAllCombinations(analysis, alloys);

            Console.WriteLine("------------------------\nFINISHED\n------------------------------");
            //Console.WriteLine(cheapest.TotalPrice);

            Console.WriteLine(cheapest);

            string json = JsonConvert.SerializeObject(cheapest);

            return json;
        }

        private List<Analysis> GetAnalyses(MySqlConnection con, MySqlCommand cmd)
        {
            if (con == null || con.State == System.Data.ConnectionState.Closed)
            {
                con.Open();
            }

            cmd = new MySqlCommand("select name, steelgrade, weight, elements, maxWeight from analysis", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            List<Analysis> analyses = new List<Analysis>();

            while (reader.Read())
            {
                List<AnalysisElement> elements = JsonConvert.DeserializeObject<IEnumerable<AnalysisElement>>((string)reader[3]) as List<AnalysisElement>;
                string name = (string)reader[0];
                string steelgrade = (string)reader[1];
                double weight = (double)reader[2];
                double maxWeight = (double)reader[4];
                analyses.Add(new Analysis(name, steelgrade, weight, maxWeight, elements));
            }

            reader.Close();
            cmd.Dispose();
            con.Close();

            return analyses;
        }

        private Analysis GetAnalysis(MySqlConnection con, MySqlCommand cmd, string name)
        {
            if (con == null || con.State == System.Data.ConnectionState.Closed)
            {
                con.Open();
            }

            cmd = new MySqlCommand($"select name, steelgrade, weight, elements, maxWeight from analysis where name='{name}'", con);
            MySqlDataReader reader = cmd.ExecuteReader();
            Analysis analysis = null;

            while (reader.Read())
            {
                List<AnalysisElement> elements = JsonConvert.DeserializeObject<IEnumerable<AnalysisElement>>((string)reader[3]) as List<AnalysisElement>;
                string aName = (string)reader[0];
                string steelgrade = (string)reader[1];
                double weight = (double)reader[2];
                double maxWeight = (double)reader[4];
                analysis = new Analysis(aName, steelgrade, weight, maxWeight, elements);
            }

            reader.Close();
            cmd.Dispose();
            con.Close();

            return analysis;
        }
    }
}