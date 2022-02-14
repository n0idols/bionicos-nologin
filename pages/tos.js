import client from "@/lib/apollo-client";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
export default function Tos({ tos }) {
  return (
    <div className="prose mx-auto pt-4">
      <ReactMarkdown children={tos} />
    </div>
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
