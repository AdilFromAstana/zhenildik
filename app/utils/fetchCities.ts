// utils/fetchCities.ts
export async function fetchCities() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`, {
    // 👇 позволит Next.js переиспользовать ответ
    next: { revalidate: 3600 }, // обновлять кэш раз в час
  });
  return res.json();
}
