import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BallotCards from "../../components/voters/BallotCards";
import ReviewSelections from "../../components/voters/ReviewSelections";
import SidebarSteps from "../../components/voters/SidebarSteps";
import api from "../../utils/api";
import { getUser } from "../../utils/auth";

export default function VoterPage() {
  const [ballotPortfolios, setBallotPortfolios] = useState([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

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
    // Build payload according to FINAL_API.json for /api/voting/voting/cast_vote/
    const user = getUser();
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    const votes = Object.keys(selections).map((portfolioId) => {
      const sel = selections[portfolioId];
      // if selection indicates skipped
      if (!sel || sel?.name === "Skipped" || sel?.skip_vote) {
        return {
          voter_id: user.voter_id || user.user_id || user.id,
          portfolio: Number(portfolioId),
          candidate: null,
          skip_vote: true,
        };
      }

      return {
        voter_id: user.voter_id || user.user_id || user.id,
        portfolio: Number(portfolioId),
        candidate: sel.id || sel.cand_id || sel.ballot_number || null,
        skip_vote: false,
      };
    });

    api
      .post(`/api/voting/voting/cast_vote/`, votes)
      .then(() => {
        toast.success("✅ Your vote has been cast!");
        setReviewMode(false);
        setSelections({});
        setCurrentStep(0);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to cast vote");
      });
  };

  useEffect(() => {
    // fetch portfolios for logged in voter
    const user = getUser();
    if (!user) return;
    const voter_id = user.voter_id || user.email || user.id;
    api
      .get(`/api/voting/portfolios/`, { params: { voter_id } })
      .then((response) => {
        const data = response.data || [];
        // convert API shape to what components expect
        const mapped = data.map((p) => ({
          id: p.port_id || p.id,
          position: p.port_name || p.port_name,
          candidates: (p.candidates || []).map((c) => ({
            id: c.cand_id || c.id,
            name: c.cand_fname || c.name || c.cand_name,
            image: c.profile_picture || c.image || null,
            ballot_number: c.ballot_num || c.ballot_number,
          })),
        }));
        setBallotPortfolios(mapped);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to load ballot portfolios");
      })
      .finally(() => setLoadingPortfolios(false));
  }, []);


  if (loadingPortfolios) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Loading ballot portfolios...</div>
      </div>
    );
  }

  if (!ballotPortfolios || ballotPortfolios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">No ballot portfolios available.</div>
      </div>
    );
  }

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
