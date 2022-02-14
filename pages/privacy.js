import client from "@/lib/apollo-client";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
export default function Privacy({ policy }) {
  return (
    <div className="prose mx-auto pt-4">
      <article>
        <ReactMarkdown>{policy}</ReactMarkdown>
      </article>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        privacyPolicy {
          content
        }
      }
    `,
  });

  return {
    props: {
      policy: data.privacyPolicy.content,
    },
  };
}
