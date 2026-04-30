import Particles from "../components/Particles";
import Background from "../components/Background";
import { agentName } from "../agentConfig";
import { motion } from "motion/react";

type Props = {
  imgSrc: string;
  id: string;
};

export default function Hero({ imgSrc, id }: Props) {
  return (
    <section
      className="relative min-h-dvh flex items-center justify-center"
      id={id}
    >
      <Background imgSrc={imgSrc} />
      <Particles />
      <motion.h1
        className="font-semibold text-6xl text-center text-primary-foreground z-50"
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 2,
          ease: "easeOut",
        }}
      >
        Welcome, <br />
        say hi to <br />
        <span className="text-highlight">{agentName}</span>
      </motion.h1>
    </section>
  );
}
