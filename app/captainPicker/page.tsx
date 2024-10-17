"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import DragDropPlayersDND from "@/components/custom/DnDPlayers";
import CaptainSelection from "@/components/custom/CaptainSelection";
import CaptainPlayerSelection from "@/components/custom/PlayerSelectionByCaptains";

// Sample player data
const initialPlayers: string[] = [
  "Starku",
  "Marky",
  "Shona",
  "Dante",
  "Tanzee",
  "Nero",
  "Ryder",
  "Pain",
  "LPH",
  "Blackburn",
  "Harty",
  "Virus",
  "Vandron",
];

const CaptainPicker = () => {
  const [playerpool, setPlayerpool] = useState<string[]>(initialPlayers);
  const [activePlayers, setActivePlayers] = useState<string[]>([]);
  const [progress, setProgress] = useState(Math.floor(100 / 3));
  const [captains, setCaptains] = useState<string[]>([]);
  const [remainingPlayers, setRemainingPlayers] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  // const MAX_PLAYERS = 8;

  useEffect(() => {
    if (step === 2) {
      setProgress(Math.floor(100 / 2));
    }
    if (step === 1) {
      setProgress(Math.floor(100 / 3));
    }
    if (step === 3) {
      setProgress(100);
    }
  }, [step]);
  return (
    <div className="m-10">
      <div>
        <Progress value={progress} />
      </div>
      {step === 1 && (
        <div id="step1" className="mt-3">
          <h2 className="font-bold">
            Step:1 <span className="font-normal">Select Active players</span>
          </h2>
          <DragDropPlayersDND
            playerpool={playerpool}
            setPlayerpool={setPlayerpool}
            activePlayers={activePlayers}
            setActivePlayers={setActivePlayers}
            setStep={setStep}
          />
        </div>
      )}
      {step === 2 && (
        <div id="step2" className="mt-3">
          <h2 className="font-bold">
            Step: 2 <span className="font-normal">Pick Captain</span>
          </h2>
          <CaptainSelection
            activePlayers={activePlayers}
            setStep={setStep}
            captains={captains}
            setCaptains={setCaptains}
            setRemainingPlayers={setRemainingPlayers}
          />
        </div>
      )}
      {step === 3 && (
        <div id="step3" className="mt-3">
          <h2 className="font-bold">
            Step: 3 <span className="font-normal">Select players</span>
          </h2>
          <CaptainPlayerSelection
            selectedCaptains={captains}
            remainingPlayers={remainingPlayers}
            setRemainingPlayers={setRemainingPlayers}
            setStep={setStep}
          />
        </div>
      )}
    </div>
  );
};

export default CaptainPicker;
