// CaptainSelection.tsx
"use client";
import React from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CustomCaptainPick } from "./CustomCaptainPick";

type CaptainSelectionProps = {
  activePlayers: string[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
  captains: string[];
  setCaptains: React.Dispatch<React.SetStateAction<string[]>>;
  setRemainingPlayers: React.Dispatch<React.SetStateAction<string[]>>;
};

const CaptainSelection: React.FC<CaptainSelectionProps> = ({
  activePlayers,
  setStep,
  captains,
  setCaptains,
  setRemainingPlayers,
}) => {
  const { toast } = useToast();

  const selectCaptains = () => {
    if (activePlayers.length < 2) {
      toast({
        variant: "destructive",
        title: "Not Enough Players",
        description: "You need at least 2 active players to select captains.",
      });
      return;
    }

    // Shuffle the array and pick the first two players
    const shuffledPlayers = [...activePlayers].sort(() => 0.5 - Math.random());
    const selectedCaptains = shuffledPlayers.slice(0, 2);
    const remainingPlayer = activePlayers.filter(
      (player) => !selectedCaptains.includes(player)
    );
    console.log(remainingPlayer);
    setCaptains(selectedCaptains);
    setRemainingPlayers(remainingPlayer);
  };

  return (
    <div>
      <div className="flex flex-col items-center my-4 w-full">
        <div className="flex items-center gap-3">
          <CustomCaptainPick
            activePlayers={activePlayers}
            setCaptains={setCaptains}
            captains={captains}
            setRemainingPlayers={setRemainingPlayers}
          />
          <Button onClick={selectCaptains}>Select Random Captains</Button>
          <ReloadIcon onClick={selectCaptains} className="cursor-pointer" />
        </div>

        {captains.length > 0 && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">Selected Captains:</h3>
            <div className="flex justify-center gap-5 py-4 text-2xl font-bold">
              <p className="text-orange-600">{captains[0]}</p>
              <p className="font-extrabold">VS</p>
              <p className="text-orange-600">{captains[1]}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-10">
        <Button variant={"outline"} onClick={() => setStep(1)}>
          Back
        </Button>
        <Button
          disabled={captains.length > 0 ? false : true}
          onClick={() => setStep(3)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CaptainSelection;
