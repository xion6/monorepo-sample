# @ecommerce/ui

E-commerceプラットフォーム専用のReactコンポーネントライブラリ。React 19とTypeScriptによる型安全で再利用可能なUIコンポーネントを提供します。

## 🎯 概要

`@ecommerce/ui`は、E-commerceアプリケーション向けに設計された統一されたUIコンポーネントライブラリです。デザインシステムに基づいた一貫性のあるユーザー体験と、開発者にとって使いやすいAPIを提供します。

## 🛠️ 技術スタック

### コア技術

- **React 19.0.0**: 最新のReact機能とパフォーマンス最適化
- **TypeScript 5**: 完全な型安全性とIntelliSense対応
- **CSS-in-JS**: ランタイムスタイリング（Emotion/Styled-components対応）

### 設計原則

- **Atomic Design**: Atoms、Molecules、Organismsによる階層設計
- **Accessibility First**: WCAG 2.1 AAレベル準拠
- **Design Tokens**: 一貫したテーマシステム
- **Tree Shaking**: 未使用コンポーネントの自動除去

## 🚀 開発コマンド

### 基本操作

```bash
# TypeScript ビルド
pnpm build

# 開発モード（watch mode）
pnpm dev

# ビルド成果物削除
pnpm clean
```

### ルートレベルからの操作

```bash
# UI パッケージのみビルド
pnpm --filter @ecommerce/ui build

# UI パッケージのみ開発モード
pnpm --filter @ecommerce/ui dev
```

## 📦 インストール・使用方法

### 他のワークスペースでの利用

```bash
# webアプリケーションに追加
pnpm --filter @ecommerce/web add @ecommerce/ui@workspace:*
```

### インポートと使用

```typescript
import { Button, Card, Input, Badge } from '@ecommerce/ui';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <Card.Header>
        <h3>{product.name}</h3>
        <Badge variant="success">在庫あり</Badge>
      </Card.Header>
      <Card.Body>
        <p>{product.description}</p>
        <Input placeholder="数量" type="number" />
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" size="large">
          カートに追加
        </Button>
      </Card.Footer>
    </Card>
  );
}
```

## 📁 ディレクトリ構造

```
packages/ui/
├── src/
│   ├── components/         # UIコンポーネント
│   │   ├── atoms/         # 基本コンポーネント
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Badge/
│   │   │   └── index.ts
│   │   ├── molecules/     # 複合コンポーネント
│   │   │   ├── Card/
│   │   │   ├── SearchBox/
│   │   │   └── index.ts
│   │   └── organisms/     # 複雑なコンポーネント
│   │       ├── ProductGrid/
│   │       ├── Navigation/
│   │       └── index.ts
│   ├── theme/             # デザインシステム
│   │   ├── tokens.ts      # デザイントークン
│   │   ├── colors.ts      # カラーパレット
│   │   └── typography.ts  # タイポグラフィ
│   ├── hooks/             # カスタムHooks
│   ├── utils/             # ユーティリティ関数
│   └── index.ts          # パブリックAPI
├── dist/                  # ビルド成果物
└── tsconfig.json         # TypeScript設定
```

## 🎨 コンポーネント設計

### Atomsレベル - Button

