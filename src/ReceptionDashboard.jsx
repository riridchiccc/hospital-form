import { useEffect, useMemo, useState } from "react";
import {
Search,
Users,
User,
Phone,
HeartPulse,
ShieldCheck,
BriefcaseBusiness,
CalendarDays,
Radio,
X,
UserRound,
ChevronRight,
Activity,
} from "lucide-react";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import logo from "./assets/Cedar-logo-01.png";
import bgImage from "./assets/unnamed.jpg";

/* =========================================================
REUSABLE COMPONENTS
========================================================= */

/**

* Small piece of patient information.
  */
  function InfoItem({ label, value }) {
  return (

   <div>
     <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
       {label}
     </p>

     <p className="mt-1.5 text-sm sm:text-[15px] text-gray-800 break-words">
       {value || "—"}
     </p>
   </div>

);
}

/**

* White glass information section.
  */
  function Section({ icon, title, children }) {
  return (

   <section className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-lg backdrop-blur-xl">
     {/* Section Header */}
     <div className="flex items-center gap-3 border-b border-purple-100/70 px-5 py-4 sm:px-6">
       <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee5f1] text-[#5c376c]">
         {icon}
       </div>

  ```
   <h3 className="font-bold text-[#3d2748]">{title}</h3>
  ```

     </div>

  {/* Section Content */}

     <div className="p-5 sm:p-6">{children}</div>
   </section>

);
}

/**

* Patient avatar using the patient's initials.
  */
  function PatientAvatar({ name, selected = false, size = "normal" }) {
  const initials = getInitials(name);

const sizeClasses =
size === "large"
? "h-20 w-20 rounded-2xl text-2xl"
: "h-11 w-11 rounded-full text-sm";

const colorClasses = selected
? "bg-[#5c376c] text-white"
: "bg-[#eee5f1] text-[#5c376c]";

return (
<div
className={`flex shrink-0 items-center justify-center font-bold ${sizeClasses} ${colorClasses}`}
>
{initials} </div>
);
}

/* =========================================================
HELPERS
========================================================= */

/**

* Creates a short hospital patient ID.
  */
  function getPatientId(id) {
  if (!id) return "—";

return `CGH-${id.slice(0, 6).toUpperCase()}`;
}

/**

* Converts a Firebase timestamp/date into a readable date.
  */
  function formatDate(date) {
  if (!date) return "—";

try {
const parsedDate = date.toDate ? date.toDate() : new Date(date);

```
return parsedDate.toLocaleDateString("en-NG", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
```

} catch {
return "—";
}
}

/**

* Converts a Firebase timestamp/date into a readable date + time.
  */
  function formatDateTime(date) {
  if (!date) return "—";

try {
const parsedDate = date.toDate ? date.toDate() : new Date(date);

```
return parsedDate.toLocaleString("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
```

} catch {
return "—";
}
}

/**

* Gets initials from a patient's name.
  */
  function getInitials(name) {
  if (!name) return "?";

const words = name.trim().split(/\s+/);

if (words.length === 1) {
return words[0].charAt(0).toUpperCase();
}

return (
words[0].charAt(0) +
words[words.length - 1].charAt(0)
).toUpperCase();
}

/* =========================================================
RECEPTION DASHBOARD
========================================================= */

function Reception() {
/* =======================================================
STATE
======================================================= */

const [patients, setPatients] = useState([]);
const [selectedPatient, setSelectedPatient] = useState(null);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);

/* =======================================================
FIREBASE — LIVE PATIENT RECORDS
======================================================= */

useEffect(() => {
const patientsRef = collection(db, "patients");

const unsubscribe = onSnapshot(
  patientsRef,
  (snapshot) => {
    const patientList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    /* Sort newest registrations first */
    patientList.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);

      return dateB - dateA;
    });

    setPatients(patientList);

    /* Keep selected patient updated when Firebase changes */
    setSelectedPatient((currentPatient) => {
      if (!currentPatient && patientList.length > 0) {
        return patientList[0];
      }

      if (currentPatient) {
        const updatedPatient = patientList.find(
          (patient) => patient.id === currentPatient.id
        );

        return updatedPatient || patientList[0] || null;
      }

      return null;
    });

    setLoading(false);
  },
  (error) => {
    console.error("Error loading patients:", error);
    setLoading(false);
  }
);

