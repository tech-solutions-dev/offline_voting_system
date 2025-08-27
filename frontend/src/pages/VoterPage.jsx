import React, { useState } from "react";
import { toast } from "react-toastify";
import BallotCards from "../components/BallotCards";
import ReviewSelections from "../components/ReviewSelections";
import SidebarSteps from "../components/SidebarSteps";

export default function VoterPage() {
  const ballotPortfolios = [
    {
      id: 1,
      position: "President",
      candidates: [
        {
          name: "Alice Johnson",
          image: "/uploads/kofi.webp",
          ballot_number: 1,
        },
        { name: "Bob Smith", image: "/uploads/abena.avif", ballot_number: 2 },
        { name: "Charles Doe", image: "/uploads/kwaku.avif", ballot_number: 3 },
        { name: "Charles Doe", image: "/uploads/kwaku.avif", ballot_number: 3 },
        { name: "Charles Doe", image: "/uploads/kwaku.avif", ballot_number: 3 },
      ],
    },
    {
      id: 2,
      position: "Vice President",
      candidates: [
        {
          name: "Emily Davis",
          image: "/uploads/mensah.avif",
          ballot_number: 1,
        },
        { name: "Frank White", image: "/uploads/kofi.webp", ballot_number: 2 },
      ],
    },
    {
      id: 3,
      position: "Secretary General",
      candidates: [
        {
          name: "Grace Lee",
          image: "/uploads/secretary.avif",
          ballot_number: 1,
        },
        {
          name: "Henry Brown",
          image: "/uploads/mensah.avif",
          ballot_number: 2,
        },
      ],
    },
    {
      id: 4,
      position: "Treasurer",
      candidates: [
        { name: "Isaac Newton", image: "/uploads/vice.avif", ballot_number: 1 },
      ],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [reviewMode, setReviewMode] = useState(false);

  const handleSelect = (portfolio, candidate) => {
    setSelections({
      ...selections,
      [portfolio.id]: candidate,
    });
    nextStep();
  };

  const handleSkip = (portfolio) => {
    setSelections({
      ...selections,
      [portfolio.id]: { name: "Skipped" },
    });
    nextStep();
  };

  const nextStep = () => {
    if (currentStep < ballotPortfolios.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setReviewMode(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCastVote = () => {
    console.log("Final Votes:", selections);
    toast.success("✅ Your vote has been cast!");
    setReviewMode(false);
    setSelections({});
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarSteps
        portfolios={ballotPortfolios}
        currentStep={currentStep}
        reviewMode={reviewMode}
        selections={selections}
        setCurrentStep={setCurrentStep}
        setReviewMode={setReviewMode}
      />

      <div className="flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          {!reviewMode ? (
            <BallotCards
              portfolio={ballotPortfolios[currentStep]}
              handleSelect={handleSelect}
              handleSkip={handleSkip}
              prevStep={prevStep}
              currentStep={currentStep}
              totalSteps={ballotPortfolios.length}
              selectedCandidate={selections[ballotPortfolios[currentStep].id]}
            />
          ) : (
            <ReviewSelections
              portfolios={ballotPortfolios}
              selections={selections}
              onBack={() => setReviewMode(false)}
              onConfirm={handleCastVote}
            />
          )}
        </div>
      </div>
    </div>
  );
}
