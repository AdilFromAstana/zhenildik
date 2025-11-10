export async function fetchCities() {
  console.log("`${process.env.NEXT_PUBLIC_API_URL}/cities`: ", `${process.env.NEXT_PUBLIC_API_URL}/cities`)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`);

    if (!res.ok) {
      // например, 404 или 500
      console.error(
        `[fetchCities] ❌ Ошибка запроса: ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data = await res.json();
    console.log("data: ", data)

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    console.error(
      `[fetchCities] ⚠️ Непредвиденный формат данных: ${JSON.stringify(data)}`
    );
    return [];
  } catch (err: any) {
    console.error(`[fetchCities] 💥 Ошибка при загрузке:`, err.message || err);
    return [];
  }
}