return () => unsubscribe();

}, []);

/* =======================================================
SEARCH
======================================================= */

const filteredPatients = useMemo(() => {
const searchValue = search.toLowerCase().trim();

if (!searchValue) {
  return patients;
}

return patients.filter((patient) => {
  return (
    patient.fullName?.toLowerCase().includes(searchValue) ||
    patient.tel1?.toLowerCase().includes(searchValue) ||
    patient.tel2?.toLowerCase().includes(searchValue) ||
    patient.email?.toLowerCase().includes(searchValue) ||
    patient.gender?.toLowerCase().includes(searchValue) ||
    patient.stateOfOrigin?.toLowerCase().includes(searchValue) ||
    patient.nationality?.toLowerCase().includes(searchValue) ||
    patient.id?.toLowerCase().includes(searchValue)
  );
});

}, [patients, search]);

/* =======================================================
PAGE
======================================================= */

return (
<div
className="min-h-screen w-full bg-cover bg-center bg-fixed text-gray-800"
style={{ backgroundImage: `url(${bgImage})` }}
>
{/* ===================================================
DARK BACKGROUND OVERLAY
=================================================== */}

```
  <div className="min-h-screen w-full bg-[#24172b]/45 backdrop-blur-[2px]">

    {/* =================================================
        HEADER
    ================================================= */}

    <header className="sticky top-0 z-40 border-b border-white/15 bg-[#3d2748]/85 shadow-xl backdrop-blur-2xl">
      <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* BRAND */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <img
              src={logo}
              alt="Cedar Group Hospital"
              className="h-8 w-auto"
            />
          </div>

          <div>
            <h1 className="text-sm font-bold leading-tight text-white sm:text-lg">
              CEDAR GROUP HOSPITAL
            </h1>

            <p className="text-[10px] text-white/60 sm:text-xs">
              Reception Dashboard
            </p>
          </div>
        </div>

        {/* HEADER RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* LIVE STATUS */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>

            <span className="hidden text-xs font-medium text-white/80 sm:block">
              Live Records
            </span>
          </div>

          {/* TOTAL PATIENTS */}
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 sm:flex">
            <Users size={15} className="text-white/70" />

            <span className="text-xs text-white/80">
              {patients.length} Patients
            </span>
          </div>
        </div>
      </div>
    </header>

    {/* =================================================
        MAIN CONTENT
    ================================================= */}

    <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

      {/* =================================================
          DASHBOARD SUMMARY
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* TOTAL PATIENTS */}
        <div className="rounded-2xl border border-white/20 bg-white/15 p-5 text-white shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Total Patients
              </p>

              <p className="mt-2 text-3xl font-bold">
                {patients.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Users size={23} />
            </div>
          </div>
        </div>

        {/* SEARCH RESULTS */}
        <div className="rounded-2xl border border-white/20 bg-white/15 p-5 text-white shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Records Showing
              </p>

              <p className="mt-2 text-3xl font-bold">
                {filteredPatients.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Activity size={23} />
            </div>
          </div>
        </div>

        {/* LATEST REGISTRATION */}
        <div className="rounded-2xl border border-white/20 bg-white/15 p-5 text-white shadow-xl backdrop-blur-xl sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Latest Registration
              </p>

              <p className="mt-2 truncate text-base font-bold">
                {patients[0]?.fullName || "No registrations yet"}
              </p>

              <p className="mt-1 text-[11px] text-white/50">
                {patients[0]
                  ? formatDateTime(patients[0].createdAt)
                  : "—"}
              </p>
            </div>

            <div className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <CalendarDays size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          PATIENT WORKSPACE
      ================================================= */}

      <div className="flex min-h-[650px] flex-col overflow-hidden rounded-3xl border border-white/25 bg-white/15 shadow-2xl backdrop-blur-2xl lg:flex-row">

        {/* =================================================
            PATIENT LIST
        ================================================= */}

        <aside className="flex w-full shrink-0 flex-col bg-white/90 backdrop-blur-xl lg:w-[350px] xl:w-[390px]">

          {/* LIST HEADER */}
          <div className="border-b border-purple-100 p-5">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#3d2748]">
                  Patient Records
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Select a patient to view details
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee5f1]">
                <Users
                  size={20}
                  className="text-[#5c376c]"
                />
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, email..."
                className="w-full rounded-xl border border-gray-200 bg-[#faf9fb] py-3 pl-10 pr-10 text-sm outline-none transition focus:border-[#76517f] focus:ring-2 focus:ring-purple-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* PATIENT LIST */}
          <div className="flex-1 overflow-y-auto">

            {/* LOADING */}
            {loading && (
              <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-[#5c376c]" />

                <p className="text-sm text-gray-500">
                  Loading patient records...
                </p>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && filteredPatients.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                  <Users
                    size={25}
                    className="text-[#76517f]"
                  />
                </div>

                <p className="font-semibold text-gray-700">
                  No patients found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {search
                    ? "Try another search."
                    : "Patient records will appear here."}
                </p>
              </div>
            )}

            {/* PATIENTS */}
            {!loading &&
              filteredPatients.length > 0 &&
              filteredPatients.map((patient) => {
                const isSelected =
                  selectedPatient?.id === patient.id;

                return (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => setSelectedPatient(patient)}
                    className={`relative w-full border-b border-gray-100 px-5 py-4 text-left transition ${
                      isSelected
                        ? "bg-[#f1eaf3]"
                        : "hover:bg-[#faf8fb]"
                    }`}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#5c376c]" />
                    )}

                    <div className="flex items-center gap-3">

                      {/* AVATAR */}
                      <PatientAvatar
                        name={patient.fullName}
                        selected={isSelected}
                      />

                      {/* PATIENT INFO */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-semibold ${
                            isSelected
                              ? "text-[#5c376c]"
                              : "text-gray-800"
                          }`}
                        >
                          {patient.fullName || "Unnamed Patient"}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          {getPatientId(patient.id)}
                        </p>
                      </div>

                      {/* ARROW */}
                      <ChevronRight
                        size={17}
                        className={
                          isSelected
                            ? "text-[#5c376c]"
                            : "text-gray-300"
                        }
                      />
                    </div>
                  </button>
                );
              })}
          </div>
        </aside>

        {/* =================================================
            PATIENT DETAILS
        ================================================= */}

        <section className="min-w-0 flex-1 overflow-y-auto">

          {/* NO PATIENT SELECTED */}
          {!selectedPatient && (
            <div className="flex h-full items-center justify-center px-6">
              <div className="max-w-sm text-center">

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/20 backdrop-blur-xl">
                  <User
                    size={34}
                    className="text-white"
                  />
                </div>

                <h2 className="text-xl font-bold text-white">
                  Select a Patient
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  Choose a patient from the records list
                  to view their information.
                </p>
              </div>
            </div>
          )}

          {/* SELECTED PATIENT */}
          {selectedPatient && (
            <div className="p-4 sm:p-6 lg:p-8">

              {/* =================================================
                  PATIENT HERO
              ================================================= */}

              <div className="mb-6 rounded-3xl border border-white/15 bg-gradient-to-br from-[#5c376c]/95 to-[#76517f]/90 p-6 text-white shadow-xl backdrop-blur-xl sm:p-7">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  {/* AVATAR */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl font-bold">
                    {getInitials(selectedPatient.fullName)}
                  </div>

                  {/* PATIENT INFO */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
                      Patient Record
                    </p>

                    <h2 className="mt-1 break-words text-2xl font-bold sm:text-3xl">
                      {selectedPatient.fullName || "Unnamed Patient"}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/65">

                      <span>
                        Patient ID:{" "}
                        <strong className="text-white">
                          {getPatientId(selectedPatient.id)}
                        </strong>
                      </span>

                      <span>
                        Registered:{" "}
                        <strong className="text-white">
                          {formatDate(selectedPatient.createdAt)}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  INFORMATION SECTIONS
              ================================================= */}

              <div className="space-y-5">

                {/* PERSONAL INFORMATION */}
                <Section
                  title="Personal Information"
                  icon={<UserRound size={18} />}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <InfoItem
                      label="Full Name"
                      value={selectedPatient.fullName}
                    />

                    <InfoItem
                      label="Date of Birth"
                      value={selectedPatient.dob}
                    />

                    <InfoItem
                      label="Gender"
                      value={selectedPatient.gender}
                    />

                    <InfoItem
                      label="Marital Status"
                      value={selectedPatient.maritalStatus}
                    />
                  </div>
                </Section>

                {/* CONTACT INFORMATION */}
                <Section
                  title="Contact Information"
                  icon={<Phone size={18} />}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    <InfoItem
                      label="Primary Phone"
                      value={selectedPatient.tel1}
                    />

                    <InfoItem
                      label="Secondary Phone"
                      value={selectedPatient.tel2}
                    />

                    <InfoItem
                      label="Email"
                      value={selectedPatient.email}
                    />

                    <div className="sm:col-span-2 lg:col-span-3">
                      <InfoItem
                        label="Current Address"
                        value={selectedPatient.currentAddress}
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <InfoItem
                        label="Permanent Address"
                        value={selectedPatient.permanentAddress}
                      />
                    </div>
                  </div>
                </Section>

                {/* BACKGROUND INFORMATION */}
                <Section
                  title="Background Information"
                  icon={<BriefcaseBusiness size={18} />}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <InfoItem
                      label="Nationality"
                      value={selectedPatient.nationality}
                    />

                    <InfoItem
                      label="State of Origin"
                      value={selectedPatient.stateOfOrigin}
                    />

                    <InfoItem
                      label="Occupation"
                      value={selectedPatient.occupation}
                    />

                    <InfoItem
                      label="Religion"
                      value={selectedPatient.religion}
                    />
                  </div>
                </Section>

                {/* MEDICAL INFORMATION */}
                <Section
                  title="Medical Information"
                  icon={<HeartPulse size={18} />}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                    <InfoItem
                      label="Allergies"
                      value={
                        selectedPatient.allergies ||
                        "No allergies recorded"
                      }
                    />

                    <InfoItem
                      label="Referral Source"
                      value={selectedPatient.referral}
                    />
                  </div>
                </Section>

                {/* NEXT OF KIN */}
                <Section
                  title="Next of Kin & Emergency Contact"
                  icon={<Phone size={18} />}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    <InfoItem
                      label="Next of Kin"
                      value={selectedPatient.nextOfKin}
                    />

                    <InfoItem
                      label="Emergency Contact"
                      value={selectedPatient.emergencyName}
                    />

                    <InfoItem
                      label="Emergency Phone"
                      value={selectedPatient.emergencyPhone}
                    />

                    <div className="sm:col-span-2 lg:col-span-3">
                      <InfoItem
                        label="Emergency Address"
                        value={selectedPatient.emergencyAddress}
                      />
                    </div>
                  </div>
                </Section>

                {/* INSURANCE */}
                <Section
                  title="Insurance Information"
                  icon={<ShieldCheck size={18} />}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                    <InfoItem
                      label="Insurance Provider"
                      value={
                        selectedPatient.insuranceName ||
                        "No insurance recorded"
                      }
                    />

                    <InfoItem
                      label="Insurance ID"
                      value={selectedPatient.insuranceId}
                    />
                  </div>
                </Section>

                {/* REAL-TIME SYNC STATUS */}
                <div className="flex items-center justify-center gap-2 py-5 text-xs text-white/60">
                  <Radio
                    size={14}
                    className="text-green-400"
                  />

                  Patient records are synced in real time
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  </div>
</div>
);
}

export default Reception;
