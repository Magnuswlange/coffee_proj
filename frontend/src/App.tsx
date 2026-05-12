import { Coffee } from "lucide-react";
import Card from "./components/Card";
import CardContainer from "./components/CardContainer";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { motion } from "motion/react";
import OpenRouterAgent from "./components/OpenRouterAgent";
import Hero from "./layout/Hero";
import heroImg from "./assets/beans.jpg";
import Caroussel from "./components/Caroussel";
import Badge from "./components/Badge";
import { links } from "./data/navLinks";
import { socials } from "./data/socials";
import { sendOrder } from "./services/orders";
import { drinkTypes } from "./data/drinkTypes";

const agentName: string = "Frank";

export default function App() {
  return (
    <>
      <Navbar
        logo={
          <a href="#hero">
            <motion.div whileHover={{ scale: 1.15, opacity: 0.7 }}>
              <Coffee size={24} className="invert" />
            </motion.div>
          </a>
        }
        links={links}
      />
      <main>
        <Hero id="hero" imgSrc={heroImg}>
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
        </Hero>

        {/* Carousel */}
        <Caroussel className="mb-2">
          {drinkTypes.map((coffee) => (
            <span key={coffee.id}>{coffee.title},</span>
          ))}
        </Caroussel>

        {/* Drink cards */}
        <CardContainer>
          {drinkTypes.map((coffee) => (
            <div key={coffee.id} className="relative w-full">
              {coffee.popular && <Badge>Popular</Badge>}
              <Card
                title={coffee.title}
                summary={coffee.desc}
                onClick={() => sendOrder(coffee)}
                expandable={true}
              >
                <ul className="list-disc list-inside">
                  <li>{coffee.isHot ? "Hot" : "Iced"}</li>
                  <li>{coffee.volumeMl}mL</li>
                </ul>
              </Card>
            </div>
          ))}
        </CardContainer>

        {/* LLM bot: coffee recommendations */}
        <OpenRouterAgent />
      </main>

      <Footer socials={socials} />
    </>
  );
}
