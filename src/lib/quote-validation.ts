export type QuoteValues = {
  categoryId: string; width: string; height: string; depth: string;
  name: string; phone: string; comment: string; consent: boolean;
};
export type QuoteField = keyof QuoteValues | 'file';
export type QuoteErrors = Partial<Record<QuoteField, string>>;
export type LocalFile = Pick<File, 'name' | 'type' | 'size'>;
export const emptyQuote: QuoteValues = { categoryId:'', width:'', height:'', depth:'', name:'', phone:'', comment:'', consent:false };
export const DEMO_SUCCESS = 'Форма проверена. Это демонстрация — заявка не отправлена';

export function validateFile(file: LocalFile | null): string | undefined {
  if (!file) return;
  const types: Record<string, string> = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', pdf:'application/pdf' };
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!types[extension] || (file.type && file.type !== types[extension])) return 'Выберите файл JPG, PNG или PDF.';
  if (file.size > 10 * 1024 * 1024) return 'Размер файла не должен превышать 10 МБ.';
}

export function validateQuote(values: QuoteValues, file: LocalFile | null, categoryIds: readonly string[]): QuoteErrors {
  const errors: QuoteErrors = {};
  if (!categoryIds.includes(values.categoryId)) errors.categoryId = 'Выберите тип мебели.';
  for (const key of ['width','height','depth'] as const) {
    const value = values[key].trim();
    if (value && (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(value) || !Number.isFinite(Number(value.replace(',', '.'))) || Number(value.replace(',', '.')) <= 0)) errors[key] = 'Укажите число больше нуля.';
  }
  if (!values.name.trim()) errors.name = 'Укажите имя.';
  const phone = values.phone.trim();
  if (!/^(?:\+7|8)[\d\s()-]*$/.test(phone) || phone.replace(/\D/g, '').length !== 11) errors.phone = 'Укажите телефон в формате +7 (999) 123-45-67 или 8 (999) 123-45-67.';
  const fileError = validateFile(file);
  if (fileError) errors.file = fileError;
  if (!values.consent) errors.consent = 'Подтвердите согласие на обработку персональных данных.';
  return errors;
}
