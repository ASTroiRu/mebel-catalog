'use client';
import Image from 'next/image';
import { containDialogTab } from '@/lib/dialog-focus';
import { useEffect, useRef, useState } from 'react';
import type { ContentImage } from '@/content/models';
export function ImageGallery({ images, title }: { images: readonly (ContentImage & { caption: string })[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const image = images[index];
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    closeButton.current?.focus();
    return () => {
      dialog.current?.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, [open]);
  function move(delta: number) { setIndex(current => (current + delta + images.length) % images.length); }
  function keyboard(event: React.KeyboardEvent) {
    if (open) containDialogTab(event, dialog.current);
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); }
  }
  return <div className="product-gallery" onKeyDown={keyboard}>
    <div className="gallery-layout">
      <button ref={opener} type="button" className="gallery-main" onClick={() => setOpen(true)} aria-label={`Увеличить изображение ${index + 1}: ${title}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 90vw, 700px" style={{ objectFit: 'contain', objectPosition: image.position }} preload={index === 0} /><span className="zoom-label">Увеличить ↗</span></button>
      <div className="gallery-thumbnails" role="group" aria-label="Изображения модели">{images.map((item, i) => <button type="button" key={item.src} aria-label={`Изображение ${i + 1}: ${item.alt}`} aria-pressed={index === i} onClick={() => setIndex(i)}><Image src={item.src} alt="" fill sizes="160px" style={{ objectFit: 'cover' }} /><span className="sr-only">{item.caption}</span></button>)}</div>
    </div>
    <p className="gallery-caption" aria-live="polite">{index + 1} / {images.length} · {image.caption}</p>
    <dialog ref={dialog} className="image-dialog" aria-label={`Галерея: ${title}`} onCancel={event => { event.preventDefault(); setOpen(false); }}>
      <div className="dialog-toolbar"><span>{title} · {index + 1} / {images.length}</span><button ref={closeButton} type="button" className="button button-secondary" onClick={() => setOpen(false)}>Закрыть</button></div>
      {open && <div className="dialog-image"><Image src={image.src} alt={image.alt} fill sizes="90vw" loading="eager" style={{ objectFit: 'contain' }} /></div>}
      <p className="gallery-caption" aria-live="polite">{image.caption}</p>
      <div className="dialog-controls"><button type="button" className="button button-secondary" onClick={() => move(-1)} aria-label="Предыдущее изображение">← Назад</button><button type="button" className="button button-secondary" onClick={() => move(1)} aria-label="Следующее изображение">Далее →</button></div>
    </dialog>
  </div>;
}
