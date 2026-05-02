import { useState, useEffect, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Link } from "../types/link";

type Props = {
  logo: ReactNode;
  links: Link[];
};

export default function Navbar({ logo, links }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed inset-x-0 h-20 top-0 py-5 z-100 transition-[background-color,backdrop-filter,box-shadow] duration-1000 ease-out ${isScrolled || isOpen ? "glass-strong" : "transparent"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-6 h-full flex items-center justify-between">
        {logo}

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <ul className="glass rounded-full px-2 py-1 flex items-center gap-4">
            {links.map(({ label, href }, index) => (
              <li key={index}>
                <motion.a
                  whileHover={{
                    color: "var(--color-primary-foreground)",
                    translateX: 2,
                    backgroundColor: "var(--color-primary)",
                  }}
                  href={href}
                  className="text-md text-muted-foreground
                  font-semibold px-4 py-2 block rounded-full"
                >
                  {label}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile hamburger button */}
        <motion.button
          className="md:hidden p-2 text-foreground"
          whileHover={{ cursor: "pointer", scale: 1.15, opacity: 0.5 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile hamburger menu"
        >
          {isOpen ? (
            <X size={24} className="invert" />
          ) : (
            <Menu size={24} className="invert" />
          )}
        </motion.button>
      </nav>

      {/* Mobile  */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden glass-strong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            exit={{ opacity: 0 }}
          >
            <ul className="container mx-auto mt-4 px-6 py-6 flex flex-col gap-4">
              {links.map(({ label, href }, index) => (
                <li key={index}>
                  <motion.a
                    whileHover={{
                      color: "var(--color-primary-foreground)",
                      translateX: 2,
                      backgroundColor: "var(--color-primary)",
                    }}
                    href={href}
                    className="text-lg text-muted-foreground
                  font-semibold px-4 py-2 block rounded-full"
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
