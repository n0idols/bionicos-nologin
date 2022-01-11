import { ApolloClient, InMemoryCache } from "@apollo/client";
import { API_URL } from "@/config/index";

const client = new ApolloClient({
  uri: API_URL,
  // uri: "https://bionicos.herokuapp.com/graphql",
  cache: new InMemoryCache(),
});

export default client;
