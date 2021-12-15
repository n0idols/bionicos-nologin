import Layout from "../components/Layout";

export default function NotFoundPage() {
  return (
    <Layout title="Page Not Found">
      <div className="flex flex-col items-center justify-center">
        <h1>404</h1>
        <p>Sorry, that can't be found</p>
      </div>
    </Layout>
  );
}
