"use client";
import { useParams } from "next/navigation";

export default function Form() {
  // Retrieve id
  const { id } = useParams();

  return (
    <div>
      <p>Url param id: {id}</p>
    </div>
  );
}
