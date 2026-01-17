# Решение проблемы "Rendered more hooks than during the previous render"

## Суть задачи
Решить проблему с ошибкой React "Rendered more hooks than during the previous render" в приложении TodoList.

## Главный инсайт
Ошибка происходила из-за потенциально нестабильного рендеринга компонентов ProfileBadge и ProfileSettings, которые оба использовали один и тот же хук useUserProfile, но могли возвращать разное количество элементов в зависимости от состояния загрузки профиля.

## Проблема
Ошибка "Rendered more hooks than during the previous render" обычно возникает, когда:
- Хуки вызываются в разном порядке при разных рендерах
- Компоненты, использующие хуки, рендерятся условно
- Количество вызовов хуков меняется между рендерами

## Решение
1. Создана обертка `ProfileComponentsWrapper`, которая:
   - Всегда отображает одинаковое количество элементов
   - Правильно обрабатывает состояние загрузки
   - Предотвращает изменение DOM-структуры при смене состояния

2. Обновлен компонент Index.tsx:
   - Заменены отдельные компоненты ProfileBadge и ProfileSettings на единую обертку
   - Обеспечен стабильный порядок рендеринга

3. Дополнительно обновлен компонент Index.tsx:
   - ScrollNav теперь отображается только при наличии загруженного профиля
   - Это предотвращает возможные конфликты с хуками во время начальной загрузки

## Код изменений

### Новая обертка (src/components/ProfileComponentsWrapper.tsx):
```tsx
"use client";

import React from "react";
import { ProfileBadge } from "@/components/ProfileBadge";
import { ProfileSettings } from "@/components/ProfileSettings";
import { motion } from "framer-motion";

interface ProfileComponentsWrapperProps {
  profile: any;
  isLoading: boolean;
}

export const ProfileComponentsWrapper: React.FC<ProfileComponentsWrapperProps> = ({ 
  profile, 
  isLoading 
}) => {
  if (isLoading || !profile) {
    // Возвращаем пустой контейнер с тем же размером, чтобы не изменять DOM структуру
    return (
      <div className="flex items-center gap-3 opacity-0 pointer-events-none h-16">
        <div className="w-16 h-16" />
        <div className="w-24 h-10" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="flex items-center gap-3"
    >
      <ProfileBadge />
      <ProfileSettings />
    </motion.div>
  );
};
```

### Обновление в Index.tsx:
- Импорт изменен с двух отдельных компонентов на обертку
- JSX обновлен для использования новой обертки
- Добавлено условие для рендеринга ScrollNav только при наличии профиля

## Результат
- Ошибка "Rendered more hooks than during the previous render" устранена
- Стабильный порядок вызова хуков
- Корректная обработка состояния загрузки профиля
- Улучшенная структура рендеринга компонентов профиля

## Проверка
Все компоненты теперь соответствуют правилам React-хуков:
- Хуки вызываются на верхнем уровне компонента
- Порядок вызова хуков не изменяется между рендерами
- Условный рендеринг не влияет на количество вызываемых хуков