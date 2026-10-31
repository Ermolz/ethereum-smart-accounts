# Джерела та межі перевірки

Матеріал описує EIP-7702 у статусі **Final** і його застосування до програмованих Ethereum-акаунтів. Дати подій відокремлені від дат оновлення документації. Наявність функції в конкретному гаманці чи мережі необхідно перевіряти окремо.

## Нормативна специфікація

**Ethereum/EIPs, коміт `bbc3f95844c37612a2f1b9e7477990bb717ecfa0`, файл `EIPS/eip-7702.md`.** Посилання нижче незмінні та не залежать від гілки репозиторію.

| Твердження | Доказ |
|---|---|
| Формат транзакції та списку authorization | [L64–L82](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L64-L82) |
| Обмеження полів транзакції | [L80–L94](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L80-L94) |
| Authorization обробляється після збільшення nonce відправника й до execution | [L101–L102](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L101-L102) |
| Підписаний digest, відновлення authority, chain ID і nonce | [L107–L115](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L107-L115) |
| Запис індикатора, очищення нульовою адресою, збільшення nonce authority | [L118–L124](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L118-L124) |
| Пропуск authorization, що не пройшла перевірки | [L126–L128](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L126-L128) |
| Запис делегування не відкочується через наступну помилку execution | [L130–L132](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L130-L132) |
| Код реалізації виконується в контексті authority | [L136–L140](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L136-L140) |
| Порушення попередніх припущень щодо `tx.origin` і перевірки виконання | [L299–L325](https://github.com/ethereum/EIPs/blob/bbc3f95844c37612a2f1b9e7477990bb717ecfa0/EIPS/eip-7702.md#L299-L325) |

[Поточна офіційна сторінка EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) зручна для навігації. Для повторюваного читання конкретного тексту використовуйте наведений SHA. Це специфікація, а не код окремого Ethereum-клієнта або аудит реалізації гаманця.

## Пояснення та суміжні стандарти

| Джерело | Що підтверджує |
|---|---|
| [Ethereum: акаунти](https://ethereum.org/developers/docs/accounts/) | Базові властивості EOA, контрактних акаунтів, nonce, балансу та коду |
| [Ethereum: настанови щодо EIP-7702](https://ethereum.org/roadmap/pectra/7702) | Збереження контролю початкового ключа, відкликання делегування, ризики реалізації та сховища |
| [EIP-7702: Persistence](https://eips.ethereum.org/EIPS/eip-7702#persistence-of-code-delegation) | Фінальна модель постійного делегування; відмінність від раннього тимчасового варіанта |
| [EIP-7702: secure delegate contracts](https://eips.ethereum.org/EIPS/eip-7702#implementation-of-secure-delegate-contracts) | Окремі перевірки підписаних дій, параметрів виклику й replay protection |
| [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) | UserOperation, bundler, EntryPoint, paymasters та сумісність з EIP-7702 |
| [EIP-5792: Wallet Call API](https://eips.ethereum.org/EIPS/eip-5792) | API запиту кількох викликів і перевірки можливості атомарного виконання; API не є механізмом делегування |

## Дати подій

| Подія | Дата | Джерело |
|---|---|---|
| Активація Pectra в Ethereum mainnet | **7 травня 2025** | [Офіційна сторінка Pectra](https://ethereum.org/roadmap/pectra/) |
| Анонс активації Pectra | 23 квітня 2025 | [Ethereum Foundation](https://blog.ethereum.org/2025/04/23/pectra-mainnet) |
| Запуск підтримки smart wallets у Uniswap Wallet та Web App | **2 липня 2025** | [Анонс Uniswap](https://blog.uniswap.org/smart-wallets-are-live) |

Анонс Uniswap підтверджує доступність об’єднаних approve і swap на момент публікації. Згадані в ньому майбутні функції спонсорування не подаються в цих матеріалах як підтверджені доступні функції кожного гаманця сьогодні.

## Як перевіряти висновки

Ручні сценарії — висновки з правил специфікації за явно заданих початкових умов, а не результати транзакцій у mainnet. Псевдокод, якщо наведений, не є копією перевіреного контракту. Газові відсотки й обіцянки однакової економії для всіх сценаріїв не використовуються.

Для точності треба розділяти: валідацію всієї транзакції, обробку окремої authorization, призначення коду, авторизацію виконання гаманцем та зміни в execution. Це різні етапи з різними умовами успіху й межами відкату.
