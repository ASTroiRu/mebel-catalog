export const metadata = { title: "Страница не найдена", description: "Такой страницы нет. Вернитесь на главную или в каталог мебели.", robots: { index: false, follow: false } };
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container py-20">
      <p className="demo-label mb-6">Ошибка 404</p>
      <h1 className="page-title">Страница не найдена</h1>
      <p className="mt-6 max-w-xl text-muted">Проверьте адрес или вернитесь на главную страницу. Сайт находится в разработке.</p>
      <Link href="/" className="button button-primary mt-8">На главную</Link>
    </div>
  );
}
