import Particles from "../components/Particles";
import Background from "../components/Background";
import type { ReactNode } from "react";

type Props = {
  imgSrc: string;
  id: string;
  children?: ReactNode;
};

export default function Hero({ imgSrc, id, children }: Props) {
  return (
    <section
      className="relative min-h-dvh flex items-center justify-center"
      id={id}
    >
      <Background imgSrc={imgSrc} />
      <Particles />
      {children}
    </section>
  );
}
