"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CS2 from "../assets/cs2.webp";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center h-screen justify-start gap-5">
      <Image src={CS2} alt="CS2" />
      CS2 Matchmaking
      <div>
        <Button onClick={() => router.push("/captainPicker")}>
          Start Picking Captain
        </Button>
      </div>
    </div>
  );
}
