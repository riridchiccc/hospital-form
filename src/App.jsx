import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { FormField } from "./components/FormField";
import { FormStep } from "./components/FormStep";
import logo from "./assets/Cedar-logo-01.png";
import bgImage from "./assets/unnamed.jpg";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db } from "./firebase"; 



function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", tel1: "", tel2: "", email: "", gender: "",
    maritalStatus: "", allergies: "", currentAddress: "", permanentAddress: "",
    nationality: "", stateOfOrigin: "", occupation: "", religion: "",
    emergencyName: "", emergencyPhone: "", emergencyAddress: "", nextOfKin: "",
    referral: "", insuranceName: "", insuranceId: ""
  });

  const [loading, setLoading] = useState(false);

  const requiredFields = [
    "fullName", "maritalStatus", "dob", "tel1", "gender",
    "currentAddress", "permanentAddress", "nationality",
    "stateOfOrigin", "gender",
    "emergencyName", "emergencyPhone", "nextOfKin","emergencyAddress"
  ];

  const handleSubmit = async () => {
  const missingFields = requiredFields.filter((field) => !formData[field]);

  if (missingFields.length > 0) {
    toast.error("Please fill all required fields before submitting!");
    return;
  }

  setLoading(true);
  const loadingToast = toast.loading("Submitting...");

  try {
    await emailjs.send(
      "CedarReception", 
      "template_fiqxapn", 
      formData, 
      "w1kNpp7UrLBEA8YQp"
    );

    await addDoc(collection(db, "patients"), {
      ...formData,
      createdAt: new Date()
    });

    toast.dismiss(loadingToast);
    toast.success("Form Submitted Successful!");
    setStep(1); 
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error("Submission failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <Toaster />

      <div className="w-full max-w-lg bg-[rgba(92,55,108,0.34)] backdrop-blur-3xl p-8 rounded-[20px] border border-white/25 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className=" h-16" />
          <h1 className="text-white font-bold text-xl mt-2">CEDAR GROUP HOSPITAL</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <FormStep key="s1">
              <FormField label="Full Name *" name="fullName" value={formData.fullName} onChange={handleChange} />
              <div className="grid gap-4">
                <FormField label="Date of Birth *" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                <FormField label="Gender *" name="gender" required as="select" options={["Male", "Female", "Other"]} value={formData.gender} onChange={handleChange} />
              </div>
              <FormField label="Phone 1 *" type="tel" name="tel1" value={formData.tel1} onChange={handleChange} />
              <FormField label="Phone 2" type="tel" name="tel2" value={formData.tel2} onChange={handleChange} />
              <FormField label="Email" name="email" value={formData.email} onChange={handleChange} />
              <button type="button" onClick={() => setStep(2)} className="w-full bg-purple-900 hover:bg-purple-700 duration-400 text-white py-3 rounded-xl font-bold mt-4">Next</button>
            </FormStep>
          )}

          {step === 2 && (
            <FormStep key="s2">
              <FormField label="Current Address *" name="currentAddress" as="textarea" value={formData.currentAddress} onChange={handleChange} />
              <FormField label="Permanent Address *"  name="permanentAddress" as="textarea" value={formData.permanentAddress} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nationality *" name="nationality"  value={formData.nationality} onChange={handleChange} />
                <FormField label="State of Origin *" name="stateOfOrigin" required value={formData.stateOfOrigin} onChange={handleChange} />
              </div>
              <FormField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/50 hover:bg-white/20 duration-400 text-white py-3 rounded-xl">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-purple-900 hover:bg-purple-700 duration-400 text-white py-3 rounded-xl">Next</button>
              </div>
            </FormStep>
          )}

          {step === 3 && (
            <FormStep key="s3">
              <FormField label="Allergies" name="allergies" as="text" value={formData.allergies} onChange={handleChange} />
              <div className="grid gap-4">
                <FormField label="Marital Status *" name="maritalStatus" as="select" options={["Single", "Married", "Divorced", "Widowed", "others"]} value={formData.maritalStatus} onChange={handleChange} />
              </div>
              <div className="grid gap-4">
                <FormField label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
              </div>

              <FormField label="Next of Kin *" name="nextOfKin" value={formData.nextOfKin} onChange={handleChange} />
              <FormField label="How did you hear about us? (Referral)" name="referral" as="select" options={["Friend/Family", "Social Media", "Google Search", "Doctor Referral", "Insurance Provider", "Emergency Visit", "Previous Patient", "Other"]} value={formData.referral} onChange={handleChange} />
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-white/50 hover:bg-white/20 duration-400 text-white py-3 rounded-xl">Back</button>
                <button type="button" onClick={() => setStep(4)} className="flex-1 bg-purple-900 hover:bg-purple-700 duration-400 text-white py-3 rounded-xl">Next</button>
              </div>
            </FormStep>
          )}

          {step === 4 && (
            <FormStep key="s4">
              <FormField label="Emergency Contact Name *" name="emergencyName" value={formData.emergencyName} onChange={handleChange} />
              <FormField label="Emergency Contact Phone *" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} />
              <FormField label="Emergency Contact Address *" name="emergencyAddress" value={formData.emergencyAddress} onChange={handleChange} />
              <FormField label="Insurance Name" name="insuranceName" value={formData.insuranceName} onChange={handleChange} />
              <FormField label="Insurance ID" name="insuranceId" value={formData.insuranceId} onChange={handleChange} />
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-white/50 hover:bg-white/20 duration-500 text-white py-3 rounded-xl">Back</button>
                <button
                  type="button" disabled={loading} onClick={handleSubmit} className={`flex-1 duration-500 text-white py-3 rounded-xl ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-900"
                    }`} >
                  {loading ? "Submitting..." : "Submit"}
                </button>              </div>
            </FormStep>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;