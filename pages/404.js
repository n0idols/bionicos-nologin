import Layout from "@/components/Layout";
import Section from "@/components/Section";

export default function NotFoundPage() {
  return (
    <Layout title="Page Not Found">
      <Section>
        <div className="prose mx-auto flex flex-col items-center">
          <h1>404</h1>
          <p>Sorry, that cannot be found</p>
        </div>
      </Section>
    </Layout>
  );
}
