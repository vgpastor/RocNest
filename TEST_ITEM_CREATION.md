# Item Creation Test Instructions

## Schema Fixed ✅
The database schema has been fixed:
- Removed legacy `category` column (text, NOT NULL)
- Now using `category_id` (uuid) correctly

## Test Steps
1. Navigate to: http://localhost:3002/catalogo/nuevo
2. Fill in the form:
   - **Name**: Cuerda Dinámica 60m
   - **Identifier**: CUE-001
   - **Brand**: Petzl
   - **Model**: Volta
   - **Category**: Select "Cuerdas Dinámicas"
3. Wait for metadata fields to appear
4. Fill metadata fields:
   - **Length**: 60
   - **Diameter**: 9.2
   - **Rope Type**: Select "simple"
5. Click "Guardar Material"

## Expected Result
- Form should submit successfully
- You should be redirected to `/catalogo` (which may crash - we'll fix that separately)
- Navigate to `/catalogo/test` to verify the item was created

## What to Check
- No 400 error in console
- Item "Cuerda Dinámica 60m" appears in the items list on `/catalogo/test`
- Item has correct category_id and metadata
