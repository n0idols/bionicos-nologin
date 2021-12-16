import Section from "@/components/Section";
import { useAuth } from "@/lib/authState";

export default function SpecialsMenu() {
  const { authenticatedState } = useAuth();
  const SpecialMenu = () => {
    return (
      <>
        <div>
          <h1>Monday{"'"}s special</h1>
          <p>$5 off any meal</p>
        </div>
      </>
    );
  };

  const RegularSpecials = () => {
    return (
      <div>
        <h1>Monday{"'"}s Special</h1>
        <p>$3 off any meal</p>
      </div>
    );
  };
  return (
    <Section>
      <h1 className="text-center">Weekly Specials</h1>
      {authenticatedState === "authenticated" ? (
        <SpecialMenu />
      ) : (
        <RegularSpecials />
      )}
    </Section>
  );
}
