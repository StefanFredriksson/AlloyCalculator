using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Steel_Analysis_API.Models
{
    public static class Logic
    {
        private static List<Analysis> triedAnalysis = new List<Analysis>();

        public static Analysis BeginCalculation(Analysis analysis, List<Alloy> alloys)
        {
            AddIron(analysis);
            int counter = 0;

            while (counter < analysis.elementList.Count)
            {
                foreach (AnalysisElement e in analysis.elementList)
                {
                    Console.WriteLine(e.name + "\n---------------------------------------");
                    //Console.WriteLine(JsonConvert.SerializeObject(analysis.addedAlloys));
                    Console.WriteLine(JsonConvert.SerializeObject(e));
                    Console.WriteLine("---------------------------------------");
                    double min = Double.MaxValue;

                    if (e.actual < e.min && e.name != "Fe")
                    {
                        Analysis cheapest = null;
                        foreach (Alloy a in alloys)
                        {
                            if (a.ElementList.Any(ae => ae.name == e.name))
                            {
                                Analysis tempAnalysis = analysis.DeepCopy();
                                //Console.WriteLine("Before: " + tempAnalysis.TotalPrice);
                                AddAlloy(a, e, tempAnalysis);
                                //Console.WriteLine("After: " + tempAnalysis.TotalPrice);
                                //Console.WriteLine("--------------------------------------");
                                /*Console.WriteLine("--------------------------------------");
                                Console.WriteLine(e.name);
                                Console.WriteLine(a.name);
                                Console.WriteLine(analysis.TotalPrice);
                                Console.WriteLine("--------------------------------------");*/
                                if (tempAnalysis.TotalPrice < min)
                                {
                                    min = tempAnalysis.TotalPrice;
                                    cheapest = tempAnalysis.DeepCopy();
                                } else if (Double.IsInfinity(tempAnalysis.TotalPrice))
                                {
                                    double sum = 0;
                                    Console.WriteLine(a.name);

                                    foreach (AddedAlloy al in tempAnalysis.addedAlloys)
                                    {
                                        sum += al.TotalPrice;
                                        Console.WriteLine(sum);
                                    }

                                    return analysis;
                                }
                            }
                        }

                        analysis = cheapest.DeepCopy();
                        counter = 0;
                        break;
                    }
                    else if (e.actual > e.max && e.name != "Fe")
                    {
                        Alloy feBase = alloys.Find(a => a.name == "Fe-base");
                        AddFeBase(e, feBase, analysis);

                        counter = 0;
                        break;
                    }
                    else
                    {
                        counter++;
                    }
                }
            }

            return analysis;
        }

        private static void AddIron(Analysis analysis)
        {
            double min = 1, max = 1, aim = 1, actual = 1, weight = analysis.weight;

            foreach (AnalysisElement ae in analysis.elementList)
            {
                min -= ae.max;
                max -= ae.min;
                aim -= ae.aim;
                actual -= ae.actual;
            }

            weight *= actual;

            analysis.elementList.Add(new AnalysisElement("Fe", min, aim, max, actual, weight));
        }

        public static Analysis TestAlloy(Analysis analysis, List<Alloy> alloys)
        {
            double add = 0.1;
            int finishedCount = 0;

            AddIron(analysis);

            while (finishedCount < analysis.elementList.Count)
            {
                foreach (AnalysisElement analysisElement in analysis.elementList)
                {
                    if (analysisElement.actual < analysisElement.min && analysisElement.name != "Fe")
                    {
                        Analysis bestAnalysis = analysis.DeepCopy();
                        double bestPoints = Double.MaxValue;
                        string name = ";";
                        foreach (Alloy alloy in alloys)
                        {
                            if (alloy.name == "Fe-base")
                            {
                                continue;
                            }

                            if (alloy.ElementList.Any(a => a.name == analysisElement.name))
                            {
                                Analysis tempAnalysis = analysis.DeepCopy();
                                tempAnalysis.weight += add;

                                AddedAlloy addedAlloy = tempAnalysis.addedAlloys.Find(aa => aa.name == alloy.name);

                                if (addedAlloy == null)
                                {
                                    addedAlloy = new AddedAlloy(alloy.name, alloy.price);
                                    addedAlloy.Weight = add;
                                    tempAnalysis.addedAlloys.Add(addedAlloy);
                                } else
                                {
                                    addedAlloy.AddWeight = add;
                                }

                                foreach (AnalysisElement ae in tempAnalysis.elementList)
                                {
                                    AlloyElement alloyElement = alloy.ElementList.Find(a => a.name == ae.name);

                                    if (alloyElement != null)
                                    {
                                        ae.weight += add * alloyElement.value;
                                    }

                                    ae.actual = ae.weight / tempAnalysis.weight;
                                }

                                double points = CalculatePoints(tempAnalysis, analysis, alloy, analysisElement);
                                /*for (int i = 0; i < tempAnalysis.elementList.Count; i++)
                                {
                                    if (tempAnalysis.elementList[i].name == "Fe")
                                    {
                                        continue;
                                    }

                                    AnalysisElement temp = tempAnalysis.elementList[i];
                                    AnalysisElement original = analysis.elementList[i];

                                    double tempDistance = 0, originalDistance = 0;

                                    tempDistance = temp.actual > temp.aim ? temp.actual - temp.aim : temp.aim - temp.actual;
                                    originalDistance = original.actual > original.aim ? original.actual - original.aim : original.aim - original.actual;

                                    if (tempDistance < originalDistance)
                                    {
                                        //points += tempDistance * alloy.price;
                                        points -= tempDistance;
                                    } else if (tempDistance > originalDistance)
                                    {
                                        points += tempDistance;
                                        // Possibly subtract points?
                                    }

                                    if (temp.actual >= temp.min && temp.actual <= temp.max)
                                    {
                                    } else
                                    {
                                        points += 1;
                                    }
                                }

                                points *= (alloy.price * add);*/
                                //Console.WriteLine(analysisElement.name + "::" + alloy.name + ": " + points);
                                if (points < bestPoints)
                                {
                                    bestPoints = points;
                                    bestAnalysis = tempAnalysis;
                                    name = alloy.name;
                                }
                            }
                        }
                        Console.WriteLine(analysisElement.name + "::" + name);
                        //Console.WriteLine(bestAnalysis);
                        analysis = bestAnalysis;
                        finishedCount = 0;
                        break;
                    } else if (analysisElement.actual > analysisElement.max && analysisElement.name != "Fe")
                    {
                        Alloy feBase = alloys.Find(a => a.name == "Fe-base");
                        AddFeBase(analysisElement, feBase, analysis);
                        finishedCount = 0;
                        break;
                    } else
                    {
                        finishedCount++;
                    }
                }
            }

            return analysis;
        }

        private static double AddAlloy(Alloy a, AnalysisElement e, Analysis analysis)
        {
            //double weightToAdd = analysis.weight * (e.aim - e.actual);
            double weightToAdd = 0.1;
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

            /*\frac{\left(0.1\ +\ 0.0005\cdot \left(1000\ +\ x\right)\right)}{\left(1000\ +\ x\right)}=0.018*/

            AddedAlloy addedAlloy = analysis.addedAlloys.Find(aa => aa.name == a.name);

            if (addedAlloy != null)
            {
                addedAlloy.AddWeight = alloyWeightToAdd;
            } else
            {
                AddedAlloy aa = new AddedAlloy(a.name, a.price);
                aa.AddWeight = weightToAdd;
                analysis.addedAlloys.Add(aa);
            }

            return alloyWeightToAdd;
        }

        private static double AddFeBase(AnalysisElement e, Alloy feBase, Analysis analysis)
        {
            //double weightToAdd = analysis.weight * ((e.actual - e.aim) * 100);
            double weightToAdd = 1;
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
                addedAlloy.AddWeight = weightToAdd;
            }
            else
            {
                AddedAlloy aa = new AddedAlloy(feBase.name, feBase.price);
                aa.Weight = weightToAdd;
                analysis.addedAlloys.Add(aa);
            }

            return weightToAdd;
        }

        public static Analysis BeginCheapestCalculation(Analysis analysis, List<Alloy> alloys)
        {
            AddIron(analysis);
            int counter = 0;

            while (counter < analysis.elementList.Count)
            {
                if (analysis.weight > analysis.maxWeight)
                    break;

                foreach (AnalysisElement analysisElement in analysis.elementList)
                {
                    if ((analysisElement.actual < analysisElement.min/* || analysisElement.aim - analysisElement.actual > (analysisElement.aim - analysisElement.min) / 2*/) && 
                            analysisElement.name != "Fe")
                    {
                        Analysis cheapest = analysis.DeepCopy();
                        double minPoints = Double.MaxValue;
                        string name = "";

                        foreach (Alloy alloy in alloys)
                        {
                            Analysis temp = analysis.DeepCopy();

                            if (alloy.ElementList.Any(a => a.name == analysisElement.name))
                            {
                                AddAlloy(alloy, analysisElement, temp);
                                double points = CalculatePoints(temp, analysis, alloy, analysisElement);

                                if (points < minPoints)
                                {
                                    minPoints = points;
                                    cheapest = temp;
                                    name = alloy.name;
                                }
                            }
                        }

                        analysis = cheapest;
                        counter = 0;
                    }
                    else if ((analysisElement.actual > analysisElement.max/* || analysisElement.actual - analysisElement.aim > (analysisElement.max - analysisElement.aim) / 2*/) && 
                        analysisElement.name != "Fe")
                    {
                        Alloy feBase = alloys.Find(a => a.name == "Fe-base");
                        AddFeBase(analysisElement, feBase, analysis);

                        counter = 0;
                        break;
                    } else
                    {
                        counter++;
                    }
                }
            }

            return analysis;
        }

        private static List<Alloy> FilterAlloys(Analysis analysis, List<Alloy> alloys)
        {
            List<Alloy> filtered = new List<Alloy>();

            foreach (Alloy alloy in alloys)
            {
                if (alloy.name == "Fe-base")
                    filtered.Add(alloy);
                else
                {
                    foreach (AlloyElement ae in alloy.ElementList)
                    {
                        if (ae.name != "Fe" && analysis.elementList.Find(element => element.name == ae.name) != null)
                        {
                            filtered.Add(alloy);
                            break;
                        }
                    }
                }
            }

            return filtered;
        }

        static long cnt = 0;
        static double minPrice = 0;

        public static Analysis CalculateUsingAllCombinations(Analysis analysis, List<Alloy> alloys)
        {
            cnt = 0;
            Analysis temp = analysis.DeepCopy();
            Analysis baseline = BeginCheapestCalculation(temp, alloys);
            minPrice = baseline.TotalPrice;
            AddIron(analysis);
            List<Alloy> filtered = FilterAlloys(analysis, alloys);
            RecursiveCalc(analysis, alloys);
            double min = Double.MaxValue;
            Analysis cheapest = null;

            Console.WriteLine($"{baseline.TotalPrice}  {triedAnalysis.Count}");

            if (triedAnalysis.Count == 0)
                return baseline;

            foreach (Analysis a in triedAnalysis)
            {
                Console.WriteLine(a.ToString());
                if (AnalysisFinished(a) && a.TotalPrice < min)
                {
                    cheapest = a;
                    min = a.TotalPrice;
                }
            }

            return cheapest;
        }

        private static bool AnalysisFinished(Analysis analysis)
        {
            foreach (AnalysisElement ae in analysis.elementList)
            {
                if (ae.actual < ae.min || ae.actual > ae.max)
                    return false;
            }

            return true;
        }

        private static void AddAlloyRec(Analysis analysis, Alloy alloy, double weightToAdd)
        {
            analysis.weight += weightToAdd;
            cnt++;

            if (cnt % 1000000 == 0)
                Console.WriteLine(cnt / 1000000);

            List<ElementWithin> within = new List<ElementWithin>();

            foreach (AlloyElement alloyElement in alloy.ElementList)
            {

                AnalysisElement ae = analysis.elementList.Find(element => element.name == alloyElement.name);

                if (ae != null)
                {
                    if (ae.name != "Fe")
                    {
                        int aboveOrBelow = 0;

                        if (ae.actual < ae.min)
                            aboveOrBelow = -1000;
                        else if (ae.actual > ae.max)
                            aboveOrBelow = 1000;
                        within.Add(new ElementWithin(ae.name, (ae.actual >= ae.min && ae.actual <= ae.max), aboveOrBelow));
                    }

                    ae.weight += weightToAdd * alloyElement.value;
                }
            }
            
            foreach (AnalysisElement ae in analysis.elementList)
                ae.actual = ae.weight / analysis.weight;


            if (weightToAdd == 1)
            {
                foreach (ElementWithin ew in within)
                {
                    AnalysisElement ae = analysis.elementList.Find(element => element.name == ew.name);

                    if (ae != null)
                    {
                        if (!ew.within && ((ae.actual >= ae.min && ae.actual <= ae.max) || (ae.actual > ae.max && ew.aboveOrBelow < 0) || (ae.actual < ae.min && ew.aboveOrBelow > 0)))
                        {
                            analysis.weight -= weightToAdd;

                            foreach (AlloyElement alloyElement in alloy.ElementList)
                            {
                                AnalysisElement analysisElement = analysis.elementList.Find(element => element.name == alloyElement.name);

                                if (analysisElement != null)
                                {
                                    analysisElement.weight -= weightToAdd * alloyElement.value;
                                }
                            }

                            foreach (AnalysisElement analysisElement in analysis.elementList)
                                analysisElement.actual = analysisElement.weight / analysis.weight;

                            AddAlloyRec(analysis, alloy, weightToAdd / 10);

                            return;
                        }
                    }
                }
            }

            AddedAlloy addedAlloy = analysis.addedAlloys.Find(aa => aa.name == alloy.name);

            if (addedAlloy != null)
            {
                addedAlloy.AddWeight = weightToAdd;
            } else
            {
                addedAlloy = new AddedAlloy(alloy.name, alloy.price);
                addedAlloy.AddWeight = weightToAdd;
                analysis.addedAlloys.Add(addedAlloy);
            }
        }

        private static void RecursiveCalc(Analysis analysis, List<Alloy> alloys)
        {
            //Console.WriteLine($"Weight: {analysis.weight}\t Max weight: {analysis.maxWeight}");
            if (AnalysisFinished(analysis))
            {
                if (analysis.TotalPrice < minPrice)
                    minPrice = analysis.TotalPrice;

                triedAnalysis.Add(analysis);
                return;
            }

            if (analysis.weight >= analysis.maxWeight || analysis.TotalPrice > minPrice)
                return;

            for (int i = 0; i < alloys.Count; i++)
            {
                List<Alloy> remaining = new List<Alloy>();
                Alloy alloy = alloys[i];

                /*if ((alloy.name != "Fe-base" && AllowMin(analysis, alloy)) || (alloy.name == "Fe-base" && AllowMax(analysis)))
                    AddAlloyRec(analysis, alloy, 1);
                else
                    continue;*/
                AddAlloyRec(analysis, alloy, 10);

                for (int j = i; j < alloys.Count; j++)
                    remaining.Add(alloys[j]);

                Analysis analysis_rec = analysis.DeepCopy();
                RecursiveCalc(analysis_rec, remaining);
            }
        }

        private static bool AllowMin(Analysis analysis, Alloy alloy)
        {
            foreach (AlloyElement alloyElement in alloy.ElementList)
            {
                if (alloyElement.name == "fe")
                    continue;

                AnalysisElement analysisElement = analysis.elementList.Find(element => element.name == alloyElement.name);

                if (analysisElement != null && analysisElement.actual < analysisElement.min)
                    return true;
            }

            return false;
        }

        private static bool AllowMax(Analysis analysis)
        {
            foreach (AnalysisElement ae in analysis.elementList)
            {
                if (ae.actual > ae.max)
                    return true;
            }

            return false;
        }

        private static double CalculatePoints(Analysis temp, Analysis original, Alloy alloy, AnalysisElement analysisElement)
        {
            double points = 0;

            for (int i = 0; i < alloy.ElementList.Count; i++)
            {
                AnalysisElement tempElement = temp.elementList.Find(e => e.name == alloy.ElementList[i].name);
                AnalysisElement originalElement = original.elementList.Find(e => e.name == alloy.ElementList[i].name);

                if (tempElement == null)
                {
                    continue;
                }

                double magnitude = 1;

                if (tempElement.actual < tempElement.min)
                {
                    magnitude = tempElement.min / tempElement.actual;
                }
                else if (tempElement.actual > tempElement.max)
                {
                    magnitude = tempElement.actual / tempElement.max;
                }

                double tempDistance = tempElement.actual < tempElement.aim ? tempElement.aim - tempElement.actual : tempElement.actual - tempElement.aim;
                double originalDistance = originalElement.actual < originalElement.aim ? originalElement.aim - originalElement.actual : originalElement.actual - originalElement.aim;

                //Console.WriteLine(alloy.name + "::" + tempElement.name + "    " + tempDistance + " :: " + originalDistance);

                if (tempDistance < originalDistance)
                {
                    points += tempDistance;
                } else if (tempDistance > originalDistance && tempElement.name == analysisElement.name)
                {
                    return Double.MaxValue;
                } else if (tempDistance == originalDistance)
                {
                    points += 10;
                } else
                {
                    points += (1 / tempDistance) * magnitude;
                }

                /*if (tempElement.actual < tempElement.min || tempElement.actual > tempElement.max)
                {
                    //points += 10 * (tempDistance * 100);
                    return Double.MaxValue;
                }*/

                points *= magnitude;
            }

            return points * (alloy.price * (temp.weight - original.weight));
        }

        public static Analysis BeginSimpleCalculation(Analysis analysis, List<Alloy> alloys)
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
                    }
                    else
                    {
                        counter++;
                    }
                }
            }

            return analysis;
        }
    }
}
