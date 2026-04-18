import { ApolloServerPlugin } from '@apollo/server';
import { GraphQLContext } from '@graphql/context';
import logger from './logger';

// Apollo Server plugin that adds structured logging for every GraphQL request.
// Creates a per-request child logger with user + operation context,
// logs request lifecycle events, and captures all GraphQL errors.
export const apolloLoggingPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart({ request, contextValue }) { 
    // Extract contextual metadata for this request
    const operationName = request.operationName ?? 'unknown';
    const variables = request.variables ?? {};
    const userId = contextValue?.user?.uid ?? 'anonymous';

     // Child logger ensures all logs for this request share the same context
    const reqLogger = logger.child({ userId, operationName, variables });
    
    // Marks the beginning of the GraphQL request lifecycle
    reqLogger.debug('GraphQL request started');

    return {
      async didEncounterErrors({ errors }) {
         // Log each GraphQL error with structured metadata for debugging + monitoring
        for (const err of errors) {
          reqLogger.error({
            message: err.message,
            path: err.path,
            code: err.extensions?.code,
            // Only include stack traces in development to avoid leaking internals
            ...(process.env.NODE_ENV !== 'production' && {
              stack: err.extensions?.stacktrace,
            }),
          }, 'GraphQL error');
        }
      },

      async willSendResponse() {
        // Marks the end of the request lifecycle
        reqLogger.debug('GraphQL request completed');
      },
    };
  },
};