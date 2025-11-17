# Chess Learning App - Master Universal Opening Systems

A comprehensive React Native chess learning application designed to help users master universal, mirrored chess opening systems through adaptive learning, spaced repetition, and game-based learning.

## Project Overview

This application implements the complete blueprint for a modern chess learning platform that transforms dense expert analysis into an interactive, personalized learning experience. The app uses a "Digital Coach" persona to provide Socratic guidance, integrates the FSRS spaced repetition algorithm, and features human-like AI opponents for realistic practice.

## Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | React Native + Expo | Cross-platform mobile development |
| State Management | Zustand | Lightweight, performant global state |
| Navigation | React Navigation (Bottom Tabs) | Four main sections: Learn, Train, Play, Profile |
| Chess Logic | chess.js | Move validation, FEN/PGN parsing, game state |
| Animations | react-native-reanimated | 60fps animations on UI thread |
| Gestures | react-native-gesture-handler | Drag-and-drop and tap interactions |
| Haptics | expo-haptics | Tactile feedback for moves and events |
| Audio | expo-av | Sound effects for immersive experience |
| Storage | AsyncStorage | Local persistence of user data |
| Database | expo-sqlite | SRS queue storage |

### Folder Structure (Atomic Design)

```
src/
├── components/
│   ├── atoms/          # Basic UI elements (buttons, text, icons)
│   ├── molecules/      # Compound components (move list items)
│   ├── organisms/      # Complex components (Chessboard, mini-games)
│   └── templates/      # Screen layouts
├── screens/
│   ├── Learn/          # The Academy - curriculum and learning paths
│   ├── Train/          # The Gym - SRS reviews and mini-games
│   ├── Play/           # The Sparring Ring - games vs AI
│   └── Profile/        # The Trophy Room - stats and achievements
├── navigation/         # Navigation configuration
├── state/              # Zustand stores
│   ├── gameStore.ts    # Chess game state
│   ├── userStore.ts    # User profile and progress
│   └── uiStore.ts      # UI preferences
├── services/
│   ├── chess/          # Chess utilities
│   ├── srs/            # FSRS algorithm implementation
│   ├── coach/          # Digital Coach system
│   └── ai/             # Maia AI integration
├── constants/
│   └── theme.ts        # Design system (colors, typography, themes)
└── types/
    └── index.ts        # TypeScript type definitions
```

## Core Features Implemented

### 1. Navigation System ✅

Four-tab bottom navigation:
- **Learn (The Academy)**: Structured curriculum and lessons
- **Train (The Gym)**: Daily SRS reviews and mini-games
- **Play (The Sparring Ring)**: Full games against AI
- **Profile (The Trophy Room)**: Stats, achievements, and settings

### 2. State Management ✅

Three Zustand stores:

**GameStore** (`src/state/gameStore.ts`):
- Chess game state (position, moves, turn)
- Move validation and execution
- Legal move generation
- Square selection (tap-tap mode)
- FEN position loading

**UserStore** (`src/state/userStore.ts`):
- User profile management
- Daily streak tracking
- XP and leveling system
- Achievement unlocking
- SRS queue management
- Weakness tracking
- Game history

**UIStore** (`src/state/uiStore.ts`):
- Board and piece theme selection
- Sound/haptics/animation toggles
- Coach voice preferences

### 3. Interactive Chessboard ✅

`src/components/organisms/Chessboard.tsx`

Features:
- **Tap-tap interaction**: Select piece → tap destination
- **Legal move highlighting**: Visual feedback on valid moves
- **Multiple board themes**: Modern, Wood, Neo, Classic Green, Ocean Blue
- **Coordinate display**: File and rank labels
- **Board flipping**: View from either side
- **Haptic feedback**: Tactile response to moves
- **Integrated with chess.js**: Full move validation

### 4. FSRS Spaced Repetition Algorithm ✅

`src/services/srs/fsrs.ts`

Implementation of the state-of-the-art FSRS algorithm:

- **Separates Difficulty and Stability**: More accurate than SM-2
- **Adaptive scheduling**: Personalizes to user's learning curve
- **Supports both move and concept training**: Bifurcated SRS system
- **Advanced metrics**:
  - Calculate retrievability
  - Forecast future reviews
  - Track retention rates
  - Monitor average difficulty/stability

Key functions:
- `scheduleNextReview()`: Main scheduling function
- `createSRSItem()`: Initialize new items
- `getDueItems()`: Query items due for review
- `getForecast()`: Predict future workload

### 5. Design System ✅

