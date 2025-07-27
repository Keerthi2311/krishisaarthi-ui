# API Integration Documentation

This document outlines the integration between the Krishisaarthi UI application and the Agents API backend.

## API Integration Overview

The application has been successfully integrated with the Krishisaarthi Agents API hosted at:
`https://us-central1-krishisaarathi.cloudfunctions.net/api`

## Implemented Features

### 1. API Service Functions (`src/lib/api.ts`)

- **Health Check**: `checkApiHealth()` - Verifies API connectivity
- **User Management**: 
  - `createOrUpdateUser()` - Creates or updates user profiles
  - `getUserProfile()` - Retrieves user profile data
- **AI Query Processing**: `queryAI()` - Main AI query processing with text and image support
- **Daily Recommendations**: `getDailyRecommendations()` - Fetches weather, market, and scheme data

### 2. TypeScript Integration (`src/types/index.ts`)

Added comprehensive type definitions for:
- API request/response interfaces
- Query processing types
- User management types
- Recommendation data types

### 3. Component Updates

- **Home Page** (`src/app/home/page.tsx`): Integrated real AI query processing
- **Dashboard** (`src/app/dashboard/page.tsx`): Fetches real data with fallback to mock data
- **AdviceResults** (`src/components/home/AdviceResults.tsx`): Enhanced error handling and loading states
- **AuthContext** (`src/contexts/AuthContext.tsx`): User profile sync between Firebase and Agents API

### 4. Error Handling & Fallbacks

- Graceful degradation when API is unavailable
- Comprehensive error messages and user feedback
- Loading states for better UX
- Fallback to mock data when needed

## API Endpoints Integration

### POST /query
- **Purpose**: Main AI query processing
- **Features**: Supports both text and image inputs
- **Integration**: Used in home page for crop advice generation

### POST /users
- **Purpose**: Create/update user profiles
- **Integration**: Automatically syncs Firebase user profiles with backend

### GET /users/:uid
- **Purpose**: Retrieve user profile
- **Integration**: Profile synchronization in AuthContext

### GET /recommendations/:uid
- **Purpose**: Get daily recommendations
- **Integration**: Dashboard data fetching for weather, market, and schemes

### GET /health
- **Purpose**: API health check
- **Integration**: Service availability monitoring

## Testing

A comprehensive test suite has been created (`src/lib/api-test.ts`) with:

- Individual endpoint testing functions
- Browser-compatible test runner
- Test page at `/api-test` for manual verification
- Detailed error reporting and success metrics

## Usage Examples

### AI Query Processing
```typescript
import { queryAI } from '@/lib/api';

const advice = await queryAI(
  'What should I do for yellow leaves on tomato?',
  undefined, // no image
  userId,
  'Bengaluru Urban'
);
```

### Daily Recommendations
```typescript
import { getDailyRecommendations } from '@/lib/api';

const data = await getDailyRecommendations(userId);
// Returns: weather, market, schemes, dailyPlan
```

### User Profile Sync
```typescript
import { createOrUpdateUser } from '@/lib/api';

await createOrUpdateUser(userId, profileData);
```

## Error Handling Patterns

The integration follows consistent error handling patterns:

1. **Try-Catch Blocks**: All API calls wrapped in error handling
2. **User Feedback**: Toast notifications for success/error states
3. **Loading States**: Visual indicators during API calls
4. **Fallback Data**: Mock data when API is unavailable
5. **Error Boundaries**: Graceful degradation in components

## Configuration

API configuration is centralized in `src/lib/api.ts`:

```typescript
const API_BASE_URL = 'https://us-central1-krishisaarathi.cloudfunctions.net/api';
```

## Benefits of This Integration

1. **Real-time AI Processing**: Actual crop advice generation
2. **Data Synchronization**: Consistent user profiles across systems
3. **Personalized Recommendations**: Location and profile-based suggestions
4. **Scalable Architecture**: Clean separation between UI and API logic
5. **Robust Error Handling**: Reliable user experience even during failures

## Next Steps

1. Configure Firebase credentials for full functionality
2. Add API authentication tokens if required
3. Implement caching for frequently accessed data
4. Add offline support for critical features
5. Monitor API performance and add analytics

## Testing the Integration

1. Visit `/api-test` page for manual testing
2. Use browser console: `window.apiTests.runAllApiTests()`
3. Check network tab for actual API calls
4. Verify error handling with network disconnection

The integration maintains backward compatibility while providing real API functionality, ensuring a smooth transition from mock data to live backend services.