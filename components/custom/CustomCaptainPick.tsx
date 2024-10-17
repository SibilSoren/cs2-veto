import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "./ComboBox";
type Combo = {
  label: string;
  value: string;
};
export function CustomCaptainPick({
  activePlayers,
  setCaptains,
  captains,
  setRemainingPlayers,
}: {
  activePlayers: string[];
  setCaptains: React.Dispatch<React.SetStateAction<string[]>>;
  captains: string[];
  setRemainingPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const generateLabelValue = (): Combo[] => {
    const result: Combo[] = [];
    for (const player of activePlayers) {
      result.push({ label: player, value: player });
    }
    return result;
  };

  const handleCombo1 = (value: string) => {
    const arr = [...captains];
    if (arr.length > 1) {
      arr.shift();
      arr.unshift(value);
    } else {
      arr.unshift(value);
    }

    console.log(arr);
    setCaptains(arr);
  };
  const handleCombo2 = (value: string) => {
    const arr = [...captains];
    if (arr.length === 2) {
      arr.pop();
      arr.push(value);
    } else {
      arr.push(value);
    }
    console.log(arr);
    setCaptains(arr);
  };

  const setRemaining = () => {
    const remainingPlayer = activePlayers.filter(
      (player) => !captains.includes(player)
    );
    setRemainingPlayers(remainingPlayer);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Custom Pick</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Custom Captain Pick</AlertDialogTitle>
          <AlertDialogDescription>
            Click on create veto room to start the Map Veto
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-between">
          <Combobox
            placeholder="Select Captain 1"
            players={generateLabelValue()}
            handleChange={handleCombo1}
          />
          <Combobox
            placeholder="Select Captain 2"
            players={generateLabelValue()}
            handleChange={handleCombo2}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <Button onClick={() => console.log("Yolo")}>Confirm</Button> */}
          <AlertDialogAction onClick={setRemaining}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
