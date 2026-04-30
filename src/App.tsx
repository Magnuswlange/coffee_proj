import { Coffee } from "lucide-react";
import Card from "./components/Card";
import CardContainer from "./components/CardContainer";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { motion } from "motion/react";
import type { SocialMedia } from "./layout/Footer";
import githubImg from "./assets/github.png";
import OpenRouterAgent from "./components/OpenRouterAgent";
import { openrouter } from "./agentConfig";
import Hero from "./layout/Hero";
import heroImg from "./assets/beans2.jpg";
import { ntfyUuid } from "./config";

const sendOrder = async (order: Drink) => {
  const res = await fetch(`https://ntfy.sh/${ntfyUuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Title: "Coffee Order",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error("Failed to send order");
};

type CupSize = "small" | "medium" | "large";

type Drink = {
  id: number;
  title: string;
  desc: string;
  volumeMl: number;
  cupSize: CupSize;
  isHot: boolean;
  sweetness: 1 | 2 | 3 | 4 | 5;
  intensity: 1 | 2 | 3 | 4 | 5;
  popular: boolean;
};

const socials: SocialMedia[] = [
  {
    name: "Github",
    link: "https://github.com",
    icon: (
      <motion.div
        whileHover={{ scale: 1.15, opacity: 70 }}
        className="h-12 w-12"
      >
        <img
          src={githubImg}
          alt="Github"
          className="max-h-full w-auto object-contain invert"
        />
      </motion.div>
    ),
  },
];

export default function App() {
  return (
    <div>
      <Navbar
        logo={
          <motion.a href="#hero">
            <motion.div whileHover={{ scale: 1.15, opacity: 0.7 }}>
              <Coffee size={24} className="invert" />
            </motion.div>
          </motion.a>
        }
        links={[]}
      />
      <main>
        <Hero id="hero" imgSrc={heroImg} />
        <CardContainer className="pt-24">
          {coffeeTypes.map((coffee) => (
            <Card
              key={coffee.id}
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
          ))}
        </CardContainer>

        {/* LLM bot: coffee recommendations */}
        <motion.div className="bg-surface">
          <OpenRouterAgent openRouter={openrouter} />
        </motion.div>
      </main>
      <Footer socials={socials} />
    </div>
  );
}

const coffeeTypes: Drink[] = [
  {
    id: 1,
    title: "Oat Dream",
    desc: "Potent espresso paired with sweet oat milk.",
    volumeMl: 300,
    cupSize: "medium",
    isHot: true,
    sweetness: 3,
    intensity: 4,
    popular: true,
  },
  {
    id: 2,
    title: "Iced Oat Breeze",
    desc: "Bold espresso drowned in creamy oat milk and homemade, all-natural vanilla syrup.",
    volumeMl: 300,
    cupSize: "medium",
    isHot: false,
    sweetness: 4,
    intensity: 3,
    popular: true,
  },
  {
    id: 3,
    title: "Flat White",
    desc: "Velvety milk with a strong espresso backbone and smooth finish.",
    volumeMl: 240,
    cupSize: "small",
    isHot: true,
    sweetness: 2,
    intensity: 4,
    popular: false,
  },
  {
    id: 4,
    title: "Cappuccino",
    desc: "Balanced espresso, steamed milk, and airy foam with a bold taste.",
    volumeMl: 250,
    cupSize: "small",
    isHot: true,
    sweetness: 2,
    intensity: 4,
    popular: true,
  },
  {
    id: 5,
    title: "Caffè Latte",
    desc: "A creamy, mellow espresso drink with plenty of steamed milk.",
    volumeMl: 350,
    cupSize: "large",
    isHot: true,
    sweetness: 3,
    intensity: 2,
    popular: true,
  },
  {
    id: 6,
    title: "Iced Latte",
    desc: "Chilled espresso and milk over ice for a smooth, refreshing sip.",
    volumeMl: 350,
    cupSize: "large",
    isHot: false,
    sweetness: 2,
    intensity: 2,
    popular: true,
  },
  {
    id: 7,
    title: "Americano",
    desc: "Espresso diluted with hot water for a clean, bold black coffee.",
    volumeMl: 300,
    cupSize: "medium",
    isHot: true,
    sweetness: 1,
    intensity: 5,
    popular: true,
  },
  {
    id: 8,
    title: "Iced Americano",
    desc: "A crisp, chilled espresso drink with a strong, clean finish.",
    volumeMl: 300,
    cupSize: "medium",
    isHot: false,
    sweetness: 1,
    intensity: 5,
    popular: true,
  },
  {
    id: 9,
    title: "Mocha",
    desc: "Espresso blended with chocolate and milk for a rich, dessert-like cup.",
    volumeMl: 350,
    cupSize: "large",
    isHot: true,
    sweetness: 5,
    intensity: 2,
    popular: false,
  },
  {
    id: 10,
    title: "Iced Mocha",
    desc: "Chocolatey iced espresso drink with a cool, creamy body.",
    volumeMl: 350,
    cupSize: "large",
    isHot: false,
    sweetness: 5,
    intensity: 2,
    popular: false,
  },
  {
    id: 11,
    title: "Espresso Shot",
    desc: "A short, concentrated coffee with deep aroma and powerful intensity.",
    volumeMl: 60,
    cupSize: "small",
    isHot: true,
    sweetness: 1,
    intensity: 5,
    popular: false,
  },
  {
    id: 12,
    title: "Caramel Oat Latte",
    desc: "Espresso with oat milk and caramel sweetness for a cozy café treat.",
    volumeMl: 350,
    cupSize: "large",
    isHot: true,
    sweetness: 4,
    intensity: 2,
    popular: true,
  },
  {
    id: 13,
    title: "Iced Vanilla Oat Latte",
    desc: "A cool oat latte with vanilla notes and a smooth espresso finish.",
    volumeMl: 350,
    cupSize: "large",
    isHot: false,
    sweetness: 4,
    intensity: 2,
    popular: true,
  },
  {
    id: 14,
    title: "Macchiato",
    desc: "Espresso marked with a touch of milk foam for a sharp, intense drink.",
    volumeMl: 90,
    cupSize: "small",
    isHot: true,
    sweetness: 1,
    intensity: 5,
    popular: false,
  },
  {
    id: 15,
    title: "Frappe Sugar Rush",
    desc: "A frosty blended coffee drink with milk, ice, and extra sweetness.",
    volumeMl: 400,
    cupSize: "large",
    isHot: false,
    sweetness: 5,
    intensity: 2,
    popular: false,
  },
  {
    id: 16,
    title: "Iced Flat White",
    desc: "A chilled espresso drink with silky milk and a stronger coffee kick.",
    volumeMl: 300,
    cupSize: "medium",
    isHot: false,
    sweetness: 2,
    intensity: 4,
    popular: true,
  },
  {
    id: 17,
    title: "Iced Cappuccino",
    desc: "A cold cappuccino with a stronger coffee taste and light frothy texture.",
    volumeMl: 300,
    cupSize: "medium",
    isHot: false,
    sweetness: 2,
    intensity: 4,
    popular: false,
  },
];

// syrups: caramel, vanilla,

export const getDrinks = (): Drink[] => coffeeTypes;