```typescript
// src/components/atoms/Button/Button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}) => {
  const buttonClasses = cn(
    'inline-flex items-center justify-center font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      // Variant styles
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
      'bg-transparent text-gray-700 hover:bg-gray-100': variant === 'ghost',

      // Size styles
      'px-3 py-1.5 text-sm': size === 'small',
      'px-4 py-2 text-base': size === 'medium',
      'px-6 py-3 text-lg': size === 'large',

      // State styles
      'opacity-50 cursor-not-allowed': disabled || loading,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="mr-2" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

### Moleculesレベル - Card

```typescript
// src/components/molecules/Card/Card.tsx
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const CardContext = React.createContext<{ variant: string }>({ variant: 'default' });

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({
  variant = 'default',
  padding = 'medium',
  className,
  children,
  ...props
}) => {
  const cardClasses = cn(
    'rounded-lg',
    {
      'bg-white border border-gray-200': variant === 'default',
      'bg-white border-2 border-gray-300': variant === 'outlined',
      'bg-white shadow-lg': variant === 'elevated',

      'p-0': padding === 'none',
      'p-3': padding === 'small',
      'p-4': padding === 'medium',
      'p-6': padding === 'large',
    },
    className
  );

  return (
    <CardContext.Provider value={{ variant }}>
      <div className={cardClasses} {...props}>
        {children}
      </div>
    </CardContext.Provider>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
```

### Organismsレベル - ProductGrid

```typescript
// src/components/organisms/ProductGrid/ProductGrid.tsx
export interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 3,
  loading = false,
  onProductClick,
  onAddToCart,
}) => {
  if (loading) {
    return <ProductGridSkeleton columns={columns} />;
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        {
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
        }
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick?.(product)}
          onAddToCart={() => onAddToCart?.(product)}
        />
      ))}
    </div>
  );
};
```

## 🎭 デザインシステム

### デザイントークン

```typescript
// src/theme/tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: "#eff6ff",
      500: "#3b82f6",
      900: "#1e3a8a",
    },
    gray: {
      50: "#f9fafb",
      500: "#6b7280",
      900: "#111827",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
  },
  typography: {
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  },
} as const;
```

### テーマプロバイダー

```typescript
// src/theme/ThemeProvider.tsx
export interface ThemeProviderProps {
  theme?: Partial<typeof designTokens>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = {},
  children,
}) => {
  const mergedTheme = useMemo(
    () => mergeDeep(designTokens, theme),
    [theme]
  );

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 🔧 カスタムHooks

### useTheme

```typescript
// src/hooks/useTheme.ts
export const useTheme = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return theme;
};
```

### useDisclosure

```typescript
// src/hooks/useDisclosure.ts
export interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export const useDisclosure = (initialOpen = false): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, onOpen, onClose, onToggle };
};
```

## ♿ アクセシビリティ

### ARIA対応

```typescript
// すべてのコンポーネントでARIA属性をサポート
<Button
  aria-label="商品をカートに追加"
  aria-describedby="add-to-cart-help"
>
  追加
</Button>

<Input
  aria-label="検索キーワード"
  aria-required="true"
  aria-invalid={hasError}
/>
```

### キーボードナビゲーション

```typescript
// フォーカス管理とキーボード操作
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      onClick?.();
      break;
    case "Escape":
      onClose?.();
      break;
  }
};
```

## 🧪 テストパターン

### コンポーネントテスト

```typescript
// src/components/atoms/Button/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 🔗 関連パッケージ

- **[@ecommerce/web](../../apps/web/README.md)**: このUIライブラリを使用するWebアプリケーション
- **[@ecommerce/core](../core/README.md)**: ビジネスロジック・型定義
- **[@ecommerce/typescript-config](../../tools/typescript-config/README.md)**: 共有TypeScript設定

## 📋 ベストプラクティス

### Prop設計

```typescript
// ✅ 良い例: HTMLProps拡張
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// ✅ 良い例: 明確なUnion Type
type Size = 'small' | 'medium' | 'large';

// ❌ 悪い例: string型
size?: string;
```

### フォワードRef

```typescript
// ✅ 良い例: フォワードRef対応
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn('...', className)} {...props} />;
  }
);
```

### 複合コンポーネント

```typescript
// ✅ 良い例: 複合コンポーネントパターン
export const Card = ({ children }) => <div>{children}</div>;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
```

---

**Note**: このUIライブラリは E-commerce ドメインに特化しており、汎用的なコンポーネントライブラリとは異なります。プロダクト固有のコンポーネントも含まれているため、他プロジェクトでの再利用時は注意してください。
