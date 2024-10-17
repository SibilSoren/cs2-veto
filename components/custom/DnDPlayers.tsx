"use client";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const ItemType = {
  PLAYER: "player",
};

type PlayerProps = {
  player: string;
  index: number;
};

type DropContainerProps = {
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
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

// const Player: React.FC<PlayerProps> = ({ player }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemType.PLAYER,
//     item: { player },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   return drag(
//     <div
//       style={{
//         padding: "10px",
//         margin: "5px",
//         backgroundColor: isDragging ? "#f0f0f0" : "#fff",
//         border: "1px solid #ccc",
//         borderRadius: "5px",
//         textAlign: "center",
//         cursor: "pointer",
//         opacity: isDragging ? 0.5 : 1,
//       }}
//     >
//       {player}
//     </div>
//   );
// };

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
        className="h-[60vh] overflow-y-scroll  p-4 w-60 border border-1 rounded-lg"
        id="style-1"
      >
        {players.map((player, index) => (
          <Player key={player} player={player} index={index} />
        ))}
      </div>
    </div>
  );
};
// const DropContainer: React.FC<DropContainerProps> = ({
//   players,
//   onDrop,
//   title,
// }) => {
//   const [, drop] = useDrop({
//     accept: ItemType.PLAYER,
//     drop: (item: { player: string }) => onDrop(item.player),
//   });

//   return (
//     <div className="flex flex-col">
//       <h3 className="text-lg font-semibold text-center">{title}</h3>
//       <div
//         ref={drop} // Ensure this is properly passed as a ref
//         className="h-[60vh] overflow-y-scroll  p-4 w-60 border border-1 rounded-lg"
//         id="style-1"
//       >
//         {players.map((player, index) => (
//           <Player key={player} player={player} index={index} />
//         ))}
//       </div>
//     </div>
//   );
// };

const DragDropPlayersDND = ({
  playerpool,
  setPlayerpool,
  activePlayers,
  setActivePlayers,
  setStep,
}: {
  playerpool: string[];
  setPlayerpool: React.Dispatch<React.SetStateAction<string[]>>;
  activePlayers: string[];
  setActivePlayers: React.Dispatch<React.SetStateAction<string[]>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [playerName, setPlayerName] = useState<string>("");
  const { toast } = useToast();
  const MAX_ACTIVE_PLAYERS = 10;

  // Move a player between the pools
  const movePlayer = (
    player: string,
    fromPool: string[],
    toPool: string[],
    setFromPool: React.Dispatch<React.SetStateAction<string[]>>,
    setToPool: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (toPool === activePlayers && toPool.length >= MAX_ACTIVE_PLAYERS) {
      toast({
        variant: "destructive",
        title: "Limit Reached!",
        description:
          "You cannot add more than 10 players to the Active Players.",
      });
      return;
    }

    if (!toPool.includes(player)) {
      const updatedFromPool = fromPool.filter((p) => p !== player);
      setFromPool(updatedFromPool);
      setToPool([...toPool, player]);
    }
  };

  function addPlayer() {
    if (playerName === "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Player name cannot be empty",
        description: "Geezzzzz",
      });
      return;
    }
    const exists = playerpool.filter(
      (player) => player.toLowerCase() === playerName.toLowerCase()
    );
    if (exists.length >= 1) {
      toast({
        variant: "destructive",
        title: "Player name already exists",
        description: "You mad bruh???",
      });
      return;
    } else {
      setPlayerpool([...playerpool, playerName]);
      setPlayerName("");
      toast({
        variant: "default",
        title: "Player added",
        description: "Wallaahhh",
      });
    }
  }
  return (
    <>
      <div className="flex justify-center gap-4">
        <Input
          className="w-1/6"
          value={playerName}
          placeholder="Player"
          onChange={(e) => setPlayerName(e.target.value)}
        />{" "}
        <Button onClick={addPlayer}>
          Add Player
          <Plus />
        </Button>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex justify-center my-4 gap-10">
          {/* Player Pool */}
          <DropContainer
            title="Player Pool"
            players={playerpool}
            setPlayers={setPlayerpool}
            onDrop={(player: string) =>
              movePlayer(
                player,
                activePlayers,
                playerpool,
                setActivePlayers,
                setPlayerpool
              )
            }
          />

          {/* Active Players */}
          <DropContainer
            title="Active Players"
            players={activePlayers}
            setPlayers={setActivePlayers}
            onDrop={(player: string) =>
              movePlayer(
                player,
                playerpool,
                activePlayers,
                setPlayerpool,
                setActivePlayers
              )
            }
          />
        </div>
      </DndProvider>
      <p className="text-center font-semibold">
        <span className="text-red-500">**</span>Drag and Drop player from player
        pool to active players box
      </p>
      <div className="flex justify-end">
        <Button
          disabled={activePlayers.length === 10 ? false : true}
          onClick={() => setStep(2)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default DragDropPlayersDND;
