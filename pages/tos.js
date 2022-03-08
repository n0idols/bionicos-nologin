import client from "@/lib/apollo-client";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
import PleaseSignIn from "../components/PleaseSignIn";
export default function Tos({ tos }) {
  return (
    <PleaseSignIn>
      <div className="prose mx-auto pt-4">
        <article>
          <ReactMarkdown>{tos}</ReactMarkdown>
        </article>
      </div>
    </PleaseSignIn>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        termsOfService {
          content
        }
      }
    `,
  });

  return {
    props: {
      tos: data.termsOfService.content,
    },
  };
}
