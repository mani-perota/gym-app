# 🏋️ Gym App

Aplicación de seguimiento de ejercicios con un diseño pastel minimalista y moderno.

## 📱 Stack Tecnológico

- **Framework:** React Native con Expo (Managed Workflow SDK 52+)
- **Estilos:** NativeWind v4 (TailwindCSS para React Native)
- **Navegación:** Expo Router v4 (file-based routing)
- **Animaciones:** react-native-reanimated v3
- **Fuentes:** Google Fonts (Nunito, Quicksand)
- **Iconos:** lucide-react-native
- **TypeScript:** Configuración estricta

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Ejecutar en iOS
npm run ios

# Ejecutar en Android
npm run android
```

## 📁 Estructura del Proyecto

```
├── app/                    # Expo Router - File-based routing
│   ├── (tabs)/             # Tab navigator group
│   │   ├── _layout.tsx     # Configuración de tabs
│   │   ├── index.tsx       # Pantalla Home
│   │   ├── progress.tsx    # Pantalla Progreso
│   │   ├── diary.tsx       # Pantalla Diario
│   │   └── settings.tsx    # Pantalla Ajustes
│   └── _layout.tsx         # Layout raíz
├── components/
│   ├── ui/                 # Componentes atómicos reutilizables
│   │   ├── Card.tsx
│   │   ├── FabMic.tsx
│   │   ├── GradientBackground.tsx
│   │   └── ProgressBar.tsx
│   ├── home/               # Componentes específicos de Home
│   │   ├── Header.tsx
│   │   ├── DailySummaryCard.tsx
│   │   ├── ActivityItem.tsx
│   │   └── RecentActivityList.tsx
│   └── navigation/         # Componentes de navegación
│       └── BottomTabBar.tsx
├── constants/              # Constantes (colores, etc.)
├── types/                  # TypeScript interfaces
└── global.css              # Estilos globales de Tailwind
```

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Background | `#FDFBF7` | Fondo principal |
| Card | `#FFFFFF` | Tarjetas y contenedores |
| Text | `#4A4A6A` | Texto principal |
| Blue | `#E0E7FF` / `#818CF8` | Acento azul |
| Pink | `#FCE7F3` / `#F472B6` | Acento rosa |
| Green | `#D1FAE5` / `#34D399` | Acento verde |
| Lavender | `#E9D5FF` | Gradiente FAB |
| Peach | `#FFedd5` | Gradiente FAB |

## 📝 Licencia

MIT