`src/constants/theme.ts`

**Modern, Friendly Theme**:
- Primary color: Spicy Red (#B15653)
- Clean, light backgrounds
- DM Sans typography (fallback to System)
- Comprehensive spacing scale
- Consistent border radius
- Elevation/shadow system

**Board Themes**: 5 options for user customization
**Coach Personalities**: 4 unlockable coaches with different tones

### 6. Type System ✅

`src/types/index.ts`

Comprehensive TypeScript definitions for:
- Chess types (Square, Move, Position)
- Opening systems and variations
- SRS items and parameters
- Digital Coach prompts and interventions
- Mini-game configurations
- User profile and achievements
- Game sessions and analysis
- Navigation types

### 7. Sound System ✅

`src/services/audio/soundService.ts`

Multi-sensory audio feedback using expo-av:

- **Context-aware sounds**: Different sounds for moves, captures, checks, checkmate
- **Gamification sounds**: Success, error, streak, level-up, achievement unlock
- **Smart playback**: Respects user preferences, preloading for low latency
- **Sound sequences**: Chain multiple sounds for compound events
- **Key function**: `playMoveSound()` - Intelligently selects sound based on move type

### 8. MoveTrainer Component ✅

`src/components/organisms/MoveTrainer.tsx`

SRS-based drill for learning opening sequences (Procedural Memory):

- **Progressive training**: Walk through opening lines move-by-move
- **Immediate feedback**: Visual and audio response to correct/incorrect moves
- **Adaptive rating**: Grades performance (Easy/Good/Hard/Again) based on mistakes
- **Progress tracking**: Shows move count and completion percentage
- **Integrated with FSRS**: Automatically schedules next review
- **Hint system**: Optional hints without penalty

### 9. Digital Coach Dialog ✅

`src/components/organisms/DigitalCoachDialog.tsx`

Socratic dialogue system for pedagogical guidance:

- **Multiple prompt types**: Questions, hints, explanations, encouragement
- **Coach personalities**: Friendly, Attacker, Positional, Tactical (unlockable)
- **Follow-up prompts**: Multi-step dialogues for complex concepts
- **Visual highlights**: Coordinates with board to highlight squares/arrows
- **Animated presentation**: Smooth fade and slide animations
- **Voice support**: Ready for text-to-speech integration

### 10. Bishop's Prison Mini-Game ✅

`src/components/organisms/BishopsPrison.tsx`

Asymmetric endgame drill teaching "Good vs. Bad Bishop":

- **Educational setup**: User has good bishop, AI has bad bishop
- **Win condition**: Exploit the trapped bad bishop to win the endgame
- **Integrated coach**: Socratic prompts explain the concept during play
- **Performance metrics**: Tracks moves and time to completion
- **Concept reinforcement**: Clear explanation of good vs. bad bishops
- **Replayability**: Reset and try different approaches

### 11. Opening Lines Database ✅

`src/constants/openingLines.ts`

Sample repertoire for 5 universal opening systems:

- **King's Indian Attack**: 2 lines with variations
- **Colle System**: Main line with e4 break
- **Stonewall Attack**: Classic pawn chain formation
- **London System**: Early Bf4 development
- **Torre Attack**: Classical pin setup
- **Utility functions**: Get lines by system, random selection, ID lookup

## Key Design Principles

### 1. Pedagogical First

The app rejects the "engine-first" approach. Instead of raw evaluations (-3.1), it uses a **Digital Coach** that provides:
- Socratic questions ("What square is critical for your opponent?")
- Contextual hints
- Visual highlighting
- Encouraging guidance

### 2. Bifurcated SRS System

Solves the "Chessable Problem":
- **MoveTrainer**: Drills procedural memory (move sequences)
- **ConceptTrainer**: Drills declarative memory (strategic understanding)

### 3. Game-Based Learning

Beyond simple gamification:
- Mini-games use **asymmetric mechanics** to teach concepts
- Examples: Bishop's Prison, Transposition Maze, The Fuse
- Intrinsically fun while teaching strategy

### 4. Human-Like AI

Uses **Maia neural network**:
- Trained on millions of human games
- Makes realistic human mistakes (not random blunders)
- Different ELO levels (1100, 1300, 1500, 1900)
- Teaches users to punish actual human errors

## Running the Application

### Prerequisites

```bash
node >= 18
npm or yarn
expo-cli
```

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS (requires macOS)
npm run web      # Web browser
```

### Project Setup

The app initializes on launch:
1. Loads user profile from AsyncStorage
2. Loads UI settings
3. Initializes SRS queue
4. Sets up navigation

## Current Status

### ✅ Completed (Phase 1)

**Core Architecture:**
- [x] Project setup with TypeScript and Expo
- [x] Atomic Design folder structure
- [x] Bottom tab navigation (4 screens)
- [x] Three Zustand stores (game, user, UI)
- [x] Complete type definitions (200+ lines)
- [x] Theme system with multiple board themes
- [x] User profile and streak tracking

**Interactive Components:**
- [x] Interactive chessboard component with chess.js
- [x] Tap-tap interaction mode
- [x] Legal move highlighting
- [x] Haptic feedback integration
- [x] Sound system integration (expo-av)
- [x] FSRS algorithm implementation

**Pedagogical Features:**
- [x] Digital Coach dialog component with Socratic prompts
- [x] MoveTrainer component for SRS move drills
- [x] Bishop's Prison mini-game (Good vs. Bad Bishop)
- [x] Sample opening lines data (5 systems)
- [x] Interactive Play screen with chessboard demo

### 🚧 In Progress / Pending (Phase 2)

**Core Features:**
- [ ] ConceptTrainer component (strategic flashcards)
- [ ] SQLite database setup for SRS persistence
- [ ] Achievement system implementation
- [ ] More mini-games (Transposition Maze, The Fuse, Blunder Hunter)
- [ ] Drag-and-drop interaction mode
- [ ] SVG drawing layer for arrows/highlights

**Integration & Backend:**
- [ ] Firebase/Supabase backend setup
- [ ] Daily streak validation (server-side)
- [ ] Maia AI integration via API
- [ ] Weakness Finder (PGN analysis)
- [ ] External account linking (Lichess, Chess.com)

**Content & UX:**
- [ ] Onboarding flow (Playstyle Sorter quiz)
- [ ] Curriculum system (lesson modules)
- [ ] Full Learn screen with lessons
- [ ] Full Train screen with SRS queue
- [ ] Analytics and progress tracking

## Next Steps

### Immediate Priorities

1. **Test the chessboard**: Add it to a screen and verify functionality
2. **Implement sound system**: Add move sounds using expo-av
3. **Create MoveTrainer component**: First SRS drill interface
4. **Build first mini-game**: Bishop's Prison as proof of concept
5. **Implement Digital Coach dialog**: Modal with Socratic prompts

### Medium-Term Goals

1. Complete the bifurcated SRS system
2. Create 3-5 mini-games covering key concepts
3. Set up SQLite for persistent SRS storage
4. Implement achievement system
5. Build onboarding flow

### Long-Term Goals

1. Backend integration (Firebase/Supabase)
2. Maia AI integration via API
3. Weakness Finder with PGN analysis
4. Full curriculum system
5. Analytics and progress tracking

## Testing Strategy

### Manual Testing Checklist

- [ ] Board renders correctly with starting position
- [ ] Pieces can be selected (highlighted with legal moves)
- [ ] Legal moves are visually highlighted
- [ ] Moves can be made via tap-tap
- [ ] Illegal moves are rejected
- [ ] Haptic feedback fires on moves
- [ ] Board themes can be changed
- [ ] User profile persists across app restarts
- [ ] SRS items can be created and scheduled
- [ ] Navigation between tabs works smoothly

### Unit Tests (Future)

- FSRS algorithm correctness
- Move validation logic
- SRS scheduling calculations
- Achievement unlock conditions

## Contributing Guidelines

### Code Style

- Use TypeScript for all new files
- Follow Atomic Design for components
- Use functional components with hooks
- Prefer `const` over `let`
- Add JSDoc comments for complex functions
- Keep files under 300 lines

### Commit Messages

Format: `[Component] Brief description`

Examples:
- `[Chessboard] Add drag-and-drop support`
- `[FSRS] Fix stability calculation`
- `[Coach] Implement Socratic prompts for opening errors`

## Resources

### Key Dependencies

- [chess.js documentation](https://github.com/jhlywa/chess.js)
- [FSRS algorithm paper](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo docs](https://docs.expo.dev/)

### Design References

- Chessable MoveTrainer
- Dr. Wolf chess app (Digital Coach inspiration)
- Lichess UI/UX
- Maia Chess (human-like AI)

## License

[To be determined]

## Authors

Built following the comprehensive blueprint for an adaptive chess learning application.

---

**Version**: 0.1.0 (Initial Implementation)
**Last Updated**: 2025-11-17
