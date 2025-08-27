import { CheckCircle } from "lucide-react";

export default function BallotCards({
  portfolio,
  handleSelect,
  handleSkip,
  prevStep,
  currentStep,
  totalSteps,
  selectedCandidate,
}) {
  const isUnopposed = portfolio.candidates.length === 1;
  const candidate = isUnopposed ? portfolio.candidates[0] : null;

  return (
    <div className="p-4 w-full max-w-2xl flex flex-col">
      {/* Header */}
      <div className="text-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">
          {portfolio.position}
        </h3>
        <p className="text-gray-600 mt-1 text-sm">
          {isUnopposed
            ? `${candidate.name} is unopposed. Do you approve?`
            : "Select your preferred candidate"}
        </p>
      </div>

      {/* Candidate List */}
      <div className="flex-1 mt-3">
        {isUnopposed ? (
          <div
            className={`relative flex flex-col items-center justify-center space-y-3 p-4 border rounded-lg transition ${
              selectedCandidate?.name === candidate.name
                ? "border-green-500 ring-2 ring-green-400 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <span className="font-medium text-gray-800 text-sm">
              {candidate.name}
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  handleSelect(portfolio, { ...candidate, decision: "YES" })
                }
                className={`px-4 py-1.5 rounded-md text-sm transition ${
                  selectedCandidate?.decision === "YES"
                    ? "bg-green-700 text-white"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                YES
              </button>
              <button
                onClick={() =>
                  handleSelect(portfolio, { ...candidate, decision: "NO" })
                }
                className={`px-4 py-1.5 rounded-md text-sm transition ${
                  selectedCandidate?.decision === "NO"
                    ? "bg-red-700 text-white"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                NO
              </button>
            </div>

            {selectedCandidate?.name === candidate.name && (
              <CheckCircle className="absolute top-2 right-2 text-green-500 w-5 h-5" />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {portfolio.candidates.map((candidate, index) => {
              const isSelected =
                selectedCandidate?.name === candidate.name &&
                !selectedCandidate?.decision;

              return (
                <div
                  key={candidate.name + index}
                  className={`relative flex flex-col items-center justify-center p-3 border rounded-lg transition ${
                    isSelected
                      ? "border-green-500 ring-2 ring-green-400 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="mt-1 font-medium text-gray-800 text-sm">
                    {candidate.name}
                  </span>

                  <button
                    onClick={() => handleSelect(portfolio, candidate)}
                    className="mt-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
                  >
                    Vote
                  </button>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold ml-28 mb-8 text-gray-200 select-none">
                      {candidate.ballot_number ?? index + 1}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle className="absolute top-2 right-2 text-green-500 w-5 h-5" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-3">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center px-4 py-1.5 rounded-md text-sm transition-colors ${
            currentStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={() => handleSkip(portfolio)}
          className="flex items-center px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Skip →
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center items-center pt-2">
        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Step <span className="text-blue-600">{currentStep + 1}</span> of{" "}
          <span className="text-gray-700">{totalSteps}</span>
        </div>
      </div>
    </div>
  );
}
