using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Steel_Analysis_API.Models
{
    public static class Logic
    {
        public static void BeginCalculation(Analysis analysis, List<Alloy> alloys)
        {
            AddIron(analysis);
            int counter = 0;

            while (counter < analysis.elementList.Count)
            {
                foreach (AnalysisElement e in analysis.elementList)
                {
                    if (e.actual < e.min && e.name != "Fe")
                    {
                        foreach (Alloy a in alloys)
                        {
                            if (a.ElementList.Any(ae => ae.name == e.name))
                            {
                                AddAlloy(a, e, analysis);
                                break;
                            }
                        }

                        counter = 0;
                        break;
                    }
                    else if (e.actual > e.max && e.name != "Fe")
                    {
                        Alloy feBase = alloys.Find(a => a.name == "Fe-base");
                        AddFeBase(e, feBase, analysis);

                        counter = 0;
                        break;
                    } else
                    {
                        counter++;
                    }
                }
            }
        }

        private static void AddIron(Analysis analysis)
        {
            double min = 1, max = 1, aim = 1, actual = 1, weight = analysis.weight;

            foreach (AnalysisElement ae in analysis.elementList)
            {
                min -= ae.min;
                max -= ae.max;
                aim -= ae.aim;
                actual -= ae.actual;
            }

            weight *= actual;

            analysis.elementList.Add(new AnalysisElement("Fe", min, aim, max, actual, weight));
        }

        private static void AddAlloy(Alloy a, AnalysisElement e, Analysis analysis)
        {
            double weightToAdd = analysis.weight * (e.aim - e.actual);
            double alloyWeightToAdd = 0;

            foreach (AlloyElement ae in a.ElementList)
            {
                if (ae.name == e.name)
                {
                    alloyWeightToAdd = weightToAdd / ae.value;
                }
            }

            analysis.weight += alloyWeightToAdd;

            foreach (AnalysisElement analysisE in analysis.elementList)
            {
                foreach (AlloyElement ae in a.ElementList)
                {
                    if (analysisE.name == ae.name)
                    {
                        analysisE.weight += ae.value * alloyWeightToAdd;
                    }
                }

                analysisE.actual = analysisE.weight / analysis.weight;
            }

            AddedAlloy addedAlloy = analysis.addedAlloys.Find(aa => aa.name == a.name);

            if (addedAlloy != null)
            {
                addedAlloy.Weight = alloyWeightToAdd;
            } else
            {
                AddedAlloy aa = new AddedAlloy(a.name, a.price);
                aa.Weight = weightToAdd;
                analysis.addedAlloys.Add(aa);
            }
        }

        private static void AddFeBase(AnalysisElement e, Alloy feBase, Analysis analysis)
        {
            double weightToAdd = analysis.weight * ((e.actual - e.aim) * 100);
            analysis.weight += weightToAdd;

            foreach (AnalysisElement ae in analysis.elementList)
            {
                foreach (AlloyElement alloy in feBase.ElementList)
                {
                    if (ae.name == alloy.name)
                    {
                        ae.weight += weightToAdd * alloy.value;
                    }
                }

                ae.actual = ae.weight / analysis.weight;
            }

            AddedAlloy addedAlloy = analysis.addedAlloys.Find(aa => aa.name == feBase.name);

            if (addedAlloy != null)
            {
                addedAlloy.Weight = weightToAdd;
            }
            else
            {
                AddedAlloy aa = new AddedAlloy(feBase.name, feBase.price);
                aa.Weight = weightToAdd;
                analysis.addedAlloys.Add(aa);
            }
        }
    }
}
