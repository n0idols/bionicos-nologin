import Section from "@/components/Section";
import { NextSeo } from "next-seo";

export default function NotFoundPage() {
  return (
    <>
      <NextSeo title="Page Not Found" description="That page was not found" />
      <Section>
        <div className="prose mx-auto flex flex-col items-center">
          <h1>404</h1>
          <p>Sorry, that cannot be found</p>
        </div>
      </Section>
    </>
  );
}
