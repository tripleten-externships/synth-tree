# Database Integration for UI Component Customizations

## Overview

This document outlines the database integration implemented for ST-34 form components, specifically for storing admin-customized textarea dimensions and settings.

## Database Schema

### UIComponentCustomization Table

```sql
CREATE TABLE "UIComponentCustomization" (
  id           TEXT PRIMARY KEY DEFAULT uuid(),
  instanceId   TEXT UNIQUE NOT NULL,      -- Unique component identifier
  componentType TEXT NOT NULL,            -- 'textarea', 'input', 'select', etc.
  settings     JSON NOT NULL,             -- Component-specific settings
  createdBy    TEXT NOT NULL,             -- Firebase UID of admin
  createdAt    TIMESTAMP DEFAULT NOW(),
  updatedAt    TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (createdBy) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX idx_ui_customization_component_type ON "UIComponentCustomization"(componentType);
CREATE INDEX idx_ui_customization_instance_id ON "UIComponentCustomization"(instanceId);
```

## GraphQL API (Planned)

### Queries

- `getUICustomization(instanceId: String!)`: Get customization for specific component
- `listUICustomizations(componentType: String, limit: Int)`: List all customizations (admin only)

### Mutations

- `saveUICustomization(input: SaveUICustomizationInput!)`: Create/update customization (admin only)
- `deleteUICustomization(instanceId: String!)`: Remove customization (admin only)

### Types

```graphql
type UIComponentCustomization {
  id: ID!
  instanceId: String!
  componentType: String!
  settings: JSON!
  createdBy: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  creator: User!
}

input SaveUICustomizationInput {
  instanceId: String!
  componentType: String!
  settings: JSON!
}
```

## Frontend Integration

### React Hook: useUICustomization

```typescript
const {
  customization,
  isLoading,
  error,
  saveCustomization,
  deleteCustomization,
} = useUICustomization(instanceId, componentType);
```

### React Hook: useUISettings

```typescript
const {
  settings,
  hasCustomization,
  isLoading,
  saveCustomization,
  deleteCustomization,
} = useUISettings(instanceId, componentType, defaultSettings);
```

## Component Usage

### Basic EditableTextarea with Database Integration

```tsx
<EditableTextarea
  adminMode={isAdmin}
  instanceId="textarea-main-content"
  defaultWidth={400}
  defaultHeight={120}
  placeholder="Enter content..."
/>
```

### Advanced Usage with Custom Defaults

```tsx
<EditableTextarea
  adminMode={isAdmin}
  instanceId="textarea-sidebar-notes"
  defaultWidth={300}
  defaultHeight={100}
  placeholder="Quick notes..."
  className="border-dashed"
/>
```

## Data Flow

1. **Load**: Component loads with `useUISettings` hook
2. **Fetch**: Hook queries database for existing customization
3. **Apply**: Settings merged with defaults and applied to component
4. **Edit**: Admin clicks edit button, opens customization modal
5. **Save**: Modal saves changes via `saveCustomization`
6. **Persist**: Changes stored in database with unique instanceId
7. **Update**: Component re-renders with new settings

## Database Storage Format

### Settings JSON Structure

```json
{
  "width": 600,
  "height": 200,
  "minWidth": 300,
  "minHeight": 100,
  "maxWidth": 800,
  "maxHeight": 400
}
```

### Example Database Records

```sql
-- Main content textarea customization
{
  "id": "uuid-1",
  "instanceId": "textarea-main-content",
  "componentType": "textarea",
  "settings": {"width": 600, "height": 200},
  "createdBy": "firebase-admin-uid",
  "createdAt": "2025-11-16T08:21:50Z",
  "updatedAt": "2025-11-16T08:21:50Z"
}

-- Sidebar notes textarea customization
{
  "id": "uuid-2",
  "instanceId": "textarea-sidebar-notes",
  "componentType": "textarea",
  "settings": {"width": 300, "height": 150},
  "createdBy": "firebase-admin-uid",
  "createdAt": "2025-11-16T08:21:50Z",
  "updatedAt": "2025-11-16T08:21:50Z"
}
```

## Security & Authorization

- **Admin Only**: Only users with `role: ADMIN` can create/modify customizations
- **Authentication**: Firebase UID required for all customization operations
- **Validation**: Input validation on instanceId, componentType, and settings
- **Cascade Delete**: Customizations deleted when admin user is removed

## Migration Notes

### Applied Migrations

- `20251116082150_add_ui_component_customization`: Initial schema creation
- Foreign key relationship to User table established
- Unique constraint on instanceId for component isolation

### Development Setup

1. Database migration applied automatically via `pnpm prisma migrate dev`
2. Seed data available in `prisma/TEST-seed-ui-customizations.sql`
3. GraphQL schema generation pending Prisma client fix

## Current Status

### ✅ Completed

- [x] Database schema design and migration
- [x] Frontend React hooks for database integration
- [x] Updated EditableTextarea component with persistence
- [x] Modal UI updated for reset/save operations
- [x] TypeScript types and interfaces
- [x] Build verification and testing

### 🔄 In Progress

- [ ] GraphQL resolvers (pending Prisma client regeneration)
- [ ] API endpoint testing
- [ ] Authentication context integration

### 📋 TODO

- [ ] Replace localStorage mock with actual GraphQL client
- [ ] Add error handling and retry logic
- [ ] Performance optimization for bulk customizations
- [ ] Admin dashboard for managing all customizations
- [ ] Audit logging for customization changes

## Testing

### Manual Testing Steps

1. Start development servers: `pnpm dev`
2. Open Storybook: http://localhost:6006
3. Navigate to "EditableTextarea" stories
4. Enable admin mode and test customization persistence
5. Verify instanceId isolation between different textareas

### Database Testing

```sql
-- Verify schema exists
SELECT table_name FROM information_schema.tables
WHERE table_name = 'UIComponentCustomization';

-- Test data insert
INSERT INTO "UIComponentCustomization" (...) VALUES (...);

-- Verify foreign key constraints
SELECT * FROM "UIComponentCustomization" JOIN "User" ON "createdBy" = "User".id;
```
