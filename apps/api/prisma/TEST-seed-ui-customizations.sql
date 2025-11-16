-- Test data for UI Component Customization
-- Insert sample data to verify the database schema works correctly

-- Note: Replace 'test-admin-user-id' with actual Firebase UID in production

INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt") 
VALUES ('test-admin-user-id', 'admin@test.com', 'Test Admin', 'ADMIN', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "UIComponentCustomization" (id, "instanceId", "componentType", settings, "createdBy", "createdAt", "updatedAt")
VALUES 
  (
    'test-customization-1',
    'textarea-main-content', 
    'textarea',
    '{"width": 600, "height": 200}',
    'test-admin-user-id',
    NOW(),
    NOW()
  ),
  (
    'test-customization-2',
    'textarea-sidebar-notes',
    'textarea', 
    '{"width": 300, "height": 150}',
    'test-admin-user-id',
    NOW(),
    NOW()
  )
ON CONFLICT ("instanceId") DO UPDATE SET
  settings = EXCLUDED.settings,
  "updatedAt" = NOW();