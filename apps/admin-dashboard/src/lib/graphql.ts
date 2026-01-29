import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export class GraphQLClient {
  private apiUrl: string;

  constructor(apiUrl: string = API_URL) {
    this.apiUrl = apiUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    return await currentUser.getIdToken();
  }

  async request<T = any, V = Record<string, any>>(
    query: string,
    variables?: V
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((e) => e.message).join(", ");
      throw new Error(errorMessages);
    }

    if (!result.data) {
      throw new Error("No data returned from GraphQL query");
    }

    return result.data;
  }

  async mutation<T = any, V = Record<string, any>>(
    mutation: string,
    variables?: V
  ): Promise<T> {
    return this.request<T, V>(mutation, variables);
  }

  async query<T = any, V = Record<string, any>>(
    query: string,
    variables?: V
  ): Promise<T> {
    return this.request<T, V>(query, variables);
  }
}

// Singleton instance
export const graphqlClient = new GraphQLClient();
