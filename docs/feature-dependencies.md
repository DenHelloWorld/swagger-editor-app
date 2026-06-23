## Таблица зависимостей

| Фича                                                        | Зависит от                                                                        | Можно начать сразу     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------- |
| Feature 6: About Page                                       | —                                                                                 | ✅                     |
| Feature 3: Swagger Editor (парсинг, валидация, конвертация) | —                                                                                 | ✅                     |
| Feature 2: Sign In / Sign Up                                | БД/Auth-сервис (Firebase/Supabase)                                                | ⚠️ после выбора БД     |
| Feature 4: Swagger Viewer + Try-It-Out                      | Feature 3 (общий стор со схемой) + CORS-proxy (API route) + схема `RequestRecord` | ⚠️ можно на моке схемы |
| Feature 1: Header                                           | Feature 2 (auth-контекст)                                                         | ❌                     |
| Feature 3: сохранение схемы                                 | Feature 2 + БД                                                                    | ❌                     |
| Feature 7: i18n, sticky header, error handling              | Feature 1 (header готов)                                                          | ❌                     |
| Feature 5: History & Analytics                              | Feature 2 (юзер) + Feature 4 (запросы) + схема `RequestRecord`                    | ❌                     |

## Схема зависимостей

```
Feature 6: About Page          (независима)

Feature 3: Editor (базовая)    (независима)
        │
        ▼
Feature 4: Swagger Viewer + Try-It-Out
        │
        └──────────────────────┐
                               ▼
БД/Auth ──► Feature 2: Sign In/Sign Up
                    │
                    ├──► Feature 1: Header
                    │           │
                    │           ▼
                    │    Feature 7: i18n, sticky header
                    │
                    ├──► Feature 3: сохранение схемы
                    │
                    └──► Feature 5: History & Analytics
```
