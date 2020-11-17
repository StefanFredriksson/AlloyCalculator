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

        public static void CalculateUsingAllCombinations(Analysis analysis, List<Alloy> alloys)
        {
            AddIron(analysis);

            foreach (AnalysisElement analysisElement in analysis.elementList)
            {
                if (analysisElement.actual < analysisElement.min && analysisElement.name != "Fe")
                {
                    List<Alloy> allowedAlloys = alloys.FindAll(a => a.ElementList.Any(ae => ae.name == analysisElement.name /*&& ae.value >= 0.6*/));
                    Console.WriteLine(allowedAlloys.Count);
                    RecursiveCalc(allowedAlloys, new List<AddedAlloy>(), analysisElement, analysisElement, analysis.DeepCopy());
                }
            }

            Console.WriteLine("-------------------------------------------------------\n" + triedAnalysis.Count);
        }

        private static void RecursiveCalc(List<Alloy> alloys, List<AddedAlloy> partial, AnalysisElement analysisElement, AnalysisElement previous, Analysis analysis)
        {
            double add = 0.1;
            double sum = 0;
            AnalysisElement temp = analysisElement.DeepCopy();

            /*foreach (AddedAlloy addedAlloy in partial)
            {
                sum = addedAlloy.Weight * alloys.Find(alloy => alloy.name == addedAlloy.name).ElementList.Find(element => element.name == analysisElement.name).value;
            }*/

            double previousDistance = previous.actual > previous.aim ? previous.actual - previous.aim : previous.aim - previous.actual;
            double currentDistance = analysisElement.actual > analysisElement.aim ? analysisElement.actual - analysisElement.aim : analysisElement.aim - analysisElement.actual;

            if (analysisElement.actual >= analysisElement.min && analysisElement.actual <= analysisElement.max)
            {
                triedAnalysis.Add(analysis.DeepCopy());
                return;
            } else if (analysisElement.actual >= analysisElement.max || currentDistance > previousDistance)
            {
                return;
            }

            for (int i = 0; i < alloys.Count; i++)
            {
                List<Alloy> remaining = new List<Alloy>();
                Alloy alloy = alloys[i];

                for (int j = i; j < alloys.Count; j++)
                    remaining.Add(alloys[j]);

                List<AddedAlloy> partial_rec = new List<AddedAlloy>(partial);
                AddedAlloy addedAlloy = new AddedAlloy(alloy.name, alloy.price);
                addedAlloy.Weight = add;
                analysis.weight += add;
                Console.WriteLine(analysis);
                Thread.Sleep(1000);
                partial_rec.Add(addedAlloy);

                foreach (AnalysisElement ae in analysis.elementList)
                {
                    foreach (AlloyElement alloyElement in alloy.ElementList)
                    {
                        if (alloyElement.name == ae.name)
                        {
                            ae.weight += add * alloyElement.value;
                        }
                    }

                    ae.actual = ae.weight / analysis.weight;
                }

                RecursiveCalc(remaining, partial_rec, analysisElement, temp, analysis.DeepCopy());
            }
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
