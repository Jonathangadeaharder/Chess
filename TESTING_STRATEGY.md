# Testing Strategy - Grandmaster Path Chess App

## Overview

This document outlines the comprehensive testing strategy for the Grandmaster Path chess application. Our goal is to ensure code quality, catch regressions early, and maintain confidence in our refactored architecture.

## Testing Philosophy

**Core Principles:**

1. **Test behavior, not implementation** - Focus on what components do, not how they do it
2. **Write tests that give confidence** - Prioritize tests that catch real bugs
3. **Maintain tests like production code** - Keep tests clean, readable, and maintainable
4. **Test at the right level** - Use the simplest test that gives confidence
5. **No test suppressions** - If a test is flaky or wrong, fix it

## Testing Stack

### Frameworks & Libraries

- **Jest** - Test runner and assertion library
- **React Native Testing Library** - Component testing utilities
- **@testing-library/react-hooks** - Hook testing utilities
- **jest-expo** - Jest preset for Expo projects
- **@testing-library/jest-native** - Custom matchers for React Native

### Tools

- **TypeScript** - Type-safe tests
- **Mock Service Worker (future)** - API mocking
- **Detox (future)** - E2E testing

## Test Pyramid

```
        /\
       /E2E\         10% - Full user flows (future)
      /------\
     /  INT   \      30% - Feature integration tests
    /----------\
   /    UNIT    \    60% - Unit & component tests
  /--------------\
```

### Unit Tests (60%)

**What:** Pure functions, utilities, helpers
**Why:** Fast, isolated, easy to debug
**Examples:**

- Chessboard coordinate conversions
- FEN parsing functions
- Move validation logic
- Utility helpers

### Integration Tests (30%)

**What:** Multiple components working together
**Why:** Catch issues in component interactions
**Examples:**

- Chessboard with user interactions
- Game flows (BishopsPrison, TacticalDrill)
- State management integration
- Context provider interactions

### E2E Tests (10% - Future)

**What:** Full user journeys
**Why:** Ensure app works as users expect
**Examples:**

- Complete a training drill
- Navigate through lesson
- Track progress metrics

## Test Coverage Goals

### Minimum Coverage Targets

- **Overall:** 70% (statements, branches, functions, lines)
- **Critical paths:** 90%+ (game logic, move validation, scoring)
- **Utilities:** 95%+ (pure functions should be nearly 100%)
- **UI Components:** 60%+ (focus on behavior, not rendering details)

### Critical Areas (Must Have 90%+ Coverage)

1. **Chessboard utilities** (`src/components/organisms/chessboard/utils/`)
   - coordinate.ts - Square↔pixel conversions
   - pieces.ts - FEN parsing
   - validation.ts - Move validation

2. **Game logic**
   - useGameStore (Zustand store)
   - Move execution and validation
   - Game state transitions

3. **Core contexts**
   - ChessboardPropsContext
   - ChessboardStateContext

4. **Scoring & progress**
   - XP calculation
   - ELO tracking
   - Achievement triggers

### Medium Priority (70%+ Coverage)

1. **Chessboard components**
   - Piece.tsx - Gesture interactions
   - Chessboard.tsx - Imperative API
   - ChessboardBackground.tsx

2. **Training components**
   - TacticalDrill
   - BishopsPrison
   - EndgameDrills

3. **Services**
   - Audio service
   - Analytics tracking
   - Spaced repetition (SR-2)

### Lower Priority (50%+ Coverage)

1. **Screen components** - Focus on critical interactions only
2. **Navigation** - Test key user flows
3. **UI/Styling components** - Visual regression testing (future)

## Test Organization

### File Structure

