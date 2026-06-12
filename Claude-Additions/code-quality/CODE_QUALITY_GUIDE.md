# Code Quality Improvements Guide

Systematic approach to maintaining clean, maintainable code.

## 1. Type Safety Audit (2-3 days)

### Current State Check
```bash
# See TypeScript coverage
npm run build:types

# Find "any" types
grep -r ": any" src/
grep -r "as any" src/
```

### Improvements

**Goal:** 95%+ of code has explicit types

**Priority:**
- [ ] Remove `any` types
- [ ] Add return types to functions
- [ ] Create interfaces for API responses
- [ ] Strict mode in tsconfig.json

**Example Fix:**
```typescript
// Before
const handleSubmit = (data) => {
  // ...
};

// After
interface FormData {
  name: string;
  email: string;
}

const handleSubmit = (data: FormData): void => {
  // ...
};
```

### Tools
- TypeScript strict mode
- `typescript-eslint`
- IDE type checking

---

## 2. Component Library (2-3 days)

### Build Reusable Components

**Core components to create:**
```
components/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── Card.tsx
├── Modal.tsx
├── Table.tsx
├── Badge.tsx
├── Alert.tsx
└── Spinner.tsx
```

**Each component should have:**
- PropTypes / TypeScript interface
- Storybook story
- Unit tests
- Documentation

### Storybook Setup
```bash
npm install -D @storybook/react @storybook/addon-docs
npx storybook init
```

### Example Component
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
}: ButtonProps) {
  const classes = {
    primary: 'bg-indigo-600 text-white',
    secondary: 'bg-gray-200 text-gray-900',
    danger: 'bg-red-600 text-white',
  }[variant];

  return (
    <button
      className={`px-4 py-2 rounded ${classes}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

---

## 3. Test Coverage (Ongoing)

### Testing Strategy

**Unit Tests (100%):**
- Utils
- Helpers
- Custom hooks

**Component Tests (80%+):**
- Critical UI (forms, modals)
- State changes
- Error states

**Integration Tests (50%+):**
- Key workflows
- Multi-step processes
- API interactions

**E2E Tests (Critical paths):**
- Login → Book → Confirm
- Admin → Create Campaign → Send

### Test Structure
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── utils/
│   ├── helpers.ts
│   └── helpers.test.ts
└── hooks/
    ├── useAuth.ts
    └── useAuth.test.ts
```

### Example Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Coverage Goals
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## 4. Config Abstraction (1-2 days)

### Move All Config to One Place

**Create `/src/config/index.ts`:**
```typescript
export const CONFIG = {
  API: {
    TIMEOUT: 5000,
    MAX_RETRIES: 3,
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  },
  FIREBASE: {
    PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    // ...
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 50,
    MAX_PAGE_SIZE: 1000,
  },
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\d{10,}$/,
  },
  FEATURES: {
    ENABLE_MARKETING: process.env.REACT_APP_ENABLE_MARKETING === 'true',
    ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  },
};
```

**Benefits:**
- Single source of truth
- Easy to change values
- Environment-specific configs
- Feature flags

---

## 5. Linting & Formatting (1 day)

### ESLint Setup
```bash
npm install -D eslint eslint-config-airbnb-typescript
```

### Prettier Setup
```bash
npm install -D prettier prettier-eslint
```

### Pre-commit Hooks
```bash
npm install -D husky lint-staged

# Setup
npx husky install
npx husky add .husky/pre-commit 'npm run lint-staged'
```

**package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,json,md}": ["prettier --write"]
  }
}
```

### Benefits
- Consistent style across team
- Catch errors before commit
- Automatic formatting
- Less code review friction

---

## 6. Documentation (Ongoing)

### What to Document

**Code:**
- Complex algorithms
- Non-obvious logic
- Performance-critical sections
- Gotchas and edge cases

**Architecture:**
- System diagram
- Data flow
- External integrations
- Deployment process

**Setup:**
- Prerequisites
- Installation steps
- Environment variables
- Development workflow

### Example Doc
```typescript
/**
 * Calculate Client Lifetime Value
 *
 * Uses historical spending + projected future value
 * Projection assumes 12-month look-ahead at current booking rate
 *
 * @param clientId - Client to calculate CLV for
 * @param orgId - Organization ID
 * @returns CLV breakdown with confidence score
 */
export async function calculateCLV(
  clientId: string,
  orgId: string
): Promise<CLVResult> {
  // Implementation
}
```

---

## 7. Error Handling (1-2 days)

### Create Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Wrap App
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Implementation Order

**Week 1:** Type safety + ESLint/Prettier
**Week 2:** Component library start
**Week 3:** Test coverage increase
**Week 4:** Config abstraction + Documentation

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Type coverage | ___ | 95%+ |
| Test coverage | ___ | 70%+ |
| Lint errors | ___ | 0 |
| Code duplication | ___ | <5% |
| Avg function size | ___ | <30 lines |

## Tools & Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Storybook](https://storybook.js.org/)
