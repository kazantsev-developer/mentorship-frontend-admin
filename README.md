# Платформа менторства по Go (Frontend – Admin Panel)

Административная панель для управления платформой. Реализована на Next.js + TypeScript, Tailwind CSS и HeroUI.

## Запуск через Docker Compose

git clone https://github.com/kazantsev-developer/mentorship-frontend-admin.git
cd mentorship-frontend-admin
docker-compose build --build-arg NEXT_PUBLIC_API_URL=http://185.75.189.130:8080
docker-compose up -d
Админка будет доступна по адресу http://localhost:3001.

## Локальная разработка

npm install
npm run dev

## Демо аккаунт

пароль: admin
логин: 123

## Технологии

Next.js 14 (App Router)
TypeScript
Tailwind CSS + CSS-переменные (тёмная/светлая тема)
HeroUI (Table, Card, Button, Modal, Tabs)
Iconify (иконки)
Sonner (toast-уведомления)
next-themes (переключение тем)

## Основные возможности

Дашборд – статистика платформы (пользователи, студенты, бадди, заявки 1x1, выданные достижения)
Управление пользователями – создание, редактирование, soft delete, назначение ролей (student/buddy/admin), привязка бадди к студенту
Roadmap (блоки) – создание, редактирование, сортировка, активация/деактивация блоков
Roadmap (материалы) – создание карточек (теория, вопросы, практика, домашка) с привязкой к блоку, указание обязательности, URL, включение/отключение
Достижения – управление геймификацией (название, описание, награда, иконка, активность), просмотр пользователей, получивших достижение
Заявки 1x1 – одобрение/отклонение/завершение заявок с автоматическим списанием 1000 бонусов
Просмотр прогресса студента – администратор может подтвердить любой блок в обход бадди
Статистика – общие метрики

## Проверка работы API

После запуска бэкенда выполните:

curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"login":"admin","password":"123"}'
CORS

Бэкенд должен разрешать запросы с http://localhost:3001 (порт админки). Убедитесь, что в ALLOWED_ORIGINS бэкенда добавлен этот источник.

## Переменные окружения

NEXT_PUBLIC_API_URL – URL бэкенда (по умолчанию http://localhost:8080)

NEXT_PUBLIC_MAIN_SITE_URL – URL основного сайта для кнопки перехода

### 4. Создание начальных материалов (блоков)

Через админку (порт 3001) перейдите в **Блоки** создайте блок (например, «Введение в Go»). Затем в **Материалы** добавьте несколько материалов (теория, практика) для этого блока. После этого студент увидит их на основном сайте в разделе «Траектория обучения».

### 5. Проверка демо-аккаунтов

Убедитесь, что в базе есть `test_student` и `test_buddy` (вы уже создали).
Если нет, создайте через админку или через API:

curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"login":"test_student","password":"123","display_name":"Test Student","roles":["student"]}'
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"login":"test_buddy","password":"123","display_name":"Test Buddy","roles":["buddy"]}'