```
src/
├── components/
│   └── organisms/
│       └── chessboard/
│           ├── __tests__/              # Component tests
│           │   ├── Chessboard.test.tsx
│           │   ├── Piece.test.tsx
│           │   └── Pieces.test.tsx
│           ├── utils/
│           │   ├── __tests__/          # Utility tests
│           │   │   ├── coordinates.test.ts
│           │   │   ├── pieces.test.ts
│           │   │   └── validation.test.ts
│           │   ├── coordinates.ts
│           │   ├── pieces.ts
│           │   └── validation.ts
│           └── contexts/
│               ├── __tests__/          # Context tests
│               │   ├── ChessboardPropsContext.test.tsx
│               │   └── ChessboardStateContext.test.tsx
│               ├── ChessboardPropsContext.tsx
│               └── ChessboardStateContext.tsx
└── __tests__/
    ├── integration/                     # Integration tests
    │   ├── BishopsPrison.integration.test.tsx
    │   └── TacticalDrill.integration.test.tsx
    └── setup/                           # Test setup & config
        ├── jest.setup.ts
        ├── test-utils.tsx              # Custom render functions
        └── mocks.ts                     # Shared mocks
```

### Naming Conventions

- **Unit tests:** `[filename].test.ts(x)`
- **Integration tests:** `[feature].integration.test.tsx`
- **E2E tests:** `[flow].e2e.test.ts`

## Testing Best Practices

### DO ✅

1. **Test user-facing behavior**

   ```typescript
   // ✅ Good - Tests what user sees
   expect(screen.getByText('Checkmate!')).toBeOnTheScreen();

   // ❌ Bad - Tests implementation
   expect(component.state.isCheckmate).toBe(true);
   ```

2. **Use accessible queries**

   ```typescript
   // ✅ Good - Accessible query
   screen.getByRole('button', { name: 'Make Move' });
   screen.getByLabelText('Chess piece');
   screen.getByText('Your turn');

   // ❌ Bad - Implementation detail
   screen.getByTestId('move-button-123');
   ```

3. **Write descriptive test names**

   ```typescript
   // ✅ Good - Clear what's being tested
   it('should convert square "e4" to pixel coordinates (320, 256) on white-oriented board', () => {

   // ❌ Bad - Unclear
   it('should work', () => {
   ```

4. **Arrange-Act-Assert pattern**

   ```typescript
   it('should highlight legal moves when piece is selected', () => {
     // Arrange - Set up test state
     const { getByTestId } = render(<Chessboard />);

     // Act - Perform action
     fireEvent.press(getByTestId('piece-e2'));

     // Assert - Check result
     expect(screen.getByTestId('square-e3')).toHaveStyle({ backgroundColor: 'green' });
   });
   ```

5. **Mock external dependencies**

   ```typescript
   // Mock sound service
   jest.mock('../../services/audio/soundService', () => ({
     playSound: jest.fn(),
     playSoundSequence: jest.fn(),
   }));
   ```

### DON'T ❌

1. **Don't test implementation details**
   - Internal state
   - Private methods
   - Component structure

2. **Don't test third-party libraries**
   - chess.js is already tested
   - React Native is already tested
   - Focus on YOUR code

3. **Don't write brittle tests**
   - Avoid snapshot tests for complex UI
   - Don't rely on timing (use waitFor)
   - Don't test CSS/styling details

4. **Don't skip cleanup**
   - Always clean up timers, intervals, listeners
   - Use proper teardown in afterEach

## Test Examples

### 1. Utility Function Test

```typescript
// src/components/organisms/chessboard/utils/__tests__/coordinates.test.ts
import { getSquareFromCoords, getCoordsFromSquare } from '../coordinates';

describe('coordinates.ts', () => {
  describe('getSquareFromCoords', () => {
    it('should convert pixel (0, 0) to square "a8" on white-oriented board', () => {
      const result = getSquareFromCoords(0, 0, 64, 'white');
      expect(result).toBe('a8');
    });

    it('should convert pixel (448, 448) to square "h1" on white-oriented board', () => {
      const result = getSquareFromCoords(448, 448, 64, 'white');
      expect(result).toBe('h1');
    });

    it('should convert pixel (0, 0) to square "h1" on black-oriented board', () => {
      const result = getSquareFromCoords(0, 0, 64, 'black');
      expect(result).toBe('h1');
    });
  });
});
```

### 2. Context Test

