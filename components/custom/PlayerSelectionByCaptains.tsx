"use client";
import React, { useRef, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ConfirmTeamAlert } from "./ConfirmTeamAlert";

const ItemType = {
  PLAYER: "player",
};

type PlayerProps = {
  player: string;
};

type DropContainerProps = {
  players: string[];
  onDrop: (player: string) => void;
  title: string;
};

// Draggable player component
const Player: React.FC<PlayerProps> = ({ player }) => {
  const [, drag] = useDrag({
    type: ItemType.PLAYER,
    item: { player },
  });
  const ref = useRef<HTMLDivElement>(null);
  drag(ref);
  return (
    <div
      ref={ref}
      style={{
        padding: "10px",
        margin: "5px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "5px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      {player}
    </div>
  );
};

// Droppable container component
const DropContainer: React.FC<DropContainerProps> = ({
  players,
  onDrop,
  title,
}) => {
  const [, drop] = useDrop({
    accept: ItemType.PLAYER,
    drop: (item: { player: string }) => onDrop(item.player),
  });

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <div
        ref={ref}
        className="h-[40vh] overflow-y-scroll p-4 w-60 border border-1 rounded-lg"
      >
        {players.map((player) => (
          <Player key={player} player={player} />
        ))}
      </div>
    </div>
  );
};

type CaptainPlayerSelectionProps = {
  selectedCaptains: string[]; // Captains chosen from the previous step
  remainingPlayers: string[];
  setRemainingPlayers: React.Dispatch<React.SetStateAction<string[]>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const CaptainPlayerSelection: React.FC<CaptainPlayerSelectionProps> = ({
  selectedCaptains,
  remainingPlayers,
  setRemainingPlayers,
}) => {
  const [captain1Players, setCaptain1Players] = useState<string[]>([]);
  const [captain2Players, setCaptain2Players] = useState<string[]>([]);

  // Handle drop into Captain 1's pool
  const handleDropToCaptain1 = (player: string) => {
    // Ensure the player is not already in Captain 1's or Captain 2's pool
    if (
      !captain1Players.includes(player) &&
      !captain2Players.includes(player)
    ) {
      setCaptain1Players((prev) => [...prev, player]);
      setRemainingPlayers((prev) => prev.filter((p) => p !== player)); // Remove from remaining players
    }
  };

  // Handle drop into Captain 2's pool
  const handleDropToCaptain2 = (player: string) => {
    // Ensure the player is not already in Captain 2's or Captain 1's pool
    if (
      !captain2Players.includes(player) &&
      !captain1Players.includes(player)
    ) {
      setCaptain2Players((prev) => [...prev, player]);
      setRemainingPlayers((prev) => prev.filter((p) => p !== player)); // Remove from remaining players
    }
  };

  // Handle drop back into the Available Players pool
  const handleDropToAvailablePlayers = (player: string) => {
    // Remove from captain's pool and return to available players pool
    if (!remainingPlayers.includes(player)) {
      setRemainingPlayers((prev) => [...prev, player]);

      // Remove from captain 1's pool if exists
      setCaptain1Players((prev) => prev.filter((p) => p !== player));

      // Remove from captain 2's pool if exists
      setCaptain2Players((prev) => prev.filter((p) => p !== player));
    }
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex justify-center my-4 gap-10">
          {/* Container for Remaining Players */}
          <DropContainer
            title="Players Pool"
            players={remainingPlayers}
            onDrop={handleDropToAvailablePlayers} // Allow drag-back to available players
          />

          {/* Captain 1's Container */}
          <DropContainer
            title={`Team: ${selectedCaptains[0]}`}
            players={captain1Players}
            onDrop={handleDropToCaptain1}
          />

          {/* Captain 2's Container */}
          <DropContainer
            title={`Team: ${selectedCaptains[1]}`}
            players={captain2Players}
            onDrop={handleDropToCaptain2}
          />
        </div>
      </DndProvider>
      <div className="flex justify-center mt-10 gap-10">
        {/* <Button variant={"outline"} onClick={() => setStep(2)}>
          Back
        </Button>
        <Button
          // disabled={captains.length > 0 ? false : true}
          onClick={() => setStep(3)}
        >
          Confirm
        </Button> */}
        <ConfirmTeamAlert
          disabled={
            captain1Players.length === 4 && captain2Players.length === 4
          }
        />
      </div>
    </>
  );
};

export default CaptainPlayerSelection;
