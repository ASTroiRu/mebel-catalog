export type HomeImage = { src: string; alt: string; position?: string };
export type HomeCard = { id: string; title: string; description: string; href: string; image: HomeImage };

const kitchen: HomeImage = { src: "/images/home/kitchen.webp", alt: "Светлая кухня с древесной фактурой фасадов, островом и обеденным столом — визуализация" };
const wardrobe: HomeImage = { src: "/images/home/wardrobe.webp", alt: "Бежевый шкаф с тёмными ручками в спальне — интерьерная иллюстрация", position: "center 46%" };
const dressing: HomeImage = { src: "/images/home/dressing.webp", alt: "Гардеробная со стеклянными дверями, нижними ящиками и подсветкой — интерьерная иллюстрация" };
const coupe: HomeImage = { src: "/images/home/coupe.svg", alt: "Условная схема шкафа-купе с тремя раздвижными фасадами" };

export const heroSlides = [
  { id: "kitchens", label: "Кухни", image: kitchen },
  { id: "wardrobes", label: "Шкафы", image: wardrobe },
  { id: "dressing-rooms", label: "Гардеробные", image: dressing },
] as const;


export const benefits = [
  { title: "По вашим размерам", description: "Учитываем планировку, ниши и особенности помещения." },
  { title: "Сначала — обсуждение", description: "Обсуждаем, что вы будете хранить и как пользоваться мебелью." },
  { title: "Бесплатный замер", description: "Предварительный замер и расчёт в Москве и Московской области." },
  { title: "Понятный процесс", description: "Согласовываем проект до передачи партнёрскому производству." },
] as const;


export const processSteps = [
  { title: "Заявка", description: "Вы рассказываете, какая мебель нужна." },
  { title: "Обсуждение", description: "Уточняем пожелания, планировку и бюджет." },
  { title: "Замер", description: "Снимаем размеры и учитываем особенности помещения." },
  { title: "Проектирование", description: "Размещаем секции, полки и ящики, выбираем материалы." },
  { title: "Согласование", description: "Обсуждаем проект, комплектацию и стоимость." },
  { title: "Изготовление", description: "Передаём согласованный проект партнёрскому производству." },
  { title: "Доставка и установка", description: "Согласовываем условия доставки и монтажа." },
] as const;

export const homeConcepts: readonly (HomeCard & { category: string })[] = [
  { id: "teplyy-minimalizm", title: "Тёплый минимализм", category: "Кухня", description: "Светлые фасады с древесной фактурой, остров и место для обеденного стола.", href: "/projects/teplyy-minimalizm/", image: kitchen },
  { id: "spokoynyy-ritm", title: "Спокойный ритм", category: "Шкаф", description: "Бежевые двери до потолка и тонкие тёмные ручки.", href: "/projects/spokoynyy-ritm/", image: wardrobe },
  { id: "chistaya-geometriya", title: "Чистая геометрия", category: "Шкаф-купе", description: "Три раздвижные двери в спокойных бежевых тонах.", href: "/projects/chistaya-geometriya/", image: coupe },
  { id: "lichnoe-prostranstvo", title: "Личное пространство", category: "Гардеробная", description: "Стеклянные двери, подсветка и ящики для небольших вещей.", href: "/projects/lichnoe-prostranstvo/", image: dressing },
];

export const materials = [
  { id: "ldsp", title: "ЛДСП", description: "Плитный материал с декоративным покрытием. Используется для корпусов и полок." },
  { id: "mdf", title: "МДФ", description: "Плитный материал для гладких и фрезерованных фасадов. Отделку выбирают отдельно." },
  { id: "veneer", title: "Шпон", description: "Тонкий слой натуральной древесины с её характерным рисунком." },
  { id: "glass", title: "Стекло", description: "Прозрачные и матовые поверхности для фасадов и витрин." },
] as const;

export const homeFaq = [
  { id: "measurement", question: "Предварительный замер действительно бесплатный?", answer: "Да, предварительный замер и расчёт бесплатны. Работаем в Москве и Московской области. Детали выезда обсуждаются при записи." },
  { id: "price", question: "От чего зависит стоимость мебели?", answer: "От размеров, материалов, фурнитуры и количества секций. Чтобы рассчитать стоимость, сначала нужно понять, как будет устроена мебель." },
  { id: "sizes", question: "Можно ли изготовить мебель для нестандартной ниши?", answer: "Да, мебель можно спроектировать под нишу. После замера станет понятно, какую конструкцию удастся разместить и как её установить." },
  { id: "production", question: "Кто изготавливает мебель?", answer: "Мебель изготавливает партнёрское производство. До начала работ согласуем чертежи, материалы и комплектацию." },
  { id: "time", question: "Сколько времени займут изготовление и установка?", answer: "Сроки зависят от проекта и комплектации. Их нужно согласовать индивидуально; на демосайте фиксированных сроков нет." },
  { id: "photos", question: "На сайте показаны выполненные проекты?", answer: "Нет. Сейчас здесь демонстрационные модели, интерьерные иллюстрации и концепты. Они не являются портфолио выполненных заказов компании." },
] as const;