```typescript
// src/components/organisms/chessboard/contexts/__tests__/ChessboardPropsContext.test.tsx
import { renderHook } from '@testing-library/react-hooks';
import { ChessboardPropsProvider, useChessboardProps } from '../ChessboardPropsContext';

describe('ChessboardPropsContext', () => {
  it('should provide default configuration values', () => {
    const wrapper = ({ children }) => (
      <ChessboardPropsProvider size={512}>{children}</ChessboardPropsProvider>
    );

    const { result } = renderHook(() => useChessboardProps(), { wrapper });

    expect(result.current.size).toBe(512);
    expect(result.current.orientation).toBe('white');
    expect(result.current.showCoordinates).toBe(false);
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useChessboardProps());
    }).toThrow('useChessboardProps must be used within ChessboardPropsProvider');
  });
});
```

### 3. Component Test

```typescript
// src/components/organisms/chessboard/__tests__/Chessboard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import Chessboard from '../Chessboard';

describe('Chessboard', () => {
  it('should render with default position', () => {
    const { getByTestId } = render(<Chessboard size={512} />);

    // Check that board is rendered
    expect(getByTestId('chessboard')).toBeTruthy();
  });

  it('should call onMove callback when valid move is made', () => {
    const onMove = jest.fn();
    const { getByTestId } = render(
      <Chessboard size={512} onMove={onMove} interactionMode="tap-tap" />
    );

    // Simulate tap-tap move
    fireEvent.press(getByTestId('square-e2')); // Select
    fireEvent.press(getByTestId('square-e4')); // Move

    expect(onMove).toHaveBeenCalledWith('e2', 'e4');
  });

  it('should expose imperative API via ref', () => {
    const ref = React.createRef<ChessboardRef>();
    render(<Chessboard ref={ref} size={512} />);

    // Test imperative methods
    expect(ref.current.move).toBeDefined();
    expect(ref.current.highlight).toBeDefined();
    expect(ref.current.clearHighlights).toBeDefined();
  });
});
```

### 4. Integration Test

```typescript
// src/__tests__/integration/BishopsPrison.integration.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BishopsPrison from '../../components/organisms/BishopsPrison';

describe('BishopsPrison Integration', () => {
  it('should complete full game flow from start to checkmate', async () => {
    const onComplete = jest.fn();
    const onExit = jest.fn();

    const { getByText, getByTestId } = render(
      <BishopsPrison onComplete={onComplete} onExit={onExit} />
    );

    // Initial state
    expect(getByText("Bishop's Prison")).toBeTruthy();
    expect(getByText('Good vs. Bad Bishop')).toBeTruthy();

    // Make winning moves
    fireEvent.press(getByTestId('square-e3')); // Select king
    fireEvent.press(getByTestId('square-f4')); // Move king

    // Wait for AI response and checkmate
    await waitFor(() => {
      expect(getByText(/Excellent work!/)).toBeTruthy();
    });

    // Should call onComplete
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        true,
        expect.any(Number),
        expect.any(Number)
      );
    });
  });
});
```

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- coordinates.test.ts

# Run integration tests only
npm test -- --testPathPattern=integration

# Update snapshots (use sparingly)
npm test -- -u
```

### CI/CD Integration

- Run tests on every PR
- Require 70% coverage minimum
- Block merge if tests fail
- Run E2E tests on main branch only

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm test -- --coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Badges (Future)

- Add badges to README.md
- Track coverage trends over time
- Alert on coverage drops

## Continuous Improvement

### Monthly Reviews

1. **Review flaky tests** - Fix or remove
2. **Check coverage gaps** - Add tests for uncovered critical paths
3. **Refactor test utilities** - Keep test code DRY
4. **Update strategy** - Adapt to new features

### Test Metrics to Track

- ✅ Test execution time (keep under 30s for all unit tests)
- ✅ Test flakiness rate (target: 0%)
- ✅ Coverage percentage by module
- ✅ Number of tests per feature
- ✅ Integration test pass rate

## Future Enhancements

### Phase 2 (3-6 months)

- [ ] Visual regression testing (Percy, Chromatic)
- [ ] Performance testing (measure render times)
- [ ] Accessibility testing (react-native-a11y)

### Phase 3 (6-12 months)

- [ ] E2E testing with Detox
- [ ] API contract testing
- [ ] Load testing for multiplayer features

## Resources

### Documentation

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Team Guidelines

- Review test strategy quarterly
- All new features require tests
- Fix broken tests immediately
- No skipping tests without ticket

---

**Last Updated:** 2025-11-20
**Version:** 1.0
**Owner:** Engineering Team
