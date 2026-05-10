import { createApolloClient } from "@synth-tree/config/apollo";

import { auth } from "./firebase";

export const apolloClient = createApolloClient({ auth });
