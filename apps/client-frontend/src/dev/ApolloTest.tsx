import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

// simple public graphql query, all other queries are currently gated by authentication
// allows verification that configuration is correct, env var reachable & req work w/o logged in user
const PING = gql`
    query Ping {
        __typename
    }
`;

export function ApolloTest() {
    // execute test query on mount
    const { data, error } = useQuery(PING);

    useEffect(() => {
        if (error) console.log("Apollo error:", error?.message);

        if (data) {
            console.log("Apollo response:", JSON.stringify(data, null, 2));
        }
    }, [error, data]);

    return null;
}