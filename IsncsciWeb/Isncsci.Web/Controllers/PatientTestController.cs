/* Copyright 2014 Rick Hansen Institute
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Isncsci.Web.Models;
using Rhi.Isncsci;
using Isncsci.Web.Models.Algorithm;
using System;

namespace Isncsci.Web.Controllers
{
    public class TestType
    {
        public string TestType1 { get; set; }
        public int TestTypeId { get; set; }
    }

    public class PatientTestNeurologyFormModel
    {
        public PatientTest patientTest { get; set; }
        public NeurologyFormModel neurologyForm { get; set; }
    }

    public class ISNCSCIEntities : System.IDisposable
    {
        public IEnumerable<Patient> Patients { get; set; }
        public IEnumerable<TestType> TestTypes { get; set; }
        public IEnumerable<PatientTest> PatientTests { get; set; }

        public void Dispose()
        {
            //throw new NotImplementedException();
        }

        public void InsertPatientTest(System.Data.Entity.Core.Objects.ObjectParameter testIdCreated,
            string AccountNumber, string PatientName, string MRN, DateTime now, int TestTypeId,
            string Examiner1, string Examiner2, string physician, string Name)
        {

        }

    }

    public class PatientTest : NeurologyFormModel
    {
        public string AccountNumber { get; set; }
        public string PatientName { get; set; }
        public string PatientAccount { get; set; }
        public string PatientMREC { get; set; }
        public string AttendingPhysician { get; set; }
        public string MRN { get; set; }
        public DateTime TestDate { get; set; }
        public string AnalSensationId { get; set; }
        public string S45LeftPrick { get; set; }
        public string S45LeftTouch { get; set; }
        public string S45RightPrick { get; set; }
        public string S45RightTouch { get; set; }
        public int PatientTestId { get; set; }
        public int TestTypeId { get; set; }
    }

    public class Patient
    {
        public string AccountNumber { get; set; }
        public string PatientName { get; set; }
        public string PatientAccount { get; set; }
        public string PatientMREC { get; set; }
        public string Physician { get; set; }
        public string MRN { get; set; }
        public DateTime TestDate { get; set; }
    }

    public class PatientTestController : Controller
    {
        private ISNCSCIEntities iEntities = new ISNCSCIEntities();

        public ActionResult PatientSearch(PatientTest pt)
        {
            var patientTest = new PatientTest();
            var patient = new Patient();
            if (Request.Form["Search"] != null)
            {
                //string an = ViewBag.AccountNumberFilter;
                string an = Request.Form["Account Number"];
                try
                {
                    using (ISNCSCIEntities dc = new ISNCSCIEntities())
                    {
                        patient = dc.Patients.Where(p => p.AccountNumber == an).FirstOrDefault();
                        patientTest.PatientName = patient.PatientName;
                        patientTest.PatientAccount = patient.AccountNumber;
                        patientTest.PatientMREC = patient.MRN;
                        patientTest.AttendingPhysician = patient.Physician;
                        patientTest.TestDate = DateTime.Now;
                        TempData["AccountNumber"] = patient.AccountNumber;
                        TempData["PatientName"] = patient.PatientName;
                        TempData["MRN"] = patient.MRN;
                        TempData["Physician"] = patient.Physician;
                    }
                 }
                catch (Exception ex)
                {
                    ViewData["UpdateMessage"] = "There was a problem, please contact IT support - " + ex.Message;
                }
            }

            if (Request.Form["CreateTest"] != null)
            {
                //string an = Request.Form["Account Number"];
                System.Data.Entity.Core.Objects.ObjectParameter testIdCreated = new System.Data.Entity.Core.Objects.ObjectParameter("PatientTestID", typeof(Int32));

                try
                {
                    testIdCreated.Value = 0;
                    string physician;
                    if (TempData["Physician"] == null)
                    {
                        physician =  "";
                    }
                    else
                    {
                        physician = TempData["Physician"].ToString();
                    }

                    using (ISNCSCIEntities dc = new ISNCSCIEntities())
                    {
                        dc.InsertPatientTest(testIdCreated, TempData["AccountNumber"].ToString(), TempData["PatientName"].ToString(), TempData["MRN"].ToString(), DateTime.Now, Convert.ToInt32(Request.Form["TestTypeId"]), Request.Form["Examiner1"], Request.Form["Examiner2"], physician, User.Identity.Name);
                    }
                }
                catch (Exception ex)
                {
                    ViewData["UpdateMessage"] = "There was a problem, please contact IT support - " + ex.Message;
                }
                return RedirectToAction("Index", new { PatientTestId = testIdCreated.Value });

            }
            else
            {
                ViewBag.TestTypeList = new SelectList(iEntities.TestTypes.OrderBy(t => t.TestType1), "TestTypeId", "TestType1", "-- Please Select Type --");
                return View(patientTest);
            }
       
        }

        public ActionResult Index(int PatientTestId)
        {
            var patientTestType = new TestType();
            var patientTest = new PatientTest();
            patientTest.TestDate = DateTime.Now;
            var nf = new NeurologyFormModel()
            {
                AnalContraction = BinaryObservation.No,
                AnalSensation = BinaryObservation.Yes
            };
            var pnfm = new PatientTestNeurologyFormModel();

            //var patientNeurologyForm = new PatientNeurologyFormModel();
            //var ppt = new PatientPatientTest();

            try
            {
                using (ISNCSCIEntities dc = new ISNCSCIEntities())
                {
                    patientTest = dc.PatientTests.Where(p => p.PatientTestId == PatientTestId).FirstOrDefault();
                    //patient = dc.Patients.Where(p => p.AccountNumber == patientTest.PatientAccount).FirstOrDefault();
                    patientTestType = dc.TestTypes.Where(p => p.TestTypeId == patientTest.TestTypeId).FirstOrDefault();
                }
                //ViewBag.AnalContractionList = new SelectList(iEntities.Options.OrderBy(t => t.OptionId), "OptionId", "Option1", patientTest.AnalContractionId);
                //ViewBag.AnalSensationList = new SelectList(iEntities.Options.OrderBy(t => t.OptionId), "OptionId", "Option1", patientTest.AnalSensationId);
                //ViewBag.NonKeyMuscleList = new SelectList(iEntities.NonKeyMuscles.OrderBy(t => t.NonKeyMuscleId), "NonKeyMuscleId", "NonKeyMuscle1", "-- Please Select --");
                //ViewBag.LeftNonKeyMuscleList = new SelectList(iEntities.NonKeyMuscles.OrderBy(t => t.NonKeyMuscleId), "NonKeyMuscleId", "NonKeyMuscle1", "-- Please Select --");


                if (patientTest != null)
                {
                    pnfm.patientTest = patientTest;
                    ViewBag.TestTypeList = new SelectList(iEntities.TestTypes.OrderBy(t => t.TestType1), "TestTypeId", "TestType1", "-- Please Select Type --");
                    TestType tt = new TestType();
                    tt.TestTypeId = patientTest.TestTypeId;
                    tt.TestType1 = patientTestType.TestType1;
                    tt.TestTypeId = 0;
                    tt.TestType1 = "--Please Select a Type--";

                    if (patientTest.AnalSensationId != null)
                    {
                        nf.AnalSensation = (BinaryObservation)Enum.ToObject(typeof(BinaryObservation), patientTest.AnalSensationId);
                    }

                    //if (patientTest.AnalContractionId != null)
                    //{
                    //    nf.AnalContraction = (BinaryObservation)Enum.ToObject(typeof(BinaryObservation), patientTest.AnalContractionId);
                    //}
                    nf.C2LeftPrick = patientTest.C2LeftPrick ?? " ";
                    nf.C2LeftTouch = patientTest.C2LeftTouch?? " ";
                    nf.C2RightPrick = patientTest.C2RightPrick?? " ";
                    nf.C2RightTouch = patientTest.C2RightTouch?? " ";
                    nf.C3LeftPrick = patientTest.C3LeftPrick?? " ";
                    nf.C3LeftTouch = patientTest.C3LeftTouch?? " ";
                    nf.C3RightPrick = patientTest.C3RightPrick?? " ";
                    nf.C3RightTouch = patientTest.C3RightTouch?? " ";
                    nf.C4LeftPrick = patientTest.C4LeftPrick?? " ";
                    nf.C4LeftTouch = patientTest.C4LeftTouch?? " ";
                    nf.C4RightPrick = patientTest.C4RightPrick?? " ";
                    nf.C4RightTouch = patientTest.C4RightTouch?? " ";
                    nf.C5LeftMotor = patientTest.C5LeftMotor?? " ";
                    nf.C5LeftPrick = patientTest.C5LeftPrick?? " ";
                    nf.C5LeftTouch = patientTest.C5LeftTouch?? " ";
                    nf.C5RightMotor = patientTest.C5RightMotor?? " ";
                    nf.C5RightPrick = patientTest.C5RightPrick?? " ";
                    nf.C5RightTouch = patientTest.C5RightTouch?? " ";
                    nf.C6LeftMotor = patientTest.C6LeftMotor?? " ";
                    nf.C6LeftPrick = patientTest.C6LeftPrick?? " ";
                    nf.C6LeftTouch = patientTest.C6LeftTouch?? " ";
                    nf.C6RightMotor = patientTest.C6RightMotor?? " ";
                    nf.C6RightPrick = patientTest.C6RightPrick?? " ";
                    nf.C6RightTouch = patientTest.C6RightTouch?? " ";
                    nf.C7LeftMotor = patientTest.C7LeftMotor?? " ";
                    nf.C7LeftPrick = patientTest.C7LeftPrick?? " ";
                    nf.C7LeftTouch = patientTest.C7LeftTouch?? " ";
                    nf.C7RightMotor = patientTest.C7RightMotor ?? "";
                    nf.C7RightPrick = patientTest.C7RightPrick?? " ";
                    nf.C7RightTouch = patientTest.C7RightTouch?? " ";
                    nf.C8LeftMotor = patientTest.C8LeftMotor?? " ";
                    nf.C8LeftPrick = patientTest.C8LeftPrick?? " ";
                    nf.C8LeftTouch = patientTest.C8LeftTouch?? " ";
                    nf.C8RightMotor = patientTest.C8RightMotor?? " ";
                    nf.C8RightPrick = patientTest.C8RightPrick?? " ";
                    nf.C8RightTouch = patientTest.C8RightTouch?? " ";
                    nf.T1LeftMotor = patientTest.T1LeftMotor?? " ";
                    nf.T1LeftPrick = patientTest.T1LeftPrick?? " ";
                    nf.T1LeftTouch = patientTest.T1LeftTouch?? " ";
                    nf.T1RightMotor = patientTest.T1RightMotor?? " ";
                    nf.T1RightPrick = patientTest.T1RightPrick?? " ";
                    nf.T1RightTouch = patientTest.T1RightTouch?? " ";
                    nf.T2LeftPrick = patientTest.T2LeftPrick?? " ";
                    nf.T2LeftTouch = patientTest.T2LeftTouch?? " ";
                    nf.T2RightPrick = patientTest.T2RightPrick?? " ";
                    nf.T2RightTouch = patientTest.T2RightTouch?? " ";
                    nf.T3LeftPrick = patientTest.T3LeftPrick?? " ";
                    nf.T3LeftTouch = patientTest.T3LeftTouch?? " ";
                    nf.T3RightPrick = patientTest.T3RightPrick?? " ";
                    nf.T3RightTouch = patientTest.T3RightTouch?? " ";
                    nf.T4LeftPrick = patientTest.T4LeftPrick?? " ";
                    nf.T4LeftTouch = patientTest.T4LeftTouch?? " ";
                    nf.T4RightPrick = patientTest.T4RightPrick?? " ";
                    nf.T4RightTouch = patientTest.T4RightTouch?? " ";
                    nf.T5LeftPrick = patientTest.T5LeftPrick?? " ";
                    nf.T5LeftTouch = patientTest.T5LeftTouch?? " ";
                    nf.T5RightPrick = patientTest.T5RightPrick?? " ";
                    nf.T5RightTouch = patientTest.T5RightTouch?? " ";
                    nf.T6LeftPrick = patientTest.T6LeftPrick?? " ";
                    nf.T6LeftTouch = patientTest.T6LeftTouch?? " ";
                    nf.T6RightPrick = patientTest.T6RightPrick?? " ";
                    nf.T6RightTouch = patientTest.T6RightTouch?? " ";
                    nf.T7LeftPrick = patientTest.T7LeftPrick?? " ";
                    nf.T7LeftTouch = patientTest.T7LeftTouch?? " ";
                    nf.T7RightPrick = patientTest.T7RightPrick?? " ";
                    nf.T7RightTouch = patientTest.T7RightTouch?? " ";
                    nf.T8LeftPrick = patientTest.T8LeftPrick?? " ";
                    nf.T8LeftTouch = patientTest.T8LeftTouch?? " ";
                    nf.T8RightPrick = patientTest.T8RightPrick?? " ";
                    nf.T8RightTouch = patientTest.T8RightTouch?? " ";
                    nf.T9LeftPrick = patientTest.T9LeftPrick?? " ";
                    nf.T9LeftTouch = patientTest.T9LeftTouch?? " ";
                    nf.T9RightPrick = patientTest.T9RightPrick?? " ";
                    nf.T9RightTouch = patientTest.T9RightTouch?? " ";
                    nf.T10LeftPrick = patientTest.T10LeftPrick?? " ";
                    nf.T10LeftTouch = patientTest.T10LeftTouch?? " ";
                    nf.T10RightPrick = patientTest.T10RightPrick?? " ";
                    nf.T10RightTouch = patientTest.T10RightTouch?? " ";
                    nf.T11LeftPrick = patientTest.T11LeftPrick?? " ";
                    nf.T11LeftTouch = patientTest.T11LeftTouch?? " ";
                    nf.T11RightPrick = patientTest.T11RightPrick?? " ";
                    nf.T11RightTouch = patientTest.T11RightTouch?? " ";
                    nf.T12LeftPrick = patientTest.T12LeftPrick?? " ";
                    nf.T12LeftTouch = patientTest.T12LeftTouch?? " ";
                    nf.T12RightPrick = patientTest.T12RightPrick?? " ";
                    nf.T12RightTouch = patientTest.T12RightTouch?? " ";
                    nf.L1LeftPrick = patientTest.L1LeftPrick?? " ";
                    nf.L1LeftTouch = patientTest.L1LeftTouch?? " ";
                    nf.L1RightPrick = patientTest.L1RightPrick?? " ";
                    nf.L1RightTouch = patientTest.L1RightTouch?? " ";
                    nf.L2LeftMotor = patientTest.L2LeftMotor?? " ";
                    nf.L2LeftPrick = patientTest.L2LeftPrick?? " ";
                    nf.L2LeftTouch = patientTest.L2LeftTouch?? " ";
                    nf.L2RightMotor = patientTest.L2RightMotor?? " ";
                    nf.L2RightPrick = patientTest.L2RightPrick?? " ";
                    nf.L2RightTouch = patientTest.L2RightTouch?? " ";
                    nf.L3LeftMotor = patientTest.L3LeftMotor?? " ";
                    nf.L3LeftPrick = patientTest.L3LeftPrick?? " ";
                    nf.L3LeftTouch = patientTest.L3LeftTouch?? " ";
                    nf.L3RightMotor = patientTest.L3RightMotor?? " ";
                    nf.L3RightPrick = patientTest.L3RightPrick?? " ";
                    nf.L3RightTouch = patientTest.L3RightTouch?? " ";
                    nf.L4LeftMotor = patientTest.L4LeftMotor?? " ";
                    nf.L4LeftPrick = patientTest.L4LeftPrick?? " ";
                    nf.L4LeftTouch = patientTest.L4LeftTouch?? " ";
                    nf.L4RightMotor = patientTest.L4RightMotor?? " ";
                    nf.L4RightPrick = patientTest.L4RightPrick?? " ";
                    nf.L4RightTouch = patientTest.L4RightTouch?? " ";
                    nf.L5LeftMotor = patientTest.L5LeftMotor?? " ";
                    nf.L5LeftPrick = patientTest.L5LeftPrick?? " ";
                    nf.L5LeftTouch = patientTest.L5LeftTouch?? " ";
                    nf.L5RightMotor = patientTest.L5RightMotor?? " ";
                    nf.L5RightPrick = patientTest.L5RightPrick?? " ";
                    nf.L5RightTouch = patientTest.L5RightTouch?? " ";
                    nf.S1LeftMotor = patientTest.S1LeftMotor?? " ";
                    nf.S1LeftPrick = patientTest.S1LeftPrick?? " ";
                    nf.S1LeftTouch = patientTest.S1LeftTouch?? " ";
                    nf.S1RightMotor = patientTest.S1RightMotor?? " ";
                    nf.S1RightPrick = patientTest.S1RightPrick?? " ";
                    nf.S1RightTouch = patientTest.S1RightTouch?? " ";
                    nf.S2LeftPrick = patientTest.S2LeftPrick?? " ";
                    nf.S2LeftTouch = patientTest.S2LeftTouch?? " ";
                    nf.S2RightPrick = patientTest.S2RightPrick?? " ";
                    nf.S2RightTouch = patientTest.S2RightTouch?? " ";
                    nf.S3LeftPrick = patientTest.S3LeftPrick?? " ";
                    nf.S3LeftTouch = patientTest.S3LeftTouch?? " ";
                    nf.S3RightPrick = patientTest.S3RightPrick?? " ";
                    nf.S3RightTouch = patientTest.S3RightTouch?? " ";
                    nf.S4_5LeftPrick = patientTest.S45LeftPrick?? " ";
                    nf.S4_5LeftTouch = patientTest.S45LeftTouch?? " ";
                    nf.S4_5RightPrick = patientTest.S45RightPrick?? " ";
                    nf.S4_5RightTouch = patientTest.S45RightTouch?? " ";
                    nf.RightLowestNonKeyMuscleWithMotorFunction = patientTest.RightLowestNonKeyMuscleWithMotorFunction?? " ";
                    nf.LeftLowestNonKeyMuscleWithMotorFunction = patientTest.LeftLowestNonKeyMuscleWithMotorFunction?? " ";
                    nf.Comments = patientTest.Comments?? " ";
                    nf.RightMotorTotal = patientTest.RightMotorTotal?? " ";
                    nf.RightTouchTotal = patientTest.RightTouchTotal?? " ";
                    nf.RightPrickTotal = patientTest.RightPrickTotal?? " ";
                    nf.LeftMotorTotal = patientTest.LeftMotorTotal?? " ";
                    nf.LeftTouchTotal = patientTest.LeftTouchTotal?? " ";
                    nf.LeftPrickTotal = patientTest.LeftPrickTotal?? " ";
                    nf.MSUERTotal = patientTest.MSUERTotal?? " ";
                    nf.MSUELTotal = patientTest.MSUELTotal?? " ";
                    nf.MSUEMSTotal = patientTest.MSUEMSTotal?? " ";
                    nf.MSLERTotal = patientTest.MSLERTotal?? " ";
                    nf.MSLELTotal = patientTest.MSLELTotal?? " ";
                    nf.MSLEMSTotal = patientTest.MSLEMSTotal?? " ";
                    nf.SSLTRTotal = patientTest.SSLTRTotal?? " ";
                    nf.SSLTLTotal = patientTest.SSLTLTotal?? " ";
                    nf.SSLTTotal = patientTest.SSLTTotal?? " ";
                    nf.SSPPRTotal = patientTest.SSPPRTotal?? " ";
                    nf.SSPPLTotal = patientTest.SSPPLTotal?? " ";
                    nf.SSPPTotal = patientTest.SSPPTotal?? " ";
                    nf.NLSENSR = patientTest.NLSENSR?? " ";
                    nf.NLSENSL = patientTest.NLSENSL?? " ";
                    nf.NLMOTOTR = patientTest.NLMOTOTR?? " ";
                    nf.NLMOTORL = patientTest.NLMOTORL?? " ";
                    nf.NLInjury = patientTest.NLInjury?? " ";
                    nf.ComplIncompl = patientTest.ComplIncompl?? " "; 
                    nf.AIS = patientTest.AIS?? " ";
                    nf.ZonePartPresSensR = patientTest.ZonePartPresSensR?? " ";
                    nf.ZonePartPresSensL = patientTest.ZonePartPresSensL?? " ";
                    nf.ZonePartPresMotoR = patientTest.ZonePartPresMotoR?? " ";
                    nf.ZonePartPresMotoL = patientTest.ZonePartPresMotoL?? " ";
                    pnfm.neurologyForm = nf;

                }
            }
            catch (Exception ex)
            {
                ViewData["Message"] = "There was a problem, please contact IT support - " + ex.Message;
            }
            //return View(patientNeurologyForm);
            //return this.Json(nf);
            return View(pnfm);
            //return this.Json(nf, JsonRequestBehavior.AllowGet);
            //return this.Json(nf.ToString(), "application/json");
            //return View(pnf);
            //return RedirectToAction("Initialize", "NeurologyTest", new { NeurologyForm = nf });
        }

        [HttpPost]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult FormData(int PatientTestId)
        {
            //var x = text;
            var x = this.Request;
            var nfm = new NeurologyFormModel();
            var pt = new PatientTest();
            int testId = PatientTestId;
            try
            {
                using (ISNCSCIEntities dc = new ISNCSCIEntities())
                {
                    pt = dc.PatientTests.Where(p => p.PatientTestId == testId).FirstOrDefault();
                }
                //var model = new NeurologyFormModel
                //{
                    //nfm. AnalSensation = (BinaryObservation)Enum.ToObject(typeof(BinaryObservation), pt.AnalSensationId ?? 0);
                    //nfm.AnalContraction = (BinaryObservation)Enum.ToObject(typeof(BinaryObservation), pt.AnalContractionId ?? 0);
                    nfm.C2LeftPrick = pt.C2LeftPrick ?? "";
                    nfm.C2LeftTouch = pt.C2LeftTouch ?? "";
                    nfm.C2RightPrick = pt.C2RightPrick ?? ""; ;
                    nfm.C2RightTouch = pt.C2RightTouch ?? ""; ;
                    nfm.C3LeftPrick = pt.C3LeftPrick ?? ""; ;
                    nfm.C3LeftTouch = pt.C3LeftTouch ?? ""; ;
                    nfm.C3RightPrick = pt.C3RightPrick ?? ""; ;
                    nfm.C3RightTouch = pt.C3RightTouch?? "";
                    nfm.C4LeftPrick = pt.C4LeftPrick?? "";
                    nfm.C4LeftTouch = pt.C4LeftTouch?? "";
                    nfm.C4RightPrick = pt.C4RightPrick?? "";
                    nfm.C4RightTouch = pt.C4RightTouch?? "";
                    nfm.C5LeftMotor = pt.C5LeftMotor?? "";
                    nfm.C5LeftPrick = pt.C5LeftPrick?? "";
                    nfm.C5LeftTouch = pt.C5LeftTouch?? "";
                    nfm.C5RightMotor = pt.C5RightMotor?? "";
                    nfm.C5RightPrick = pt.C5RightPrick?? "";
                    nfm.C5RightTouch = pt.C5RightTouch?? "";
                    nfm.C6LeftMotor = pt.C6LeftMotor?? "";
                    nfm.C6LeftPrick = pt.C6LeftPrick?? "";
                    nfm.C6LeftTouch = pt.C6LeftTouch?? "";
                    nfm.C6RightMotor = pt.C6RightMotor?? "";
                    nfm.C6RightPrick = pt.C6RightPrick?? "";
                    nfm.C6RightTouch = pt.C6RightTouch?? "";
                    nfm.C7LeftMotor = pt.C7LeftMotor?? "";
                    nfm.C7LeftPrick = pt.C7LeftPrick?? "";
                    nfm.C7LeftTouch = pt.C7LeftTouch?? "";
                    nfm.C7RightMotor = pt.C7RightMotor?? "";
                    nfm.C7RightPrick = pt.C7RightPrick?? "";
                    nfm.C7RightTouch = pt.C7RightTouch?? "";
                    nfm.C8LeftMotor = pt.C8LeftMotor?? "";
                    nfm.C8LeftPrick = pt.C8LeftPrick?? "";
                    nfm.C8LeftTouch = pt.C8LeftTouch?? "";
                    nfm.C8RightMotor = pt.C8RightMotor?? "";
                    nfm.C8RightPrick = pt.C8RightPrick?? "";
                    nfm.C8RightTouch = pt.C8RightTouch?? "";
                    nfm.T1LeftMotor = pt.T1LeftMotor?? "";
                    nfm.T1LeftPrick = pt.T1LeftPrick?? "";
                    nfm.T1LeftTouch = pt.T1LeftTouch?? "";
                    nfm.T1RightMotor = pt.T1RightMotor?? "";
                    nfm.T1RightPrick = pt.T1RightPrick?? "";
                    nfm.T1RightTouch = pt.T1RightTouch?? "";
                    nfm.T2LeftPrick = pt.T2LeftPrick?? "";
                    nfm.T2LeftTouch = pt.T2LeftTouch?? "";
                    nfm.T2RightPrick = pt.T2RightPrick?? "";
                    nfm.T2RightTouch = pt.T2RightTouch?? "";
                    nfm.T3LeftPrick = pt.T3LeftPrick?? "";
                    nfm.T3LeftTouch = pt.T3LeftTouch?? "";
                    nfm.T3RightPrick = pt.T3RightPrick?? "";
                    nfm.T3RightTouch = pt.T3RightTouch?? "";
                    nfm.T4LeftPrick = pt.T4LeftPrick?? "";
                    nfm.T4LeftTouch = pt.T4LeftTouch?? "";
                    nfm.T4RightPrick = pt.T4RightPrick?? "";
                    nfm.T4RightTouch = pt.T4RightTouch?? "";
                    nfm.T5LeftPrick = pt.T5LeftPrick?? "";
                    nfm.T5LeftTouch = pt.T5LeftTouch?? "";
                    nfm.T5RightPrick = pt.T5RightPrick?? "";
                    nfm.T5RightTouch = pt.T5RightTouch?? "";
                    nfm.T6LeftPrick = pt.T6LeftPrick?? "";
                    nfm.T6LeftTouch = pt.T6LeftTouch?? "";
                    nfm.T6RightPrick = pt.T6RightPrick?? "";
                    nfm.T6RightTouch = pt.T6RightTouch?? "";
                    nfm.T7LeftPrick = pt.T7LeftPrick?? "";
                    nfm.T7LeftTouch = pt.T7LeftTouch?? "";
                    nfm.T7RightPrick = pt.T7RightPrick?? "";
                    nfm.T7RightTouch = pt.T7RightTouch?? "";
                    nfm.T8LeftPrick = pt.T8LeftPrick?? "";
                    nfm.T8LeftTouch = pt.T8LeftTouch?? "";
                    nfm.T8RightPrick = pt.T8RightPrick?? "";
                    nfm.T8RightTouch = pt.T8RightTouch?? "";
                    nfm.T9LeftPrick = pt.T9LeftPrick?? "";
                    nfm.T9LeftTouch = pt.T9LeftTouch?? "";
                    nfm.T9RightPrick = pt.T9RightPrick?? "";
                    nfm.T9RightTouch = pt.T9RightTouch?? "";
                    nfm.T10LeftPrick = pt.T10LeftPrick?? "";
                    nfm.T10LeftTouch = pt.T10LeftTouch?? "";
                    nfm.T10RightPrick = pt.T10RightPrick?? "";
                    nfm.T10RightTouch = pt.T10RightTouch?? "";
                    nfm.T11LeftPrick = pt.T11LeftPrick?? "";
                    nfm.T11LeftTouch = pt.T11LeftTouch?? "";
                    nfm.T11RightPrick = pt.T11RightPrick?? "";
                    nfm.T11RightTouch = pt.T11RightTouch?? "";
                    nfm.T12LeftPrick = pt.T12LeftPrick?? "";
                    nfm.T12LeftTouch = pt.T12LeftTouch?? "";
                    nfm.T12RightPrick = pt.T12RightPrick?? "";
                    nfm.T12RightTouch = pt.T12RightTouch?? "";
                    nfm.L1LeftPrick = pt.L1LeftPrick?? "";
                    nfm.L1LeftTouch = pt.L1LeftTouch?? "";
                    nfm.L1RightPrick = pt.L1RightPrick?? "";
                    nfm.L1RightTouch = pt.L1RightTouch?? "";
                    nfm.L2LeftMotor = pt.L2LeftMotor?? "";
                    nfm.L2LeftPrick = pt.L2LeftPrick?? "";
                    nfm.L2LeftTouch = pt.L2LeftTouch?? "";
                    nfm.L2RightMotor = pt.L2RightMotor?? "";
                    nfm.L2RightPrick = pt.L2RightPrick?? "";
                    nfm.L2RightTouch = pt.L2RightTouch?? "";
                    nfm.L3LeftMotor = pt.L3LeftMotor?? "";
                    nfm.L3LeftPrick = pt.L3LeftPrick?? "";
                    nfm.L3LeftTouch = pt.L3LeftTouch?? "";
                    nfm.L3RightMotor = pt.L3RightMotor?? "";
                    nfm.L3RightPrick = pt.L3RightPrick?? "";
                    nfm.L3RightTouch = pt.L3RightTouch?? "";
                    nfm.L4LeftMotor = pt.L4LeftMotor?? "";
                    nfm.L4LeftPrick = pt.L4LeftPrick?? "";
                    nfm.L4LeftTouch = pt.L4LeftTouch?? "";
                    nfm.L4RightMotor = pt.L4RightMotor?? "";
                    nfm.L4RightPrick = pt.L4RightPrick?? "";
                    nfm.L4RightTouch = pt.L4RightTouch?? "";
                    nfm.L5LeftMotor = pt.L5LeftMotor?? "";
                    nfm.L5LeftPrick = pt.L5LeftPrick?? "";
                    nfm.L5LeftTouch = pt.L5LeftTouch?? "";
                    nfm.L5RightMotor = pt.L5RightMotor?? "";
                    nfm.L5RightPrick = pt.L5RightPrick?? "";
                    nfm.L5RightTouch = pt.L5RightTouch?? "";
                    nfm.S1LeftMotor = pt.S1LeftMotor?? "";
                    nfm.S1LeftPrick = pt.S1LeftPrick?? "";
                    nfm.S1LeftTouch = pt.S1LeftTouch?? "";
                    nfm.S1RightMotor = pt.S1RightMotor?? "";
                    nfm.S1RightPrick = pt.S1RightPrick?? "";
                    nfm.S1RightTouch = pt.S1RightTouch?? "";
                    nfm.S2LeftPrick = pt.S2LeftPrick?? "";
                    nfm.S2LeftTouch = pt.S2LeftTouch?? "";
                    nfm.S2RightPrick = pt.S2RightPrick?? "";
                    nfm.S2RightTouch = pt.S2RightTouch?? "";
                    nfm.S3LeftPrick = pt.S3LeftPrick?? "";
                    nfm.S3LeftTouch = pt.S3LeftTouch?? "";
                    nfm.S3RightPrick = pt.S3RightPrick?? "";
                    nfm.S3RightTouch = pt.S3RightTouch?? "";
                    nfm.S4_5LeftPrick = pt.S45LeftPrick?? "";
                    nfm.S4_5LeftTouch = pt.S45LeftTouch?? "";
                    nfm.S4_5RightPrick = pt.S45RightPrick?? "";
                    nfm.S4_5RightTouch = pt.S45RightTouch?? "";
                    nfm.RightMotorTotal = pt.RightMotorTotal?? "";
                    nfm.RightTouchTotal = pt.RightTouchTotal?? "";
                    nfm.RightPrickTotal = pt.RightPrickTotal?? "";
                    nfm.LeftMotorTotal = pt.LeftMotorTotal?? "";
                    nfm.LeftTouchTotal = pt.LeftTouchTotal?? "";
                    nfm.LeftPrickTotal = pt.LeftPrickTotal?? "";
                    nfm.MSUERTotal = pt.MSUERTotal?? "";
                    nfm.MSUELTotal = pt.MSUELTotal?? "";
                    nfm.MSUEMSTotal = pt.MSUEMSTotal?? "";
                    nfm.MSLERTotal = pt.MSLERTotal?? "";
                    nfm.MSLELTotal = pt.MSLELTotal?? "";
                    nfm.MSLEMSTotal = pt.MSLEMSTotal?? "";
                    nfm.SSLTRTotal = pt.SSLTRTotal?? "";
                    nfm.SSLTLTotal = pt.SSLTLTotal?? "";
                    nfm.SSLTTotal = pt.SSLTTotal?? "";
                    nfm.SSPPRTotal = pt.SSPPRTotal?? "";
                    nfm.SSPPLTotal = pt.SSPPLTotal?? "";
                    nfm.SSPPTotal = pt.SSPPTotal?? "";
                    nfm.NLSENSR = pt.NLSENSR?? "";
                    nfm.NLSENSL = pt.NLSENSL?? "";
                    nfm.NLMOTOTR = pt.NLMOTOTR?? "";
                    nfm.NLMOTORL = pt.NLMOTORL?? "";
                    nfm.NLInjury = pt.NLInjury?? "";
                    nfm.ComplIncompl = pt.ComplIncompl?? "";
                    nfm.AIS = pt.AIS?? "";
                    nfm.ZonePartPresSensR = pt.ZonePartPresSensR?? "";
                    nfm.ZonePartPresSensL = pt.ZonePartPresSensL?? "";
                    nfm.ZonePartPresMotoR = pt.ZonePartPresMotoR?? "";
                    nfm.ZonePartPresMotoL = pt.ZonePartPresMotoL?? "";
                    nfm.Comments = pt.Comments?? "";
                //};
                return this.Json(nfm);
            }
            catch (Exception ex)
            {
                ViewData["UpdateMessage"] = "There was a problem, please contact IT support - " + ex.Message;
            }
            return this.Json(new NeurologyFormModel());
 
        }

        [HttpPost]
        public JsonResult Save(string PatientTestId, TestType testType, String Examiner1, String Examiner2, string TestStatusId, string C2RightTouch)
        {
            var x = Request.Form["PatientTest_PatientTestId"];
            //return RedirectToAction("Index", new { PatientTestId = 29 });
            return this.Json(new {
                PatientTestId = PatientTestId,
                Examiner1,
                Examiner2,
                TestStatusId,
                C2RightTouch
            });
        }
    }
}