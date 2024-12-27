"use client";
import { useState } from "react";

interface Topic {
  name: string;
  available: boolean;
}

interface Faculty {
  _id: string;
  name: string;
  topics: Topic[];
}

export default function Page() {
  const [step, setStep] = useState(1);
  const [prn, setPrn] = useState("");
  const [dob, setDob] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [firstChoice, setFirstChoice] = useState<string | null>(null);
  const [secondChoice, setSecondChoice] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false); // New state to track submission status

  const handleLogin = async () => {
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", prn, dob }),
    });

    if (response.ok) {
      const data = await response.json();
      // Check if message indicates the user has already selected topics
      if (data.message && data.message === "You have already selected your topics!") {
        alert(data.message);
      } else {
        setStep(2);
        fetchFaculties();
      }
    } else {
      alert("Login failed!");
    }
  };

  const fetchFaculties = async () => {
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getFaculties" }),
    });
    const data = await response.json();
    setFaculties(data);
  };

  const handleTopicSelection = async (
    facultyId: string,
    topicName: string,
    isFirstChoice: boolean
  ) => {
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "selectTopic", prn, facultyId, topicName, isFirstChoice }),
    });
    if (response.ok) {
      isFirstChoice ? setFirstChoice(topicName) : setSecondChoice(topicName);
    } else {
      alert("Topic selection failed!");
    }
  };

  const handleFinalSubmit = async () => {
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submitSelections", prn, firstChoice, secondChoice }),
    });
    if (response.ok) {
      setSubmitted(true); // Set submitted state to true to show "Thank You"
    } else {
      alert("Failed to submit selections!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        {submitted ? (
          <div className="text-center text-2xl font-semibold text-gray-900">
            Thank you for submitting your selections!
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-center text-gray-900">Login</h1>
                <input
                  type="text"
                  placeholder="PRN"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 text-gray-900"
                />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 text-gray-900"
                />
                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Login
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-center text-gray-900">Choose Faculty</h1>
                <div className="space-y-4">
                  {faculties.map((faculty) => (
                    <div
                      key={faculty._id}
                      onClick={() => {
                        setSelectedFaculty(faculty);
                        setTopics(faculty.topics);
                        setStep(3);
                      }}
                      className="p-3 cursor-pointer bg-gray-100 rounded-md hover:bg-indigo-50 text-gray-900"
                    >
                      {faculty.name}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-center text-gray-900">Choose Topics</h1>
                <div className="space-y-4">
                  {topics.map((topic, index) => (
                    <button
                      key={index}
                      disabled={!topic.available}
                      onClick={() =>
                        handleTopicSelection(selectedFaculty?._id || "", topic.name, !firstChoice)
                      }
                      className={`w-full py-3 text-left ${
                        topic.available
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } rounded-md`}
                    >
                      {topic.name} {topic.available ? "(Available)" : "(Taken)"}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-gray-900">First Choice: {firstChoice}</p>
                  <p className="text-gray-900">Second Choice: {secondChoice}</p>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
